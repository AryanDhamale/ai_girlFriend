"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
} from "@/components/ui/sidebar";

import { TbGenderDemigirl } from "react-icons/tb";

import { Home, Search, Settings, MessageSquare } from "lucide-react"
import { useState, useEffect, useCallback } from "react";
import { conversationInterface } from "@/models/Conversation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Link from "next/link";


function AppSidebar() {

    const [conversation, setAllconversation] = useState<conversationInterface[]>([]);
    const { data: session, status } = useSession();

    const items = [{ title: "Home", url: "/", icon: Home }, { title: "Search", url: "#", icon: Search }, { title: "Settings", url: "#", icon: Settings }, { title: 'New Chat', url: '/com/new', icon: MessageSquare }];

    const fetch_all_conversation = useCallback(async (): Promise<void> => {
        try {

            if (conversation?.length > 0) {
                return;
            }

            const fetchOptions = {
                method: 'POST',
                body: JSON.stringify({ userId: session?.user.id }),
                headers: {
                    'content-type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_CLIENT_ID!
                }
            };

            const response = await fetch('/api/conversation/title', fetchOptions);
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error);
            }

            setAllconversation(responseData.con);

        } catch (err) {
            toast.error((err as Error)?.message);
            console.log((err as Error)?.message);
        }
    }, [conversation, session]);
    

    useEffect(() => {
        if (status === "authenticated") {
            fetch_all_conversation();
        }
    }, [status, session, fetch_all_conversation]);



    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-x-3 py-3 w-[97%] mx-auto rounded-md border px-4">
                    <div className="size-9 rounded-full flex items-center  justify-center text-lg bg-slate-900 text-white drop-shadow-md"><TbGenderDemigirl /></div>
                    <h1 className="text-sm font-medium tracking-wider">My AI Girlfriend</h1>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {/* for chat options  */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* for new chats */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {conversation?.length && conversation.map((ele, idx) =>
                                <SidebarMenuItem key={`${idx}-${ele._id}`}>
                                    <SidebarMenuButton>
                                        <Link href={`/com/${ele._id}`}>{ele.title}..</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>)
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>

            <SidebarFooter>
                <div className="text-xs font-medium text-center">
                    <h1> Made by Tejas Dhamale</h1>
                    <h1 className="opacity-50 mt-2">All rights are reserved @ 2025 </h1>
                </div>
            </SidebarFooter>

        </Sidebar >
    )
}

export default AppSidebar;