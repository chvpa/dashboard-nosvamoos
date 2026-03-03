"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/ui/Logo";
import { SidebarNav } from "./SidebarNav";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="sidebar" className="bg-gray-100">
      <SidebarHeader className="p-0">
        <Logo />
      </SidebarHeader>
      <SidebarSeparator className="mx-0" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarNav />
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator className="mx-0" />
      <SidebarFooter>
        <p className="text-[10px] text-sidebar-foreground/40 text-center group-data-[collapsible=icon]:hidden">
          NosVamoos Dashboard
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
