
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, DollarSign, Calendar } from "lucide-react";

interface Experiment {
  id: string;
  name: string;
  status: "active" | "completed" | "draft";
  materialCount: number;
  estimatedCost: number;
  actualCost?: number;
  createdDate: string;
  description: string;
}

const mockExperiments: Experiment[] = [
  {
    id: "1",
    name: "Cell Culture Media Optimization",
    status: "active",
    materialCount: 24,
    estimatedCost: 1250,
    actualCost: 1180,
    createdDate: "2024-12-20",
    description: "Testing different media formulations for HEK293 cells"
  },
  {
    id: "2", 
    name: "CRISPR Cas9 Gene Editing",
    status: "active",
    materialCount: 18,
    estimatedCost: 2800,
    createdDate: "2024-12-18",
    description: "Materials for targeted gene knockout experiments"
  },
  {
    id: "3",
    name: "Protein Purification Protocol",
    status: "completed",
    materialCount: 12,
    estimatedCost: 890,
    actualCost: 920,
    createdDate: "2024-12-15",
    description: "His-tag protein purification using FPLC"
  },
  {
    id: "4",
    name: "Flow Cytometry Analysis",
    status: "draft",
    materialCount: 8,
    estimatedCost: 650,
    createdDate: "2024-12-28",
    description: "Antibodies and reagents for cell surface marker analysis"
  }
];

export const ExperimentList = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Experiments</h2>
        <p className="text-gray-600">Manage and track your biotech experiment materials and costs</p>
      </div>

      <div className="grid gap-6">
        {mockExperiments.map((experiment) => (
          <Card key={experiment.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{experiment.name}</CardTitle>
                  <CardDescription>{experiment.description}</CardDescription>
                </div>
                <Badge className={getStatusColor(experiment.status)}>
                  {experiment.status.charAt(0).toUpperCase() + experiment.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {experiment.materialCount} materials
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Est: ${experiment.estimatedCost.toLocaleString()}
                    {experiment.actualCost && (
                      <span className="ml-2 text-green-600">
                        (Actual: ${experiment.actualCost.toLocaleString()})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {new Date(experiment.createdDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  Edit BoM
                </Button>
                <Button variant="outline" size="sm">
                  Cost Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
