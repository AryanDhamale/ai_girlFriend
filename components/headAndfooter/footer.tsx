import { FaHeart } from "react-icons/fa";

function Footer()
{
 return (
    <footer className="w-full h-16 px-10 flex justify-center items-center">
        <h1 className="font-medium text-xs tracking-wide flex items-center gap-x-1"> <span className="opacity-50">I Love You</span> <FaHeart className="text-red-500"/>  <span>Keiani Mabe</span> <FaHeart className="text-red-500"/> </h1>
    </footer>
 );
}

export default Footer