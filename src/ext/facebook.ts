/*jshint esversion: 6 */
import { Channel, QuickReplyButton } from './channel';

export class FBExtension extends Channel {

    text(text: string, quickReplies?: QuickReplyButton[]) {
        const template: any = {
            text: text,
        };

        this.appendQuickReplyTemplate(template, quickReplies);

        return template;
    }

    image(url: string, quickReplies?: QuickReplyButton[], assetId?: string) {
        return this.attachment('image', url, quickReplies, assetId);
    }

    audio(url: string, quickReplies?: QuickReplyButton[], assetId?: string) {
        return this.attachment('audio', url, quickReplies, assetId);
    }

    video(url: string, quickReplies?: QuickReplyButton[], assetId?: string) {
        return this.attachment('video', url, quickReplies, assetId);
    }

    file(url: string, quickReplies?: QuickReplyButton[], assetId?: string) {
        return this.attachment('file', url, quickReplies, assetId);
    }

    genericTemplate(items) {
        const template = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": items
                }
            }
        };
        return template;
    }

    genericItem(title, subtitle, imageUrl, defaultActionUrl, buttons, assetId) {
        let defaultAction;

        if (defaultActionUrl) {
            defaultAction = {
                "type": "web_url",
                url: defaultActionUrl
            }
        }

        return {
            "title": title,
            "subtitle": subtitle,
            "image_url": imageUrl,
            "default_action": defaultAction,
            "buttons": buttons
        }
    }

    compactListTemplate(elements: any) {
        const template = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "list",
                    "top_element_style": "compact",
                    "elements": elements
                }
            }
        };
        return template;
    }

    listTemplate(topElementStyle = "large", elements: any) {
        const template = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "list",
                    "top_element_style": topElementStyle,
                    "elements": elements
                }
            }
        };
        return template;
    }

    quickReplyButtonTemplate(text: String, buttons: any) {
        const template = {
            text: text,
            quick_replies: []
        };

        for (const button of buttons) {
            template.quick_replies.push({
                "content_type": "text",
                "title": button.title,
                "payload": button.payload,
                "image_url": button.imageUrl
            });
        }
        return template;
    }

    quickReplyButton(title: String, payload: any) {
        return {
            "title": title,
            "payload": payload || title
        }
    }

    buttonTemplate(content, buttons: any) {
        return {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": content.text,
                    "buttons": buttons
                }
            }
        };
    }

    postbackButton(title: String, blockName: any) {
        return {
            "type": "postback",
            "title": title,
            "payload": blockName
        };
    }

    replyButton(title: String, reply: any) {
        return {
            "type": "postback",
            "title": title,
            "payload": `reply-${reply}`
        };
    }

    callButton(title: String, phoneNumber: string) {
        return {
            "type": "phone_number",
            "title": title,
            "payload": phoneNumber
        };
    }

    shareButton(content) {
        return {
            "type": "element_share",
            "share_contents": content
        }
    }

    urlButton(title: String, url: String, attributes?: Object) {
        return {
            "type": "web_url",
            "title": title,
            "url": url,
            ...attributes
        };
    }

    typing(duration){
        return {
          "type" : "typing",
          "duration": duration
        };
    }

    attachment(type: string, url: string, quickReplies?: QuickReplyButton[], assetId?: string) {
        const template = {
            "attachment": {
                "type": type,
                "payload":  <any>{}
            }
        };

        if (assetId){
            template.attachment.payload.attachment_id = assetId;
        } 
        else if (url){
            template.attachment.payload.url = url
        }

        this.appendQuickReplyTemplate(template, quickReplies);
        
        return template;
    }

    private appendQuickReplyTemplate(template, quickReplies?: QuickReplyButton[]) {
        if (!quickReplies || !quickReplies.length) {
            return;
        }

        template.quick_replies = quickReplies.map(button => {
            return {
                "content_type": "text",
                "title": button.title,
                "payload": button.payload,
                "image_url": button.imageUrl
            }
        });
    }
}
