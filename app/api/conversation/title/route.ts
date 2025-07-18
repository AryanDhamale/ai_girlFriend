import { NextResponse, NextRequest } from "next/server";
import connectDb from "@/lib/connectDb";
import ConverSation from "@/models/Conversation";

async function POST(request:NextRequest)
{
    try 
    {

        const {userId} = await request.json();
        if(!userId) {
            return  NextResponse.json({error:'userID is required!'},{status:400});
        }

        if(!request.headers.get('x-api-key') || request.headers.get('x-api-key')!== process.env.NEXT_PUBLIC_CLIENT_ID) {
            return NextResponse.json({error:'Unauthorized! title'},{status:401});
        }

        connectDb();

        const all_conversation = await ConverSation.find({userId:String(userId)});
        if(all_conversation?.length<=0) {
            return NextResponse.json({con:[]},{status:200});
        }

        return NextResponse.json({con:all_conversation},{status:200});
        

    }catch(err) {
        return NextResponse.json({error:(err as Error)?.message},{status:503});
    }
}

export {POST};