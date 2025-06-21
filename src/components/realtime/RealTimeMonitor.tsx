
import React, { useState, useEffect } from 'react';
import { Activity, Wifi, WifiOff, Zap, Users, MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface RealTimeEvent {
  id: string;
  type: 'disaster_updated' | 'social_media_updated' | 'resources_updated' | 'verification_completed';
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  source: string;
}

interface RealTimeMonitorProps {
  isConnected: boolean;
}

export function RealTimeMonitor({ isConnected }: RealTimeMonitorProps) {
  const [events, setEvents] = useState<RealTimeEvent[]>([]);
  const [activeConnections, setActiveConnections] = useState(156);
  const [eventsPerMinute, setEventsPerMinute] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const { toast } = useToast();

  // Simulate real-time events
  useEffect(() => {
    if (!isConnected) return;

    const eventTypes = [
      'disaster_updated',
      'social_media_updated', 
      'resources_updated',
      'verification_completed'
    ];

    const eventMessages = {
      disaster_updated: [
        'New disaster reported in Brooklyn, NY',
        'Disaster status updated: NYC Flood Emergency',
        'Tags added to wildfire incident in LA County'
      ],
      social_media_updated: [
        'Urgent social media alert detected',
        'High priority report from Lower East Side',
        '15 new social media posts analyzed'
      ],
      resources_updated: [
        'New shelter opened in Manhattan',
        'Hospital capacity updated in Queens',
        'Food distribution point added to map'
      ],
      verification_completed: [
        'Image verification completed: VERIFIED',
        'Suspicious image flagged for review',
        'Authentic disaster photo confirmed'
      ]
    };

    const generateEvent = () => {
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)] as keyof typeof eventMessages;
      const messages = eventMessages[type];
      const message = messages[Math.floor(Math.random() * messages.length)];
      
      const newEvent: RealTimeEvent = {
        id: Date.now().toString(),
        type,
        message,
        timestamp: new Date().toISOString(),
        priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        source: type.includes('social') ? 'Social Media' : 
                type.includes('disaster') ? 'Disaster API' :
                type.includes('resource') ? 'Resource API' : 'Verification API'
      };

      setEvents(prev => [newEvent, ...prev.slice(0, 49)]); // Keep last 50 events
      setTotalEvents(prev => prev + 1);
      
      if (newEvent.priority === 'high') {
        toast({
          title: "🚨 High Priority Event",
          description: newEvent.message,
        });
      }
    };

    const interval = setInterval(generateEvent, 3000 + Math.random() * 7000); // 3-10 seconds

    // Update metrics
    const metricsInterval = setInterval(() => {
      setActiveConnections(prev => prev + Math.floor(Math.random() * 10 - 5));
      setEventsPerMinute(Math.floor(Math.random() * 25 + 15));
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(metricsInterval);
    };
  }, [isConnected, toast]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'disaster_updated': return '🚨';
      case 'social_media_updated': return '💬';
      case 'resources_updated': return '📍';
      case 'verification_completed': return '✅';
      default: return '📡';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'disaster_updated': return 'Disaster Update';
      case 'social_media_updated': return 'Social Media';
      case 'resources_updated': return 'Resources';
      case 'verification_completed': return 'Verification';
      default: return 'System';
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-slate-50 p-4 rounded-lg border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isConnected ? (
              <div className="flex items-center gap-2 text-green-600">
                <Wifi className="h-5 w-5" />
                <span className="font-semibold">WebSocket Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <WifiOff className="h-5 w-5" />
                <span className="font-semibold">Disconnected</span>
              </div>
            )}
            <div className="text-sm text-slate-600">
              Real-time disaster coordination hub
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-blue-600" />
              <span>{activeConnections} active</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="h-4 w-4 text-green-600" />
              <span>{eventsPerMinute}/min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-slate-800">Events/Min</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{eventsPerMinute}</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-slate-800">Total Events</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalEvents}</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-slate-800">Connections</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{activeConnections}</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-600" />
            <span className="font-semibold text-slate-800">High Priority</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {events.filter(e => e.priority === 'high').length}
          </div>
        </div>
      </div>

      {/* Real-time Event Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Live Event Stream</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-slate-600">Live</span>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg max-h-96 overflow-y-auto">
          {events.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              {isConnected ? (
                <>
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Waiting for real-time events...</p>
                </>
              ) : (
                <>
                  <WifiOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Connect to see live events</p>
                </>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {events.map((event) => (
                <div 
                  key={event.id} 
                  className={`p-4 border-l-4 ${getPriorityColor(event.priority)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{getEventIcon(event.type)}</span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-900">
                            {getTypeLabel(event.type)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            event.priority === 'high' ? 'bg-red-100 text-red-800' :
                            event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {event.priority}
                          </span>
                        </div>
                        <p className="text-slate-700">{event.message}</p>
                        <div className="text-xs text-slate-500 mt-1">
                          {event.source} • {new Date(event.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
