import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExperimentCreation } from "@/components/experiments/ExperimentCreation";
import { ExperimentList } from "@/components/experiments/ExperimentList";
import { ExperimentDetail } from "@/components/experiments/ExperimentDetail";
import { ArrowLeft, Play, Code, Eye } from "lucide-react";
import { getStatusBadgeStylesFromString } from "@/lib/experiment-styles";

// Mock experiment data for demo
const mockExperiments = [
  {
    id: "1",
    name: "Cell Culture Media Optimization",
    description: "Testing different media formulations for optimal cell growth",
    status: "completed" as const,
    estimatedCostUSD: 1250.00,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-16"),
    userId: "user1",
    items: []
  },
  {
    id: "2",
    name: "Protein Expression Study",
    description: "Investigating protein expression levels under various conditions",
    status: "analyzing" as const,
    estimatedCostUSD: 890.00,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-21"),
    userId: "user1",
    items: []
  },
  {
    id: "3",
    name: "Drug Screening Assay",
    description: "High-throughput screening of potential drug candidates",
    status: "submitted" as const,
    estimatedCostUSD: 2100.00,
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
    userId: "user1",
    items: []
  },
  {
    id: "4",
    name: "CRISPR Gene Editing",
    description: "Gene knockout experiments using CRISPR-Cas9",
    status: "failed" as const,
    estimatedCostUSD: 750.00,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-12"),
    userId: "user1",
    items: []
  }
];

type DemoView = 'overview' | 'creation' | 'list' | 'detail';

export const Demo = () => {
  const [currentView, setCurrentView] = useState<DemoView>('overview');
  const [selectedExperiment, setSelectedExperiment] = useState(mockExperiments[0]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              {currentView !== 'overview' && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentView('overview')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Overview
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Sci-BoM UI Demo
                </h1>
                <p className="text-gray-600">
                  Experiment Creation & Status Display Mockups
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Code className="h-3 w-3" />
                UI Mock
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'overview' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                UI Mockups for Experiment Management
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore the enhanced UI components for experiment creation, status tracking, 
                and detailed analysis views with AI-powered Thermo Fisher pricing integration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('creation')}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Play className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Experiment Creation Flow</CardTitle>
                      <CardDescription>Multi-step process with AI analysis</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Experience the enhanced experiment creation process with:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• CSV upload and processing</li>
                    <li>• AI-powered Thermo Fisher pricing analysis</li>
                    <li>• Real-time progress indicators</li>
                    <li>• Material cost comparison</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('list')}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Eye className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>Experiment List</CardTitle>
                      <CardDescription>Enhanced status display and navigation</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    View experiments with improved status indicators:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Visual status badges with icons</li>
                    <li>• Cost and material summaries</li>
                    <li>• Quick action buttons</li>
                    <li>• Detailed view navigation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('detail')}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Code className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle>Detailed Experiment View</CardTitle>
                      <CardDescription>Comprehensive analysis and actions</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Explore detailed experiment information:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Tabbed interface for organization</li>
                    <li>• Material pricing comparisons</li>
                    <li>• Cost analysis and trends</li>
                    <li>• Export and sharing options</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {currentView === 'creation' && (
          <ExperimentCreation 
            onExperimentCreated={() => setCurrentView('list')}
          />
        )}

        {currentView === 'list' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Experiment List Demo
              </h2>
              <p className="text-gray-600">
                Click "View Details" on any experiment to see the detailed view
              </p>
            </div>
            <div className="grid gap-6">
              {mockExperiments.map((experiment) => (
                <ExperimentCard 
                  key={experiment.id}
                  experiment={experiment} 
                  onViewDetails={setSelectedExperiment}
                />
              ))}
            </div>
          </div>
        )}

        {currentView === 'detail' && (
          <ExperimentDetail 
            experiment={selectedExperiment} 
            onClose={() => setCurrentView('overview')}
          />
        )}
      </main>
    </div>
  );
};

// Helper component for demo experiment cards
function ExperimentCard({ experiment, onViewDetails }: { 
  experiment: typeof mockExperiments[0]; 
  onViewDetails: (experiment: typeof mockExperiments[0]) => void;
}) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "analyzing":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "failed":
        return <AlertCircle className="h-4 w-4" />;
      case "submitted":
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card key={experiment.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">{experiment.name}</CardTitle>
            <CardDescription>{experiment.description}</CardDescription>
          </div>
          <Badge className={getStatusBadgeStylesFromString(experiment.status)}>
            {getStatusIcon(experiment.status)}
            {experiment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">4 materials</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Est: ${experiment.estimatedCostUSD.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {new Date(experiment.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(experiment)}
          >
            View Details
          </Button>
          <Button variant="outline" size="sm">
            Cost Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Import necessary components
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2, AlertCircle, Clock, FileText, DollarSign, Calendar } from "lucide-react"; 