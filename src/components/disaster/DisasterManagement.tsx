
import React, { useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Disaster {
  id: string;
  title: string;
  location_name: string;
  description: string;
  tags: string[];
  owner_id: string;
  created_at: string;
  location?: { lat: number; lng: number };
}

interface DisasterManagementProps {
  disasters: Disaster[];
  setDisasters: (disasters: Disaster[]) => void;
}

export function DisasterManagement({ disasters, setDisasters }: DisasterManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    location_name: '',
    description: '',
    tags: ''
  });
  const { toast } = useToast();

  // Mock data for initial display
  React.useEffect(() => {
    if (disasters.length === 0) {
      const mockDisasters: Disaster[] = [
        {
          id: '1',
          title: 'NYC Flood Emergency',
          location_name: 'Manhattan, NYC',
          description: 'Heavy flooding in Manhattan due to unprecedented rainfall',
          tags: ['flood', 'urgent'],
          owner_id: 'netrunnerX',
          created_at: '2025-01-21T10:00:00Z',
          location: { lat: 40.7831, lng: -73.9712 }
        },
        {
          id: '2',
          title: 'California Wildfire',
          location_name: 'Los Angeles County, CA',
          description: 'Wildfire spreading rapidly in mountainous areas',
          tags: ['wildfire', 'evacuation'],
          owner_id: 'reliefAdmin',
          created_at: '2025-01-21T08:30:00Z',
          location: { lat: 34.0522, lng: -118.2437 }
        }
      ];
      setDisasters(mockDisasters);
    }
  }, [disasters.length, setDisasters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock Gemini API location extraction
    const extractedLocation = await mockLocationExtraction(formData.description);
    
    // Mock geocoding
    const coordinates = await mockGeocoding(formData.location_name || extractedLocation);
    
    const newDisaster: Disaster = {
      id: Date.now().toString(),
      title: formData.title,
      location_name: formData.location_name || extractedLocation,
      description: formData.description,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      owner_id: 'netrunnerX', // Mock current user
      created_at: new Date().toISOString(),
      location: coordinates
    };

    if (editingId) {
      setDisasters(disasters.map(d => d.id === editingId ? { ...newDisaster, id: editingId } : d));
      toast({ title: "Disaster Updated", description: "Disaster record has been updated successfully" });
    } else {
      setDisasters([...disasters, newDisaster]);
      toast({ title: "Disaster Created", description: "New disaster record has been created" });
    }

    // Reset form
    setFormData({ title: '', location_name: '', description: '', tags: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (disaster: Disaster) => {
    setFormData({
      title: disaster.title,
      location_name: disaster.location_name,
      description: disaster.description,
      tags: disaster.tags.join(', ')
    });
    setEditingId(disaster.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setDisasters(disasters.filter(d => d.id !== id));
    toast({ title: "Disaster Deleted", description: "Disaster record has been removed" });
  };

  // Mock functions for external API calls
  const mockLocationExtraction = async (description: string): Promise<string> => {
    // Simulate Gemini API call
    console.log('Extracting location from:', description);
    return "Manhattan, NYC"; // Mock response
  };

  const mockGeocoding = async (locationName: string): Promise<{ lat: number; lng: number }> => {
    // Simulate geocoding API call
    console.log('Geocoding location:', locationName);
    return { lat: 40.7831, lng: -73.9712 }; // Mock coordinates
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Active Disasters</h3>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Disaster
        </Button>
      </div>

      {showForm && (
        <div className="bg-slate-50 p-6 rounded-lg border">
          <h4 className="text-md font-semibold mb-4">
            {editingId ? 'Edit Disaster' : 'Create New Disaster'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., NYC Flood Emergency"
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location Name</Label>
              <Input
                id="location"
                value={formData.location_name}
                onChange={(e) => setFormData({...formData, location_name: e.target.value})}
                placeholder="e.g., Manhattan, NYC (optional - will extract from description)"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="w-full p-2 border rounded-md"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the disaster situation..."
                required
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="e.g., flood, urgent, evacuation"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingId ? 'Update' : 'Create'} Disaster
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ title: '', location_name: '', description: '', tags: '' });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {disasters.map((disaster) => (
          <div key={disaster.id} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{disaster.title}</h4>
                <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                  <MapPin className="h-4 w-4" />
                  {disaster.location_name}
                </div>
                <p className="text-slate-700 mt-2">{disaster.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Tag className="h-4 w-4 text-slate-500" />
                  {disaster.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs ${
                        tag === 'urgent' ? 'bg-red-100 text-red-800' : 
                        tag === 'flood' ? 'bg-blue-100 text-blue-800' :
                        tag === 'wildfire' ? 'bg-orange-100 text-orange-800' :
                        'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Created by {disaster.owner_id} • {new Date(disaster.created_at).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(disaster)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(disaster.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
