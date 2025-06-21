
import React, { useState, useEffect } from 'react';
import { DisasterManagement } from './disaster/DisasterManagement';
import { SocialMediaMonitor } from './social/SocialMediaMonitor';
import { ResourceMapping } from './resources/ResourceMapping';
import { ImageVerification } from './verification/ImageVerification';
import { OfficialUpdates } from './updates/OfficialUpdates';
import { RealTimeMonitor } from './realtime/RealTimeMonitor';
import { useToast } from "@/hooks/use-toast";

export function DisasterDashboard() {
  const [activeTab, setActiveTab] = useState("disasters");
  const [disasters, setDisasters] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  // Mock WebSocket connection for real-time updates
  useEffect(() => {
    // Simulate WebSocket connection
    const mockSocket = {
      connect: () => {
        setIsConnected(true);
        toast({
          title: "Real-time Connection Established",
          description: "Now monitoring for live updates",
        });
      },
      emit: (event: string, data: any) => {
        console.log(`Emitting ${event}:`, data);
      }
    };

    setTimeout(() => mockSocket.connect(), 1000);

    return () => {
      setIsConnected(false);
    };
  }, [toast]);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "disasters":
        return <DisasterManagement disasters={disasters} setDisasters={setDisasters} />;
      case "social":
        return <SocialMediaMonitor disasters={disasters} />;
      case "resources":
        return <ResourceMapping disasters={disasters} />;
      case "verification":
        return <ImageVerification disasters={disasters} />;
      case "updates":
        return <OfficialUpdates disasters={disasters} />;
      case "realtime":
        return <RealTimeMonitor isConnected={isConnected} />;
      default:
        return <DisasterManagement disasters={disasters} setDisasters={setDisasters} />;
    }
  };

  // Listen for sidebar navigation (simplified approach)
  React.useEffect(() => {
    const handleSidebarClick = (event: any) => {
      const button = event.target.closest('[data-sidebar="menu-button"]');
      if (button) {
        const text = button.textContent;
        if (text?.includes('Disasters')) setActiveTab('disasters');
        else if (text?.includes('Social Media')) setActiveTab('social');
        else if (text?.includes('Resources')) setActiveTab('resources');
        else if (text?.includes('Verification')) setActiveTab('verification');
        else if (text?.includes('Official Updates')) setActiveTab('updates');
        else if (text?.includes('Real-time Monitor')) setActiveTab('realtime');
      }
    };

    document.addEventListener('click', handleSidebarClick);
    return () => document.removeEventListener('click', handleSidebarClick);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">
            {activeTab === "disasters" && "Disaster Management"}
            {activeTab === "social" && "Social Media Monitoring"}
            {activeTab === "resources" && "Resource Mapping"}
            {activeTab === "verification" && "Image Verification"}
            {activeTab === "updates" && "Official Updates"}
            {activeTab === "realtime" && "Real-time Monitor"}
          </h2>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-slate-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        {renderActiveComponent()}
      </div>
    </div>
  );
}
