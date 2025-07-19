import { NextResponse, NextRequest } from "next/server";
import Message from "@/models/Message";
import ConverSation from "@/models/Conversation";
import connectDb from "@/lib/connectDb";
import { messageInterface } from "@/models/Message";
import { conversationInterface } from "@/models/Conversation";

async function POST(request: NextRequest) {
    try {
        const { type, Content, sender, userId } = await request.json();

        if (!type || !Content || !sender || !userId) {
            return NextResponse.json({ error: 'all fields are required!' }, { status: 400 });
        }

        if (!request.headers.get('x-api-key') || request.headers.get('x-api-key') !== process.env.NEXT_PUBLIC_CLIENT_ID) {
            return NextResponse.json({ error: 'Unauthorized! message' }, { status: 401 });
        }

        connectDb();

        if (type == 'new') {

            const conversationObj: conversationInterface = {
                title: String(Content).slice(0,30),
                userId,
            };

            const new_conversation = await ConverSation.create(conversationObj);

            const messageObj: messageInterface = {
                converSationId: new_conversation._id,
                sender,
                Content,
            }

            await Message.create(messageObj); // creating message with new conversation id // 
            return NextResponse.json({ msg: 'message has created!', id:String(new_conversation._id) }, { status: 200 });
        }
        else {
            const messageObj: messageInterface = {
                converSationId: type,
                sender,
                Content,
            }

            await Message.create(messageObj); // creating message with already exiting conversation id // 
            return NextResponse.json({ msg: 'message has created!' }, { status: 200 });
        }

    } catch (err) {
        return NextResponse.json({ error: (err as Error)?.message }, { status: 503 });
    }
}


export { POST };