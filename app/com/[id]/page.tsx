import ErrorCon from "@/components/error-con/error-con";
import MainCon from "@/components/communication/main-con";
import connectDb from "@/lib/connectDb";
import ConverSation from "@/models/Conversation";
import { notFound } from "next/navigation";

async function Page({params}:any)
{
    const {id}= await params;

    if(id=='new') {
        return <MainCon type="new"/>
    }

    else if(typeof id == 'string' && id.length == 24) {
        // check id validate or not!
        try {
            
            connectDb();
            const exting_conversation = await ConverSation.findById(id);
            if(!exting_conversation) {
                return <ErrorCon text='Invalid Id / NOT found!'/>
            }
            
            return <MainCon type={id}/>
        }
        catch(err) {
            return <ErrorCon text={(err as Error)?.message}/>
        }
    }
    
    return notFound();
    

}

export default Page ;