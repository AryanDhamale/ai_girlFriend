import { model , models , Schema } from "mongoose";
import User from "./user";

export interface conversationInterface {
    title : string;
    userId : Schema.Types.ObjectId ; 
    createdAt? : Date ;
    _id? : Schema.Types.ObjectId;
}


const conversationSchema=new Schema<conversationInterface>({
    title : {type:String,required:true},
    userId : {
        type : Schema.Types.ObjectId, ref:'User' , 
        required : true
    },
    createdAt : {
        type : Date ,
        default : Date.now()
    }
})

const ConverSation = models?.Conversation || model<conversationInterface>('Conversation',conversationSchema);

export default ConverSation