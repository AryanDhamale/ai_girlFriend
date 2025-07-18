import { NextResponse, NextRequest } from "next/server";
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // global decelaration //

async function POST(request: NextRequest) {
    try {
        const { text, voice = 'coral' } = await request.json();
        if (!text) {
            return NextResponse.json({ error: 'Text is required!' }, { status: 400 });
        }

        if (!request.headers.get('x-api-key') || request.headers.get('x-api-key') !== process.env.NEXT_PUBLIC_CLIENT_ID) {
            return NextResponse.json({ error: 'Unauthorized! tts' }, { status: 401 });
        }

        const mp3 = await openai.audio.speech.create({
            model: 'gpt-4o-mini-tts',
            voice, // Options: alloy, echo, fable, onyx, nova, shimmer
            input: text,
        });

        console.log(mp3);

        const buffer = Buffer.from(await mp3.arrayBuffer());

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'inline; filename="speech.mp3"',
            },
        });

    }
    catch (err) {
        return NextResponse.json({ error: (err as Error)?.message || 'TTS generation failed' }, { status: 503 });
    }
}


export { POST };