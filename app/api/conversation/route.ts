import { NextResponse, NextRequest } from "next/server";
import connectDb from "@/lib/connectDb";
import ConverSation from "@/models/Conversation";
import Message from "@/models/Message";


// authantication + get all messages // 
async function POST(request:NextRequest) 
{
    try {
        const {converSationId,userId} =  await request.json();

        if(!converSationId || !userId) {
            return NextResponse.json({error:'conversationId and userId required!'},{status:400});
        }


        if(!request.headers.get('x-api-key') || request.headers.get('x-api-key')!==process.env.NEXT_PUBLIC_CLIENT_ID) {
            return NextResponse.json({error:'Unauthrized! converation'},{status:401});
        }

        connectDb();
        const find_conversation = await ConverSation.findById(String(converSationId));
        if(!find_conversation) {
            return NextResponse.json({error:'Invalid conversation id'},{status:400});
        }

        if(String(find_conversation.userId) !== String(userId)) {
            return NextResponse.json({error:'user is Unauthorized for conversation'},{status:400});
        }

        const find_messags = await Message.find({converSationId:String(converSationId)});

        if(!find_messags) {
            return NextResponse.json({msg:[]},{status:200});
        }

        return NextResponse.json({msg:find_messags},{status:200})

    }   
    catch(err) {
        return NextResponse.json({error:(err as Error)?.message || 'server has crashed!'},{status:503});
    }
}

export {POST}