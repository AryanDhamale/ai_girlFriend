"use client"
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

function Navbar() {
    const { data: session } = useSession();


    return (
        <nav className="w-full h-16 sticky top-0 z-[10] ps-5 pe-15 border-b border-slate-200 bg-white drop-shadow-md flex justify-between items-center">
            <h1 className="font-medium text-lg">Keiani</h1>
            {session && <div>
                <DropdownMenu >
                    <DropdownMenuTrigger className="outline-0">
                        <div className="size-10">
                            <Image className="border size-full rounded-full drop-shadow-md" width={1000} height={1000} src={session?.user.image || "/default-profile.jpeg"} alt="this is an image" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" align="center">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()}>Signout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>}

            {!session && <Button onClick={() => signIn('google')}>SignIn</Button>}
        </nav>
    );
}

export default Navbar;