"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  Users,
  Vote,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { UserType } from "@/lib/types"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Staffs",
      url: "/staffs",
      icon: Users,

    },
    {
      title: "Attendance",
      url: "/attendance",
      icon: Vote,
    },
  ]
}

export function AppSidebar({user ,...props }: React.ComponentProps<typeof Sidebar>&{user?:UserType}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Staff Attendance Tracker</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {user&&
        <NavUser user={user} />
        }
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
