"use server";
import mongoose from "mongoose";

async function connectDb():Promise<typeof mongoose>
{
    try 
    {
        const url : string  =  process.env.NODE_ENV=='development' ?  'mongodb://127.0.0.1:27017/Aigirlfriend' : process.env.MONGODB_ATLAS_URL!; 

        if(!url) {
            throw new Error('Connection url is required!');
        }

        if(mongoose.connection.readyState>=1) {
            return mongoose;
        }

        
        const connection = await mongoose.connect(url,{maxPoolSize:10,bufferCommands:true});
        console.log('connection successed!');
        return connection;
    }
    catch(err) {
        console.log({error:(err as Error)?.message || 'connection establishment failed!'});
        process.exit(1);   
    }
}

export default connectDb;