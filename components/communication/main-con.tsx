"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { notFound } from "next/navigation";
import { messageInterface } from "@/models/Message";

// shadcn dep // 
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";


// for chat buttons //
interface for_tracking_buttons {
  isListening: boolean;
  isDataSending: boolean;
}

function MainCon({ type }: { type: string }) { // type = new or id // 

  const [recoginzation, setRecognization] = useState<Window['SpeechRecognition'] | Window['webkitSpeechRecognition'] | null>(null);
  const [usertext, setUserText] = useState<string>(''); // override undefined - string //
  const [buttonTracing, setButtonTracing] = useState<for_tracking_buttons>({ isListening: false, isDataSending: false });
  const { data: session, status } = useSession(); // time consuming // 
  const [allMessages, setAllMessages] = useState<messageInterface[]>([]);
  const [converationType, setConverationType] = useState<string>(type); // ltrace conversation = [new , id]
  const Instrction_for_ai: string = "you are an ai girlfrined of Tejas ,who loves coding and stuff. your name is Keiani, and user will interact with you by voice and the text of what user asked will send to you, you as my love send the answer on give text, give in short , also add emotion in that so user feel like real girl";


  const get_all_messages_of_conversation = useCallback(async (): Promise<void> => {
    try {
      if (allMessages.length>0 || converationType=='new') {
        return;
      }

      const fetchOptions = {
        method: 'POST',
        body: JSON.stringify({ converSationId: converationType, userId: session?.user.id }),
        headers: {
          'content-type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_CLIENT_ID!
        }
      }

      const response = await fetch('/api/conversation', fetchOptions);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'error while getting all messages');
      }

      setAllMessages(responseData.msg);

    }
    catch (err) {
      console.log({ error: (err as Error)?.message });
      notFound();
    }
  }, [allMessages,session,converationType]);


  useEffect(() => {

    const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : undefined;

    if (SpeechRecognition && !recoginzation) {
      const reco = new SpeechRecognition();
      reco.continuous = true;
      reco.maxAlternatives = 1;
      reco.interimResults = false;

      reco.onerror = (): void => {
        toast.error("Error occured while speechRecognization!");
        setButtonTracing({ isListening: false, isDataSending: false });
      }

      setRecognization(reco);
    }

    if (status === 'authenticated') {
      get_all_messages_of_conversation();
    }

  }, [session, status, get_all_messages_of_conversation,recoginzation]);




  async function create_conversation_and_message_in(Content: string, sender: string, conId: string): Promise<string> {
    try {

      const fetchOptions = {
        method: 'POST',
        body: JSON.stringify({ type: conId, Content, sender, userId: session?.user.id }),
        headers: {
          'content-type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_CLIENT_ID!
        }
      }

      const response = await fetch('/api/message', fetchOptions);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error);
      }

      if (type === 'new') {
        console.log(`changing idType-> ${type}`);
        setConverationType(responseData.id);
        return String(responseData.id);
      }

      return converationType;

    } catch (err) {
      toast.error((err as Error)?.message);
      console.log((err as Error)?.message);
      return '';
    }
  }

  // onresult // 
  if (recoginzation) {
    recoginzation.onresult = (event: SpeechRecognitionEvent): void => {
      const text: string | undefined = event?.results[event.resultIndex][0].transcript;
      const newText: string = usertext + ' ' + text;
      if (newText !== usertext) {
        setUserText(newText);
      }
    }
  }


  async function call_google_gemini(text: string, conId: string): Promise<void> {
    if (!text) {
      throw new Error('text is required!');
    }
    const url = process.env.NEXT_PUBLIC_GEMINI_URL as string;
    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify({
        system_instruction: { parts: [{ text: Instrction_for_ai }] },
        contents: [{ parts: [{ text }] }]
      }),
      headers: {
        'content-type': 'application/json',
        'X-goog-api-key': process.env.NEXT_PUBLIC_GEMINI_API_KEY as string
      }
    }

    try {
      const response = await fetch(url, fetchOptions);
      const responseData = await response.json();


      if (!response.ok) {
        const message_need_to_throw = responseData.error?.message || 'Something went wrong';
        throw new Error(message_need_to_throw);
      }

      const need_to_conver_in_voice: string = responseData.candidates[0].content.parts[0].text;

      //setAllMessages((oldVal) => [...oldVal, { converSationId: converationType, sender: 'ai', Content: need_to_conver_in_voice }]);

      await create_conversation_and_message_in(need_to_conver_in_voice, 'ai', conId);

      call_open_ai_tts(need_to_conver_in_voice);

    }
    catch (err) {
      toast.error(`Error:${(err as Error)?.message}` || 'Something went wrong!');
      console.log((err as Error)?.message);
    }

  }

  async function call_open_ai_tts(text: string): Promise<void> {

    try {

      if (!text) {
        throw new Error('Text is required for tts!');
      }

      const fetchOptions = {
        method: 'POST',
        body: JSON.stringify({ text, speaker_no: 184, config: { instruction: Instrction_for_ai } }),
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.NEXT_PUBLIC_DUBVERSE!
        }
      };

      const response = await fetch('https://audio.dubverse.ai/api/tts', fetchOptions);

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || 'something went wrong!');
      };

      setAllMessages((oldVal) => [...oldVal, { converSationId: converationType, sender: 'ai', Content: text }]);

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
      setButtonTracing({ isListening: false, isDataSending: false });

    } catch (err) {
      toast.error((err as Error)?.message);
      console.log((err as Error)?.message);
      setButtonTracing({ isListening: false, isDataSending: false });
    }
  }


  function start_Listening(): void {
    if (!session) {
      signIn('google');
      return;
    }

    recoginzation?.start();
    setButtonTracing({ isListening: true, isDataSending: false });
    toast.success('Listening started!');

  }

  async function end_Listening(): Promise<void> {
    recoginzation?.stop();
    setButtonTracing({ isListening: false, isDataSending: true });
    toast.success('Listening ended!');
    if (usertext) {
      try {
        setAllMessages((oldVal) => [...oldVal, { converSationId: converationType, sender: 'user', Content: usertext }]);
        const conId: string = await create_conversation_and_message_in(usertext, 'user', converationType);
        await call_google_gemini(usertext, conId);
        setUserText('');
      } catch (err) {
        toast.error((err as Error)?.message);
        console.log((err as Error)?.message);
      }

    }

  }

  function abort_speech(): void {
    recoginzation?.abort();
    setButtonTracing({ isListening: false, isDataSending: false });
    setUserText('');
    toast.error('SpeechRecognization has aborted!');
  }

  if (type != 'new' && allMessages.length<=0) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center">
        <h1 className="font-medium text-lg drop-shadow-md">Loading.. </h1>
      </div>
    )
  }


  return (
    <div className="w-full">
      {/* communication box */}

      <div className="w-full min-h-[80vh] p-5 flex flex-col gap-y-5">

        <div className="flex-1 relative overflow-y-auto p-4 space-y-2">

          {(type == 'new' && allMessages?.length <= 0) && <h1 className="absolute top-1/2 left-1/2 -transform -translate-1/2 w-full text-3xl font-medium drop-shadow-md text-center">Welcome my name is Keiani how can i help you!</h1>}

          {allMessages?.length > 0 && allMessages.map((ele, idx) => <div key={`${ele.Content.slice(0, 5)}-${idx}`} className={`flex ${ele.sender == 'ai' ? 'justify-start' : 'justify-end'}`}>
            <div className={`${ele.sender == 'ai' ? 'bg-gray-300 text-black' : 'bg-green-400 text-white'} rounded-lg px-4 py-2 max-w-md break-words`}>{ele.Content}</div>
          </div>)}

        </div>

      </div>



      {/* floating box */}
      <div className="min-h-20 mx-auto w-[85%] flex">
        {/* for text */}
        <div className="flex-1">
          <textarea value={usertext} readOnly={true} className="w-full h-full p-3 rounded-lg border outline-0 "></textarea>
        </div>

        {/* for button */}
        <div className="w-1/5 h-20 flex items-center justify-center">
          {
            (buttonTracing.isListening && !buttonTracing.isDataSending) &&
            <div className="flex flex-col gap-y-2">
              <Button onClick={end_Listening} variant="outline">Stop & send message</Button>
              <Button onClick={abort_speech} variant="destructive">abort</Button>
            </div>
          }

          {
            (!buttonTracing.isListening && !buttonTracing.isDataSending) && <Button onClick={start_Listening}>Start Listening</Button>
          }

          {
            (!buttonTracing.isListening && buttonTracing.isDataSending) && <Button size="sm" disabled>
              <Loader2Icon className="animate-spin" />
              Please wait
            </Button>
          }

        </div>

      </div>
    </div>
  );
}

export default MainCon;