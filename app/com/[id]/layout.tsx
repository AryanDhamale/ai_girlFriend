import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/headAndfooter/main-con-sidebar"
import Navbar from "@/components/headAndfooter/main-con-top-navbar";
import Footer from "@/components/headAndfooter/footer";
import { Toaster } from "@/components/ui/sonner";

function ChatLayout({children}:{children:React.ReactNode;}) {
    return (
        <>
            <SidebarProvider>
                {/* w-3/10  */}
                <AppSidebar />
                {/* remain w-3/5 main con not detecting */}
                <div className="flex-1">
                    <Navbar />
                    {children}
                    <Toaster position="top-center" expand={true} richColors />
                    <Footer />
                </div>
            </SidebarProvider>
        </>
    );
}

export default ChatLayout;