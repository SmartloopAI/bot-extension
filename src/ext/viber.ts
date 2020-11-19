/*jshint esversion: 6 */
import { Channel, QuickReplyButton } from "./channel";
import { Viber } from "../index";

const MaxColumnSize = 6;

export class VBExtension extends Channel {

  constructor(private _uid){
        super();
  }

  text(text, quickReplies?: QuickReplyButton[]) {
    const template = {
      type: "text",
      text: text
    };
    return template;
  }

  image(url: String, quickReplies?: QuickReplyButton[], assetId?: string) {
    const template = {
      type: "picture",
      text: "",
      media: url
    };
    return template;
  }

  video(
    url: String,
    quickReplies?: QuickReplyButton[],
    assetId?: String,
    thumbnail?: String,
    size?: Number
  ) {
    const template = {
      type: "video",
      size: size || 26214400,
      media: url,
      thumbnail: thumbnail
    };
    return template;
  }

  buttonTemplate(content, buttons: any[]) {
    let template:any = {
      keyboard: {
        Type: "keyboard",
        InputFieldState: content.inputState ||'regular',
        // "DefaultHeight":true,
        Buttons: []
      }
    };

    if (typeof content.text !='undefined'){
      template.text =  content.text
      template.type = 'text';
    }

    for (var button of buttons) {
      var colSize = 0;

      buttons.map(b => {
        if (b.row === button.row && colSize < MaxColumnSize) {
          colSize++;
        }
      });

      // naked object
      if (!(button instanceof Viber.Button)) {
        const style = new Viber.ButtonStyle();
        const properties = Object.getOwnPropertyNames(button);

        for (var property of properties) {
          if (button.hasOwnProperty(property)) {
            style[property] = button[property];
          }
        }

        const temp = new Viber.Button(style);

        temp.payload = button.payload;
        temp.type = button.type;
        temp.text = button.title || button.text;
        temp.url = button.url;

        if (!(button.title || button.text)){
          temp.silent = true;
        }

        button = temp;
      }

      const gridButton = new Viber.GridButton(button);

      gridButton.rows = 1;
      gridButton.columns = MaxColumnSize / colSize;

      template.keyboard.Buttons.push(gridButton.toJSONObject());
    }
    return template;
  }

  genericTemplate(items) {
    const template: any = {
      type: "rich_media",
      min_api_version: 2
    };

    template.rich_media = {
      Type: "rich_media",
      ButtonsGroupColumns: 6,
      ButtonsGroupRows: 6,
      BgColor: "#FFFFFF",
      Buttons: items.reduce((a, b) => {
        return a.concat(b);
      }, [])
    };

    return template;
  }

  richMediaTemplate(items: Viber.GridButton[], style: Viber.Style) {
    const template: any = {
      type: "rich_media",
      min_api_version: 2
    };

    template.rich_media = {
      Type: "rich_media",
      ButtonsGroupColumns: 6,
      ButtonsGroupRows: 6,
      BgColor: (style && style.bgColor) || "#FFFFFF",
      Buttons: items.reduce((a, b) => {
        return a.concat(b);
      }, [])
    };

    return template;
  }

  buttonGroup(buttons: any): Viber.GridButton[] {
    var gridButtons = [];

    for (var button of buttons) {
      // naked object
      if (!(button instanceof Viber.Button)) {
        const style = new Viber.ButtonStyle();
        const properties = Object.getOwnPropertyNames(button);

        for (var property of properties) {
          if (button.hasOwnProperty(property)) {
            style[property] = button[property];
          }
        }

        const temp = new Viber.Button(style);

        temp.payload = button.payload;
        temp.type = button.type;
        temp.text = button.title || button.text;
        temp.url = button.url;
        temp.silent = button.silent;

        button = temp;
      }

      gridButtons.push(button.toJSONObject());
    }
    return gridButtons;
  }

  genericItem(
    title: String,
    subtitle: String,
    imageUrl: String,
    actionUrl,
    buttons: any[]
  ) {
    const Title = {
      Columns: 6,
      Rows: 6,
      ActionType: "none",
      Text: title,
      TextHAlign: "left",
      TextSize: "large"
    };

    const rows: any = [Title];

    if (imageUrl) {
      rows[0].Rows = 1;

      rows.unshift({
        Columns: 6,
        Rows: 5,
        ActionType: "none",
        Image: imageUrl
      });
    }

    if (subtitle) {
      rows[0].Rows = parseInt(rows[0].Rows) - 1;

      rows.push({
        Columns: 6,
        Rows: 1,
        ActionType: "none",
        Text: subtitle,
        TextHAlign: "left"
      });
    }

    if (buttons) {
      for (var button of buttons) {
        rows[0].Rows = parseInt(rows[0].Rows) - 1;

        if (!(button instanceof Viber.Button)) {
          // naked object
          const style = new Viber.ButtonStyle();
          const properties = Object.getOwnPropertyNames(button);

          for (var property of properties) {
            if (button.hasOwnProperty(property)) {
              style[property] = button[property];
            }
          }

          const vButton = new Viber.Button(style);

          vButton.payload = button.payload;
          vButton.type = button.type;
          vButton.text = button.title || button.text;
          vButton.url = button.url;

          button = vButton;
        }

        const vb = new Viber.GridButton(button);

        vb.rows = 1;
        vb.columns = 6;

        rows.push(vb.toJSONObject());
      }
    }
    return rows;
  }

  postbackButton(title, payload, style: Viber.Style) {
    // viber default
    if (!style) {
      style = new Viber.ButtonStyle();
    }

    const button = new Viber.Button(style);

    button.text = title;
    button.type = "postback";
    button.payload = `${this._uid}-${payload}`;

    return button;
  }

  textButton(text, style: Viber.Style) {
    // viber default
    if (!style) {
      style = new Viber.ButtonStyle();
    }

    const button = new Viber.Button(style);

    button.text = text;
    button.type = "none";

    return button;
  }

  imageButton(style: Viber.Style) {
    // viber default
    if (!style) {
      style = new Viber.ButtonStyle();
    }

    const button = new Viber.Button(style);
    button.type = "none";

    return button;
  }

  replyButton(title: String, reply: String, style: Viber.Style) {
    return this.postbackButton(title, `reply-${reply}`, style);
  }

  sticker(ids: any[]) {
    if (Array.isArray(ids)) {
      if (ids.length > 1) {
        const stickerId = Math.floor(Math.random() * ids.length);

        return {
          type: "sticker",
          sticker_id: ids[stickerId]
        };
      } else {
        return {
          type: "sticker",
          sticker_id: ids[0]
        };
      }
    } else {
      return {
        type: "sticker",
        sticker_id: ids
      };
    }
  }

  typing(duration) {
    return {
      type: "typing",
      duration: duration
    };
  }

  urlButton(title: String, url: String, style: Viber.ButtonStyle) {
    // viber default
    if (!style) {
      style = new Viber.ButtonStyle();
    }

    const button = new Viber.Button(style);

    button.text = title;
    button.type = "web_url";
    button.url = url;
    button.silent = true;

    return button;
  }

  // facebook compatibility
  quickReplyButtonTemplate(text: String, buttons: any) {
    return this.buttonTemplate(text, buttons);
  }

  // facebook compatibility.
  quickReplyButton(text, payload, style: Viber.ButtonStyle) {
    return this.postbackButton(text, payload, style);
  }

  private appendQuickReplyTemplate(
    template,
    quickReplies?: QuickReplyButton[]
  ) {
    if (quickReplies) {
      template.keyboard = {
        Type: "keyboard",
        // "DefaultHeight": true,
        Buttons: []
      };

      // viber default
      const style = new Viber.ButtonStyle();

      for (var button of quickReplies) {
        const defaultButton = new Viber.Button(style);

        defaultButton.text = button.title;
        defaultButton.payload = `${process.env.UID}-${button.payload}`;

        template.keyboard.Buttons.push(defaultButton.toString());
      }
    }
  }
}
