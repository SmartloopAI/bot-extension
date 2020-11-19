import assert = require("assert");
import { v1 } from 'uuid';
import Ext, { Viber } from "../src/index";
import { VBExtension } from "../src/ext/viber";


describe("Ext", ()=>{
    describe("viber", ()=>{
        it ("should assert custom style for postback button", ()=>{
            const style = new Viber.ButtonStyle();
            const botId = v1().replace(/-/ig, "");

            style.bgColor = "#000000";
            style.fgColor = "#FFFFFF"

            const ext = new VBExtension(botId);

            const button = ext.buttonTemplate({}, [
                ext.postbackButton("Smartloop", "---", style)
            ]);

            assert.equal(button.keyboard.Buttons[0].BgColor, "#000000");
            assert.equal(button.keyboard.Buttons[0].Text, `<font color=\"#FFFFFF\">Smartloop</font>`);
        });
        it ("should assert grid for button-template", ()=>{
            const style = new Viber.ButtonStyle();

            const button = new Viber.Button(style);

            button.type = 'web_url';
            button.url = "https://smartloop.ai"
            button.text = "Test";
            
            const vb = new Viber.GridButton(button);

            vb.rows = 1;
            vb.columns = 6;

            assert.equal(vb.toJSONObject().Rows, 1);
            assert.equal(vb.toJSONObject().Columns, 6);
            assert.equal(vb.toJSONObject().ActionType, "open-url");
        });
        it ("should assert button-template", ()=>{
            const button = Ext.viber.buttonTemplate("text", [
                Ext.viber.postbackButton('button1', 'about', {
                    bgColor : '#e30c2e',
                    fgColor : '#fff',
                    row : 0,
                    column : 0
                }),
                Ext.viber.postbackButton('button1', 'about', {
                    bgColor : '#e30c2e',
                    fgColor : '#fff',
                    row : 0,
                    column : 1,
                }),
            ]);
            assert.equal(button.keyboard.Buttons[0].BgColor, "#e30c2e");
            assert.equal(button.keyboard.Buttons[0].Columns, 3);
        });
        it ("should assert naked button-template", ()=>{
            const button = Ext.viber.buttonTemplate("text", [{
                    bgColor : '#e30c2e',
                    fgColor : '#fff',
                    row : 0,
                    column : 0
              }
            ]);
            assert.equal(button.keyboard.Buttons[0].BgColor, "#e30c2e");
        });
    });
});