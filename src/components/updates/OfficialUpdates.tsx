
import React, { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, Globe, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface OfficialUpdate {
  id: string;
  title: string;
  content: string;
  source: string;
  url: string;
  publishedAt: string;
  disasterId?: string;
  category: 'alert' | 'update' | 'advisory' | 'closure';
}

interface OfficialUpdatesProps {
  disasters: any[];
}

export function OfficialUpdates({ disasters }: OfficialUpdatesProps) {
  const [updates, setUpdates] = useState<OfficialUpdate[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const { toast } = useToast();

  // Mock official updates
  const mockUpdates: OfficialUpdate[] = [
    {
      id: '1',
      title: 'NYC Emergency Management - Flood Warning Extended',
      content: 'The National Weather Service has extended the flood warning for Manhattan and surrounding boroughs until 6 PM EST. Residents in low-lying areas should continue to avoid unnecessary travel.',
      source: 'NYC Emergency Management',
      url: 'https://www1.nyc.gov/site/em/index.page',
      publishedAt: '2025-01-21T12:00:00Z',
      disasterId: '1',
      category: 'alert'
    },
    {
      id: '2',
      title: 'FEMA - Disaster Declaration for NYC Flooding',
      content: 'FEMA has approved a major disaster declaration for New York City flooding. Federal assistance is now available for affected individuals and communities.',
      source: 'FEMA',
      url: 'https://fema.gov',
      publishedAt: '2025-01-21T11:30:00Z',
      disasterId: '1',
      category: 'update'
    },
    {
      id: '3',
      title: 'Red Cross - Emergency Shelter Locations',
      content: 'The American Red Cross has opened three additional emergency shelters in Manhattan. Shelter locations and capacity information is available on our website.',
      source: 'American Red Cross',
      url: 'https://redcross.org',
      publishedAt: '2025-01-21T11:00:00Z',
      disasterId: '1',
      category: 'update'
    },
    {
      id: '4',
      title: 'Cal Fire - Evacuation Orders Expanded',
      content: 'Mandatory evacuation orders have been expanded to include additional zones in Los Angeles County. Residents should evacuate immediately via designated routes.',
      source: 'Cal Fire',
      url: 'https://fire.ca.gov',
      publishedAt: '2025-01-21T10:15:00Z',
      disasterId: '2',
      category: 'alert'
    },
    {
      id: '5',
      title: 'LA County Public Health - Air Quality Advisory',
      content: 'Due to wildfire smoke, air quality in affected areas is unhealthy. Residents should stay indoors and avoid outdoor activities.',
      source: 'LA County Public Health',
      url: 'https://publichealth.lacounty.gov',
      publishedAt: '2025-01-21T09:45:00Z',
      disasterId: '2',
      category: 'advisory'
    }
  ];

  useEffect(() => {
    setUpdates(mockUpdates);
    setLastRefresh(new Date());
  }, []);

  const refreshUpdates = async () => {
    setIsRefreshing(true);
    
    try {
      // Mock web scraping / Browse Page functionality
      await mockBrowsePageFetch();
      
      // Simulate new updates
      const newUpdate: OfficialUpdate = {
        id: Date.now().toString(),
        title: 'Emergency Services - Latest Update',
        content: 'Emergency services have reported improved conditions in affected areas. Continued monitoring is advised.',
        source: 'Emergency Services',
        url: 'https://emergency.gov',
        publishedAt: new Date().toISOString(),
        category: 'update'
      };

      setUpdates([newUpdate, ...updates]);
      setLastRefresh(new Date());
      
      toast({
        title: "Updates Refreshed",
        description: "Latest official updates have been fetched",
      });

    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Unable to fetch latest updates. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const mockBrowsePageFetch = async () => {
    // Simulate web scraping delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Fetching updates from government websites...');
    // In real implementation, this would use Browse Page or web scraping
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'alert': return 'bg-red-100 text-red-800 border-red-200';
      case 'update': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advisory': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closure': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'alert': return '🚨';
      case 'update': return 'ℹ️';
      case 'advisory': return '⚠️';
      case 'closure': return '🚫';
      default: return '📢';
    }
  };

  return (
    <div className="space-y-6">
      {/* Refresh Controls */}
      <div className="bg-slate-50 p-4 rounded-lg border">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Official Sources Monitor</h3>
            <p className="text-sm text-slate-600">
              Aggregating updates from FEMA, Red Cross, local emergency services
            </p>
            {lastRefresh && (
              <p className="text-xs text-slate-500 mt-1">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button 
            onClick={refreshUpdates}
            disabled={isRefreshing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRefreshing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Updates
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Updates Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🚨</span>
            <span className="font-semibold text-red-800">Alerts</span>
          </div>
          <div className="text-2xl font-bold text-red-900 mt-2">
            {updates.filter(u => u.category === 'alert').length}
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">ℹ️</span>
            <span className="font-semibold text-blue-800">Updates</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 mt-2">
            {updates.filter(u => u.category === 'update').length}
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <span className="font-semibold text-yellow-800">Advisories</span>
          </div>
          <div className="text-2xl font-bold text-yellow-900 mt-2">
            {updates.filter(u => u.category === 'advisory').length}
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-slate-600" />
            <span className="font-semibold text-slate-800">Total</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {updates.length}
          </div>
        </div>
      </div>

      {/* Official Updates Feed */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Latest Official Updates</h3>
        {updates.map((update) => (
          <div key={update.id} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getCategoryIcon(update.category)}</span>
                <span className={`px-2 py-1 rounded-full text-xs border ${getCategoryColor(update.category)}`}>
                  {update.category.toUpperCase()}
                </span>
                <span className="text-sm font-medium text-slate-700">{update.source}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar className="h-4 w-4" />
                {new Date(update.publishedAt).toLocaleString()}
              </div>
            </div>
            
            <h4 className="font-semibold text-lg text-slate-900 mb-2">{update.title}</h4>
            <p className="text-slate-700 mb-3">{update.content}</p>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-600">
                {update.disasterId && (
                  <span>
                    Related to: {disasters.find(d => d.id === update.disasterId)?.title || 'Unknown Disaster'}
                  </span>
                )}
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={update.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Source
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
