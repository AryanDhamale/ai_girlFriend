import { model , models , Schema } from "mongoose";
import ConverSation from "./Conversation";

export interface messageInterface {
    converSationId : Schema.Types.ObjectId | string; 
    sender: string ;
    Content:string ; 
    createAt?: Date;
    _id? : Schema.Types.ObjectId;
}

export const messageSchema = new Schema<messageInterface>({
    converSationId : {
        type : Schema.Types.ObjectId , ref : 'ConverSation',
        required:true,
    },
    sender : {
        type:String,
        enum:['user','ai'],
        default : 'user'
    },
    Content : {
        type:String, 
        required:true,
    },
    createAt : {
        type : Date ,
        default : Date.now() 
    }
});


const Message = models?.Message || model<messageInterface>('Message',messageSchema);

export default Message;