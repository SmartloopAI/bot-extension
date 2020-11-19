/*jshint esversion: 6 */

import { QuickReplyButton, Channel } from './channel';

export class WebExtension extends Channel {
    
    // Text response
    text(text:String, quickReplies?: QuickReplyButton[]){
        const template =  {
            "type": "text",
            text : text,
        };
        this.processQuickReplies(template, quickReplies);

        return template;
    }

    image(url: string, quickReplies?: QuickReplyButton[]) {
        const template = {
            "type": "image",
            "image": url
        }
        this.processQuickReplies(template, quickReplies);
        
        return template;
    }

    audio(url: string, quickReplies?: QuickReplyButton[]) {
        const template = {
            "type": "audio",
            "audio": url
        }
        this.processQuickReplies(template, quickReplies);
        
        return template;
    }

    video(url: string, quickReplies?: QuickReplyButton[]) {
        const template = {
            "type": "video",
            "video": url
        }
        this.processQuickReplies(template, quickReplies);
        
        return template;
    }

    processQuickReplies(template, quickReplies?: QuickReplyButton[]){
        if (Array.isArray(quickReplies) && quickReplies.length){
            template.quickReplies = (quickReplies || []).map((button: any)=>{
                if (button.type === 'postback'){
                    return this.postbackButton(button.title, button.payload, button.attributes);
                }
                if (button.type === 'reply'){
                    return this.replyButton(button.title, button.reply, button.attributes);
                }
             });
        }
    }


    replyButton(title: String, reply: any, attributes?: Object) {
        return this.postbackButton(title, `reply-${reply}`, attributes);
    }

    postbackButton(title: String, blockName: String, attributes?: Object) {
        return {
            "type": "postback",
            "title": title,
            "postback": blockName,
            ...attributes
        }
    }
    
    urlButton(title: String, url: String, attributes?: Object) {
        return {
            "type": "url",
            "title": title,
            "url": url,
            ...attributes
        };
    }

    buttonTemplate(text: String, buttons: any) {
        return {
            "type": "button-template",
            "template": {
                "text": text,
                "buttons": (buttons || []).map(button=>{
                    if (button.type === 'postback'){
                        return this.postbackButton(button.title, button.payload, button.attributes);
                    }
                    if (button.type === 'reply'){
                        return this.replyButton(button.title, button.reply, button.attributes);
                    }
                    return this.urlButton(button.title, button.url, button.attributes);
                })
            }
        };
    }

    genericTemplate(items) {
        const template = {
            "type": "generic-template",
            "template": {
                "elements": items
            }
        };
        return template;
    }

    typing(duration){
        return {
          "type" : "typing",
          "duration": duration
        };
    }

    genericItem(title, subtitle, imageUrl, defaultActionUrl, buttons, assetId) {
        let defaultAction;

        if (defaultActionUrl) {
            defaultAction = {
                "type": "url",
                url: defaultActionUrl
            }
        }

        return {
            "title": title,
            "subtitle": subtitle,
            "imageUrl": imageUrl,
            "defaultAction": defaultAction,
            "buttons": (buttons || []).map(button=>{
                if (button.type === 'postback'){
                    return this.postbackButton(button.title, button.payload, button.attributes);
                }
                if (button.type === 'reply'){
                    return this.replyButton(button.title, button.reply, button.attributes);
                }
                return this.urlButton(button.title, button.url, button.attributes);
            })
        }
    }

    sticker(ids: any){
        if (Array.isArray(ids)){
            if (ids.length > 1){
                const stickerId = Math.floor(Math.random() * ids.length);
                return this.text(`Sticker placeholder: ${ids[stickerId]}`);
            } else {
                return this.text(`Sticker placeholder: ${ids[0]}`);
            }
        }
        return this.text(`Sticker placeholder: ${ids}`);
    }

    richMediaTemplate(items: any, attributes?: Object){
        return this.text("Viber rich media is not supported in the simulator. Test it on Viber.");
    }

    buttonGroup(buttons: any){
        return buttons;
    }
}
