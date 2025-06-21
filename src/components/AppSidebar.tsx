
import React from 'react';
import { AlertTriangle, Map, MessageCircle, Shield, Database, Activity } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Disasters", icon: AlertTriangle, id: "disasters" },
  { title: "Social Media", icon: MessageCircle, id: "social" },
  { title: "Resources", icon: Map, id: "resources" },
  { title: "Verification", icon: Shield, id: "verification" },
  { title: "Official Updates", icon: Database, id: "updates" },
  { title: "Real-time Monitor", icon: Activity, id: "realtime" }
];

export function AppSidebar() {
  const [activeTab, setActiveTab] = React.useState("disasters");

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <h1 className="font-bold text-lg">Disaster Response</h1>
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Response Center</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab(item.id)}
                    isActive={activeTab === item.id}
                    className="w-full"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
