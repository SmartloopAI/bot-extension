## Bot Extension

The purpose of this module is to dynamically create rich UI elements inside script block.

### Getting Started.

Copy and paste the following code inside [script block](https://docs.recime.io/developer-features.html#script-block) to render a text element:

```javascript
import Ext from "bot-extension";
const __ = Ext.default;

exports.handler = (context, done) => {
    // context.args
    done(__.text("Hello world"));
};
```

### Button Template.

Button template is supported in Facebook Messenger and Viber. It is possible to create a button template in the following way:

```javascript
import Ext from "bot-extension";
const __ = Ext.default;

exports.handler = (context, done) => {
    // context.args
    done(__.buttonTemplate("Your Summary", [
        __.postbackButton('Button1', 'about'),
        __.urlButton('Button2', "https://recime.io")
    ]));
};
```

Viber on the other hand supports row and column and additional properties to  customize the look and feel of a button template:

```javascript
//script block

import Ext from 'bot-extension';
const __ = Ext.default;

exports.handler = (context, done) => {
   
    done(__.buttonTemplate('Text', [
            __.postbackButton('button1', 'about', {
                bgColor : '#e30c2e',
                fgColor : '#fff',
                row : 0,
                column : 0
            }),
             __.postbackButton('Button2', 'start', {
                bgColor : '#76c0d6',
                fgColor : '#fff',
                row : 0,
                column : 1
            })
        ]));
};

```

The following properties are supported for a Viber button:

| Property | Description |
| --- | --- |
| bgColor | Background color |
| fgColor | Foreground color |
| row | Number of columns per carousel content block. (0 - 5) |
| column | Number of rows per carousel content block. (0 - 6) |
| imageUrl | Link (https://) |
| textSize | Font size. (regular, large, small) |
| align | Text Alignment (left, center,  right) |


### Generic Template

Use this extension to dynamically construct "Generic Template" or "Carousel". An example of a generic template that is constructed dynamically from an API result is shown below:

```javascript
import Ext from "bot-extension";
const __ = Ext.default;

exports.handler = (context, done) => {
  const result = {
      forecast : [
          { 
              id : 1,
              day : new Date().toISOString(),
              temp: '60F',
              icon: 'https://dashboard.smartloop.ai/assets/logo1.png'
          },
          { 
              id : 2,
              day : new Date().toISOString(),
              temp: '40F',
              icon: 'https://dashboard.smartloop.ai/assets/logo1.png'
          }
      ]
  }
  
  const t = __.genericTemplate(result.forecast.map(r => {
    return __.genericItem(r.day, r.temp, r.icon, 
        null,[
            __.postbackButton('Detail', `id-${r.id}`)
        ]);
  }));
  
  done(t);
};
```

#### Methods 

- text (text: String, replies: Button[])
- image (imageUrl: String, replies: Button[])
- buttonTemplate(title: String, buttons:Button[])
- postbackButton(title: String, blockName: String) => Button
- replyButton(title: String, reply: String) => Button  /* Use `replyButton` to capture user Input */
- urlButton(title: String, url: String) => Button
- genericTemplate(items)
- genericItem(title: String, subtitle: String, imageUrl: String, defaultActionUrl: String, buttons)


## License

Copyright © 2020 Recime Inc. All rights reserved.


