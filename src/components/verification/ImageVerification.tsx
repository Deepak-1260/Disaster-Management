
import React, { useState } from 'react';
import { Upload, Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface VerificationResult {
  id: string;
  imageUrl: string;
  disasterId: string;
  status: 'pending' | 'verified' | 'rejected' | 'suspicious';
  confidence: number;
  analysis: string;
  timestamp: string;
  submittedBy: string;
}

interface ImageVerificationProps {
  disasters: any[];
}

export function ImageVerification({ disasters }: ImageVerificationProps) {
  const [verifications, setVerifications] = useState<VerificationResult[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedDisaster, setSelectedDisaster] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  // Mock verification results
  React.useEffect(() => {
    const mockVerifications: VerificationResult[] = [
      {
        id: '1',
        imageUrl: 'https://example.com/flood1.jpg',
        disasterId: '1',
        status: 'verified',
        confidence: 0.95,
        analysis: 'Image shows genuine flood damage in urban area. Metadata indicates recent timestamp. No signs of manipulation detected.',
        timestamp: '2025-01-21T11:00:00Z',
        submittedBy: 'citizen_reporter'
      },
      {
        id: '2',
        imageUrl: 'https://example.com/fire1.jpg',
        disasterId: '2',
        status: 'suspicious',
        confidence: 0.45,
        analysis: 'Image shows signs of digital manipulation. Lighting inconsistencies detected. Recommend manual review.',
        timestamp: '2025-01-21T10:30:00Z',
        submittedBy: 'anonymous_user'
      },
      {
        id: '3',
        imageUrl: 'https://example.com/damage1.jpg',
        disasterId: '1',
        status: 'verified',
        confidence: 0.89,
        analysis: 'Authentic disaster damage visible. Consistent lighting and shadows. Geolocation matches reported area.',
        timestamp: '2025-01-21T09:45:00Z',
        submittedBy: 'local_news'
      }
    ];
    setVerifications(mockVerifications);
  }, []);

  const handleVerifyImage = async () => {
    if (!imageUrl.trim()) {
      toast({
        title: "Image URL Required",
        description: "Please enter an image URL to verify",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);

    try {
      // Mock Gemini API call for image verification
      const analysisResult = await mockGeminiImageAnalysis(imageUrl);
      
      const newVerification: VerificationResult = {
        id: Date.now().toString(),
        imageUrl,
        disasterId: selectedDisaster || disasters[0]?.id || '1',
        status: analysisResult.status,
        confidence: analysisResult.confidence,
        analysis: analysisResult.analysis,
        timestamp: new Date().toISOString(),
        submittedBy: 'current_user'
      };

      setVerifications([newVerification, ...verifications]);
      setImageUrl('');
      
      toast({
        title: "Image Verification Complete",
        description: `Image ${analysisResult.status} with ${(analysisResult.confidence * 100).toFixed(1)}% confidence`,
      });

    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Unable to verify image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const mockGeminiImageAnalysis = async (url: string): Promise<{
    status: 'verified' | 'rejected' | 'suspicious';
    confidence: number;
    analysis: string;
  }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis results
    const mockResults = [
      {
        status: 'verified' as const,
        confidence: 0.92,
        analysis: 'Image appears authentic. No signs of digital manipulation detected. Consistent lighting and shadows. Metadata suggests genuine capture timestamp.'
      },
      {
        status: 'suspicious' as const,
        confidence: 0.35,
        analysis: 'Potential signs of manipulation detected. Inconsistent lighting patterns. EXIF data suggests possible editing. Recommend manual review.'
      },
      {
        status: 'rejected' as const,
        confidence: 0.15,
        analysis: 'Clear evidence of digital manipulation. Clone stamp artifacts detected. Inconsistent perspective. Image likely fabricated.'
      }
    ];

    return mockResults[Math.floor(Math.random() * mockResults.length)];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'suspicious': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default: return <Shield className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'suspicious': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Verification Form */}
      <div className="bg-slate-50 p-6 rounded-lg border">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Verify Disaster Image
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/disaster-image.jpg"
            />
          </div>
          <div>
            <Label htmlFor="disaster">Associated Disaster</Label>
            <select 
              id="disaster"
              className="w-full p-2 border rounded-md"
              value={selectedDisaster}
              onChange={(e) => setSelectedDisaster(e.target.value)}
            >
              <option value="">Select disaster...</option>
              {disasters.map(disaster => (
                <option key={disaster.id} value={disaster.id}>
                  {disaster.title}
                </option>
              ))}
            </select>
          </div>
          <Button 
            onClick={handleVerifyImage}
            disabled={isVerifying}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isVerifying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Verifying...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Verify Image
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Verification Results Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-800">Verified</span>
          </div>
          <div className="text-2xl font-bold text-green-900 mt-2">
            {verifications.filter(v => v.status === 'verified').length}
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span className="font-semibold text-yellow-800">Suspicious</span>
          </div>
          <div className="text-2xl font-bold text-yellow-900 mt-2">
            {verifications.filter(v => v.status === 'suspicious').length}
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="font-semibold text-red-800">Rejected</span>
          </div>
          <div className="text-2xl font-bold text-red-900 mt-2">
            {verifications.filter(v => v.status === 'rejected').length}
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Pending</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 mt-2">
            {verifications.filter(v => v.status === 'pending').length}
          </div>
        </div>
      </div>

      {/* Verification History */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Verification History</h3>
        {verifications.map((verification) => (
          <div key={verification.id} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(verification.status)}
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(verification.status)}`}>
                    {verification.status.toUpperCase()}
                  </span>
                  <div className="text-sm text-slate-600 mt-1">
                    Confidence: <span className={`font-semibold ${getConfidenceColor(verification.confidence)}`}>
                      {(verification.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-slate-500">
                {new Date(verification.timestamp).toLocaleString()}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-slate-700 mb-2">Image URL:</div>
                <div className="text-sm text-blue-600 break-all">{verification.imageUrl}</div>
                <div className="text-sm text-slate-600 mt-2">
                  Submitted by: {verification.submittedBy}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700 mb-2">Analysis:</div>
                <div className="text-sm text-slate-800">{verification.analysis}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
