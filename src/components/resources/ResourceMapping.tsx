
import React, { useState, useEffect } from 'react';
import { MapPin, Search, Plus, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Resource {
  id: string;
  disaster_id: string;
  name: string;
  location_name: string;
  location: { lat: number; lng: number };
  type: 'shelter' | 'hospital' | 'food' | 'water' | 'supplies' | 'evacuation';
  capacity?: number;
  contact?: string;
  status: 'available' | 'full' | 'closed';
  created_at: string;
}

interface ResourceMappingProps {
  disasters: any[];
}

export function ResourceMapping({ disasters }: ResourceMappingProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchRadius, setSearchRadius] = useState(10);
  const { toast } = useToast();

  // Mock resources data
  const mockResources: Resource[] = [
    {
      id: '1',
      disaster_id: '1',
      name: 'Red Cross Emergency Shelter',
      location_name: 'Lower East Side, NYC',
      location: { lat: 40.7152, lng: -73.9877 },
      type: 'shelter',
      capacity: 200,
      contact: '+1-555-0123',
      status: 'available',
      created_at: '2025-01-21T10:00:00Z'
    },
    {
      id: '2',
      disaster_id: '1',
      name: 'Mount Sinai Hospital',
      location_name: 'Upper East Side, NYC',
      location: { lat: 40.7903, lng: -73.9530 },
      type: 'hospital',
      capacity: 500,
      contact: '+1-555-0456',
      status: 'available',
      created_at: '2025-01-21T09:30:00Z'
    },
    {
      id: '3',
      disaster_id: '1',
      name: 'Food Distribution Center',
      location_name: 'Brooklyn Bridge Park',
      location: { lat: 40.7023, lng: -73.9964 },
      type: 'food',
      contact: '+1-555-0789',
      status: 'available',
      created_at: '2025-01-21T08:45:00Z'
    },
    {
      id: '4',
      disaster_id: '2',
      name: 'Emergency Evacuation Center',
      location_name: 'Santa Monica, CA',
      location: { lat: 34.0195, lng: -118.4912 },
      type: 'evacuation',
      capacity: 1000,
      contact: '+1-555-1234',
      status: 'available',
      created_at: '2025-01-21T07:00:00Z'
    }
  ];

  useEffect(() => {
    setResources(mockResources);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    location_name: '',
    type: 'shelter' as Resource['type'],
    capacity: '',
    contact: '',
    disaster_id: ''
  });

  const handleGeoSearch = async () => {
    if (!searchLocation.trim()) {
      toast({
        title: "Enter Search Location",
        description: "Please enter a location to search for nearby resources",
        variant: "destructive"
      });
      return;
    }

    // Mock geospatial search
    console.log(`Searching for ${selectedType} resources within ${searchRadius}km of ${searchLocation}`);
    
    // Simulate ST_DWithin query results
    const filteredResources = resources.filter(resource => {
      if (selectedType !== 'all' && resource.type !== selectedType) return false;
      
      // Mock distance calculation (in real app, this would be done in Supabase)
      const distance = Math.random() * 20; // Mock distance in km
      return distance <= searchRadius;
    });

    toast({
      title: "Geospatial Search Complete",
      description: `Found ${filteredResources.length} resources within ${searchRadius}km`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock geocoding for new resource
    const coordinates = await mockGeocoding(formData.location_name);
    
    const newResource: Resource = {
      id: Date.now().toString(),
      disaster_id: formData.disaster_id || disasters[0]?.id || '1',
      name: formData.name,
      location_name: formData.location_name,
      location: coordinates,
      type: formData.type,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      contact: formData.contact,
      status: 'available',
      created_at: new Date().toISOString()
    };

    setResources([...resources, newResource]);
    setFormData({
      name: '', location_name: '', type: 'shelter', capacity: '', contact: '', disaster_id: ''
    });
    setShowForm(false);
    
    toast({
      title: "Resource Added",
      description: "New resource has been mapped successfully",
    });
  };

  const mockGeocoding = async (locationName: string): Promise<{ lat: number; lng: number }> => {
    // Mock geocoding response
    return { 
      lat: 40.7831 + (Math.random() - 0.5) * 0.1, 
      lng: -73.9712 + (Math.random() - 0.5) * 0.1 
    };
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'shelter': return 'bg-blue-100 text-blue-800';
      case 'hospital': return 'bg-red-100 text-red-800';
      case 'food': return 'bg-green-100 text-green-800';
      case 'water': return 'bg-cyan-100 text-cyan-800';
      case 'supplies': return 'bg-purple-100 text-purple-800';
      case 'evacuation': return 'bg-orange-100 text-orange-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600';
      case 'full': return 'text-yellow-600';
      case 'closed': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Geospatial Search */}
      <div className="bg-slate-50 p-4 rounded-lg border">
        <h3 className="font-semibold mb-4">Find Nearby Resources</h3>
        <div className="grid grid-cols-4 gap-4 items-end">
          <div>
            <Label>Search Location</Label>
            <Input
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="e.g., Manhattan, NYC"
            />
          </div>
          <div>
            <Label>Resource Type</Label>
            <select 
              className="w-full p-2 border rounded-md"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="shelter">Shelters</option>
              <option value="hospital">Hospitals</option>
              <option value="food">Food</option>
              <option value="water">Water</option>
              <option value="supplies">Supplies</option>
              <option value="evacuation">Evacuation</option>
            </select>
          </div>
          <div>
            <Label>Radius (km)</Label>
            <Input
              type="number"
              value={searchRadius}
              onChange={(e) => setSearchRadius(parseInt(e.target.value) || 10)}
              min="1"
              max="100"
            />
          </div>
          <Button onClick={handleGeoSearch} className="bg-blue-600 hover:bg-blue-700">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Add Resource */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Resource Map</h3>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {showForm && (
        <div className="bg-slate-50 p-6 rounded-lg border">
          <h4 className="text-md font-semibold mb-4">Add New Resource</h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Resource Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Emergency Shelter"
                required
              />
            </div>
            <div>
              <Label htmlFor="location_name">Location</Label>
              <Input
                id="location_name"
                value={formData.location_name}
                onChange={(e) => setFormData({...formData, location_name: e.target.value})}
                placeholder="e.g., Manhattan, NYC"
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <select 
                id="type"
                className="w-full p-2 border rounded-md"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as Resource['type']})}
              >
                <option value="shelter">Shelter</option>
                <option value="hospital">Hospital</option>
                <option value="food">Food Distribution</option>
                <option value="water">Water Supply</option>
                <option value="supplies">Emergency Supplies</option>
                <option value="evacuation">Evacuation Center</option>
              </select>
            </div>
            <div>
              <Label htmlFor="capacity">Capacity (optional)</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                placeholder="Number of people"
              />
            </div>
            <div>
              <Label htmlFor="contact">Contact (optional)</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                placeholder="Phone or email"
              />
            </div>
            <div>
              <Label htmlFor="disaster_id">Associated Disaster</Label>
              <select 
                id="disaster_id"
                className="w-full p-2 border rounded-md"
                value={formData.disaster_id}
                onChange={(e) => setFormData({...formData, disaster_id: e.target.value})}
              >
                <option value="">Select disaster...</option>
                {disasters.map(disaster => (
                  <option key={disaster.id} value={disaster.id}>
                    {disaster.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 flex gap-2">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Add Resource
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Resources List */}
      <div className="grid gap-4">
        {resources.map((resource) => (
          <div key={resource.id} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-lg">{resource.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(resource.type)}`}>
                    {resource.type}
                  </span>
                  <span className={`text-sm font-medium ${getStatusColor(resource.status)}`}>
                    ● {resource.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                  <MapPin className="h-4 w-4" />
                  {resource.location_name}
                  <span className="text-slate-400">
                    ({resource.location.lat.toFixed(4)}, {resource.location.lng.toFixed(4)})
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {resource.capacity && (
                    <div>
                      <span className="font-medium">Capacity:</span> {resource.capacity}
                    </div>
                  )}
                  {resource.contact && (
                    <div>
                      <span className="font-medium">Contact:</span> {resource.contact}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Added:</span> {new Date(resource.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                View on Map
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
