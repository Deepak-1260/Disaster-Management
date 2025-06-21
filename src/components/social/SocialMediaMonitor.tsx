
import React, { useState, useEffect } from 'react';
import { MessageCircle, AlertTriangle, Heart, Repeat, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface SocialMediaPost {
  id: string;
  content: string;
  user: string;
  timestamp: string;
  platform: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  engagement: {
    likes: number;
    shares: number;
    replies: number;
  };
  location?: string;
  verified: boolean;
}

interface SocialMediaMonitorProps {
  disasters: any[];
}

export function SocialMediaMonitor({ disasters }: SocialMediaMonitorProps) {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const { toast } = useToast();

  // Mock social media posts
  const mockPosts: SocialMediaPost[] = [
    {
      id: '1',
      content: '#floodrelief URGENT: Need food and water in Lower East Side NYC. Families trapped on 3rd floor! #EmergencyHelp',
      user: '@emergencyhelper',
      timestamp: '2025-01-21T11:30:00Z',
      platform: 'Twitter',
      priority: 'urgent',
      engagement: { likes: 45, shares: 23, replies: 12 },
      location: 'Lower East Side, NYC',
      verified: true
    },
    {
      id: '2',
      content: 'Offering shelter for displaced families in Manhattan. Have space for 10 people. DM me #NYCFlood #Help',
      user: '@goodsamaritan',
      timestamp: '2025-01-21T11:15:00Z',
      platform: 'Twitter',
      priority: 'high',
      engagement: { likes: 89, shares: 67, replies: 34 },
      location: 'Manhattan, NYC',
      verified: false
    },
    {
      id: '3',
      content: 'SOS! Wildfire approaching our neighborhood in LA County. Need evacuation assistance! #CaliforniaWildfire',
      user: '@laresidenthelp',
      timestamp: '2025-01-21T10:45:00Z',
      platform: 'Twitter',
      priority: 'urgent',
      engagement: { likes: 156, shares: 98, replies: 45 },
      location: 'LA County, CA',
      verified: true
    },
    {
      id: '4',
      content: 'Medical supplies available for disaster relief. Contact us for coordination. #DisasterRelief',
      user: '@medicalaid_org',
      timestamp: '2025-01-21T10:30:00Z',
      platform: 'Twitter',
      priority: 'medium',
      engagement: { likes: 78, shares: 45, replies: 23 },
      verified: true
    }
  ];

  useEffect(() => {
    setPosts(mockPosts);
  }, []);

  const startMonitoring = () => {
    setIsMonitoring(true);
    toast({
      title: "Social Media Monitoring Started",
      description: "Now monitoring for disaster-related posts in real-time",
    });

    // Simulate real-time posts coming in
    const interval = setInterval(() => {
      const newPost: SocialMediaPost = {
        id: Date.now().toString(),
        content: `New emergency report: ${searchKeywords || 'flood'} situation developing. Need immediate assistance! #Emergency`,
        user: '@citizen_reporter',
        timestamp: new Date().toISOString(),
        platform: 'Twitter',
        priority: Math.random() > 0.7 ? 'urgent' : Math.random() > 0.4 ? 'high' : 'medium',
        engagement: {
          likes: Math.floor(Math.random() * 100),
          shares: Math.floor(Math.random() * 50),
          replies: Math.floor(Math.random() * 30)
        },
        verified: Math.random() > 0.5
      };

      setPosts(prev => [newPost, ...prev]);
      
      if (newPost.priority === 'urgent') {
        toast({
          title: "⚠️ URGENT Alert Detected",
          description: "High priority social media report requires immediate attention",
          variant: "destructive"
        });
      }
    }, 10000); // New post every 10 seconds

    return () => clearInterval(interval);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    toast({
      title: "Monitoring Stopped",
      description: "Social media monitoring has been paused",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const urgentPosts = posts.filter(p => p.priority === 'urgent');
  const highPosts = posts.filter(p => p.priority === 'high');

  return (
    <div className="space-y-6">
      {/* Monitoring Controls */}
      <div className="bg-slate-50 p-4 rounded-lg border">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Keywords to Monitor</label>
            <Input
              value={searchKeywords}
              onChange={(e) => setSearchKeywords(e.target.value)}
              placeholder="e.g., flood, wildfire, emergency, SOS"
            />
          </div>
          <Button 
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            className={isMonitoring ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Button>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-semibold text-red-800">Urgent Alerts</span>
          </div>
          <div className="text-2xl font-bold text-red-900 mt-2">{urgentPosts.length}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span className="font-semibold text-orange-800">High Priority</span>
          </div>
          <div className="text-2xl font-bold text-orange-900 mt-2">{highPosts.length}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Total Posts</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 mt-2">{posts.length}</div>
        </div>
      </div>

      {/* Social Media Feed */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Live Social Media Feed</h3>
        {posts.map((post) => (
          <div key={post.id} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-600">{post.user}</span>
                {post.verified && <span className="text-blue-500">✓</span>}
                <span className="text-slate-500">•</span>
                <span className="text-sm text-slate-500">{post.platform}</span>
                <span className="text-slate-500">•</span>
                <span className="text-sm text-slate-500">
                  {new Date(post.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(post.priority)}`}>
                  {post.priority.toUpperCase()}
                </span>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </div>
            </div>
            
            <p className="text-slate-800 mb-3">{post.content}</p>
            
            {post.location && (
              <div className="text-sm text-slate-600 mb-3">
                📍 {post.location}
              </div>
            )}
            
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {post.engagement.likes}
              </div>
              <div className="flex items-center gap-1">
                <Repeat className="h-4 w-4" />
                {post.engagement.shares}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {post.engagement.replies}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
