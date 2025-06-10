"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { UserContext } from "@/components/authGuard";
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { UserType } from "@/lib/types";
import { useContext } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const user=useContext(UserContext)

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
           
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" >
          {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
