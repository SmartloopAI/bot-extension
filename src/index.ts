// Copyright 2018 The Recime Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {FBExtension} from './ext/facebook';
import {VBExtension} from './ext/viber';
import {WebExtension} from './ext/web';

export namespace Viber {

  export enum TextSize{
      regular,
      medium,
      large
  }

  export enum ActionType {
      reply,
      "open-url"
  }

  export enum TextVAlign {
      top,
      middle,
      bottom
  }

  export enum TextHAlign {
      left,
      center,
      right
  }

  export interface Font {
      bold?: Boolean,
      color?: String
  }

  export class FontImpl {
      private text: string;
      private _color:String;
    
      set color(color){
          this._color = color;
      }

      constructor(text) {
          this.text = text;
      }

      toJSONObject(){
          if (this._color && this.text){
              return `<font color=\"${this._color}\">${this.text}</font>`;
          }
          return this.text || "";
      }
  } 

  class FontBold extends FontImpl {
      
      constructor(text) {
          super(text);
      }

      toJSONObject(){
          return `<b>${super.toJSONObject()}</b>`;
      }
  }
  // Defines Viber style attributes.
  export interface Style{
    bgColor?: String;
    fgColor?: String;
    bold?: Boolean,
    textSize?: String;
    textVAlign?: TextVAlign;
    align?: String;
    vAlign?: String;
    textOpacity?: Number;
    imageUrl?: String;
    row?: Number;
    column?: Number;
  }

  export class ButtonStyle implements Style { 
      bgColor?: string;
      bold?: Boolean;
      fgColor?: string;
      textSize?: String;
      textVAlign?: TextVAlign;
      align?: String;
      vAlign?: String;
      textOpacity?: Number;
      imageUrl?: string;
      row?: Number;
      column?: Number;

      rows?: Number;
      columns?: Number;
    
      toJSONObject(): any{
        var bgColor = "#FFFFFF";

        if (this.bgColor && this.bgColor.match(/^[#]([A-Fa-f0-9]{6})$/ig)){
            bgColor = this.bgColor;   
        }
       
        var template = {
            "TextSize": this.textSize || "regular",
            "BgColor": bgColor,
            "TextHAlign": this.align || "center",
            "TextVAlign": this.vAlign || 'middle', 
            "TextOpacity": this.textOpacity || 100,
        }

        if (this.rows && this.columns){
            template["Rows"] = this.rows;
            template["Columns"] = this.columns;
        } 

        if (this.imageUrl){
            template["Image"] = this.imageUrl;
        }

        return template;
      }
  }

  export class Button {
    private _text: String;
    private _type: String;
    private _payload: String;
    private _url: String;;
    private _silent: Boolean;

    private style: ButtonStyle = new ButtonStyle();

    constructor(style: Style) {
        Object.assign(this.style, style);
    }

    get row() {
        return this.style.row;
    }

    get column(){
        return this.style.column;
    }

    get rows() {
        return this.style.rows;
    }

    get columns(){
        return this.style.columns;
    }

    set type(type: String){
        this._type = type;
    }

    set text(text: String){
        this._text = text;
    }

    set payload(payload: String){
        this._payload = payload;
    }
    
    set silent(silent: Boolean){
        this._silent = silent;
    }

    set url(url: String){
        this._url = url;
    }   

    toJSONObject(){
        const style = (<ButtonStyle>this.style).toJSONObject();

        let fontColor = "#000000";
        
        if (this.style.fgColor && this.style.fgColor.match(/^[#]([A-Fa-f0-9]{6})$/ig)){
            fontColor = this.style.fgColor;   
        }
        
        let font = new FontImpl(this._text);

        if (this.style.bold){
            font = new FontBold(this._text);
        }

        font.color = fontColor;
        
        const text = font.toJSONObject(); 
        const isWebUrl = (type) => type === 'web_url';

        if (this._type === 'none'){
            return Object.assign({
                "ActionType": "none",
                "Text" : text
            }, style);
        }
        const template = Object.assign({
            "ActionType": isWebUrl(this._type)? "open-url" : "reply",
            "ActionBody": isWebUrl(this._type)? this._url : this._payload,
            "Text" : text,
            "Silent": this._silent || false
        }, style);

        if (isWebUrl(this._type)){
            return Object.assign({
                "OpenURLType" : "internal",
                "InternalBrowser": {
                    "Mode": "fullscreen"
                }
            }, template);
        }

        return template;
    }
  }

    export class GridButton {
        private _button : Button;
        
        rows: Number;
        columns: Number;

        constructor(button: Button) {
            this._button = button;
        }

        toJSONObject(){
            return Object.assign({
                "Rows" : this.rows,
                "Columns" : this.columns
            }, this._button.toJSONObject());
        }
    }
}


// Extension root.
export default class Ext { 
    static get facebook() {
        return new FBExtension();
    }
    
    static get viber() {
        return new VBExtension(process.env.UID);
    }

    static get web() {
        return new WebExtension();
    }

    static _resolve(platform, botId){
        switch(platform){
            case 'viber':
                return new VBExtension(botId);
            case 'facebook':
                return new FBExtension();
            case 'web':
                return new WebExtension();
            default:{
                throw new Error('Platform not supported!');
            }
        }
    }

    // common operations, available in all platform.
    static get default(){
        if (process.env.PLATFORM) {
            return this[process.env.PLATFORM];
        }
        throw new Error('Platform not supported!');
    }
}