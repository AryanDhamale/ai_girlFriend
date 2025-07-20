import Navbar from "@/components/headAndfooter/front-con-navbar";
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from 'lucide-react';
import Link from "next/link";

// tech icons // 
import { SiGooglegemini } from "react-icons/si";
import { SiShadcnui } from "react-icons/si";
import { DiMongodb } from "react-icons/di";
import { SiNextdns } from "react-icons/si";
import { RiVoiceprintLine } from "react-icons/ri";

function Page() {
  return (
    <>
    <Navbar/>
    <div className=" w-full min-h-[80vh] flex items-center justify-center">

      <div className="flex flex-col gap-y-10">

        {/* introduction */}
        <div className="max-sm:mt-8 text-center flex flex-col gap-y-8">
          <h1 className="text-md sm:text-lg flex justify-center items-center gap-x-5"><span className="font-medium">July 13, 2025</span> | <span className="opacity-50">Product</span></h1>
          <h1 className="text-xl sm:text-3xl md:text-5xl font-bold text-slate-900 drop-shadow-md">Introducing Keiani, an ai Girlfriend</h1>
          {/* CTA */}
          <div>
            <Link href={'/com/new'}><Button className="rounded-full tracking-wide px-10 py-3">Try Keiani <ArrowUpRight/></Button></Link>
          </div>
        </div>

         {/* technology we are used! */}
        <div>
          <h1 className="mb-15 text-center text-md/6  md:text-xl opacity-50 font-medium tracking-[10px]">Technology we are used &apos;-&apos; </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-y-10 gap-x-10">
            <div className="flex items-center gap-x-3"> <SiGooglegemini className="text-xl"/> <span className="font-medium">Google gemini</span></div>

            <div className="flex items-center gap-x-3"> <RiVoiceprintLine className="text-xl"/> <span className="font-medium">Dubverse</span></div>

            <div className="flex items-center gap-x-3"> <SiNextdns className="text-xl"/> <span className="font-medium">Nextauth</span></div>

            <div className="flex items-center gap-x-3"> <SiShadcnui className="text-xl"/> <span className="font-medium">Shadcn.ui</span></div>

            <div className="flex items-center gap-x-3"> <DiMongodb className="text-xl"/> <span className="font-medium">MongoDB</span></div>

          </div>
        </div>

      </div>

    </div>
    </>
  );
}

export default Page;