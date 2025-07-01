import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, DollarSign, Calendar } from "lucide-react";
import type {
  Experiment,
  ExperimentStatus,
} from "../../../generated/prisma/index-browser";
import { useExperiments } from "@/hooks/use-experiments";

const getStatusColor = (status: ExperimentStatus) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "draft":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const ExperimentList = () => {
  const { experiments, loading, error, refetch } = useExperiments();

  console.log(experiments, loading, error);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Experiments
        </h2>
        <p className="text-gray-600">
          Manage and track your biotech experiment materials and costs
        </p>
      </div>

      <div className="grid gap-6">
        {experiments.map((experiment) => (
          <Card
            key={experiment.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{experiment.name}</CardTitle>
                  <CardDescription>{experiment.description}</CardDescription>
                </div>
                <Badge className={getStatusColor(experiment.status)}>
                  {experiment.status.charAt(0).toUpperCase() +
                    experiment.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
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
