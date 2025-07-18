import { Schema , models , model } from "mongoose";

export interface userInterface {
    _id? : Schema.Types.ObjectId;
    name : string; 
    email : string;
    createdAt? : Date ;
    updatedAt? : Date ;
}

const userSchema = new Schema<userInterface>({
    name : {type:String,required:true},
    email : {type:String,required:true,unique:true}
},{timestamps:true});



const User =  models?.User || model<userInterface>('User',userSchema);

export default User;