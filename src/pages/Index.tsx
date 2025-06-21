
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DisasterDashboard } from "@/components/DisasterDashboard";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        <main className="flex-1 p-6">
          <DisasterDashboard />
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default Index;
