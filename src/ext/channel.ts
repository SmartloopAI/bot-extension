export interface QuickReplyButton {
  title: String,
  payload: String,
  imageUrl: String
}

export class Channel {
  // Text response
  text(text:String, quickReplies?: QuickReplyButton[]){
    return {
      text : text
    };
  }
}
