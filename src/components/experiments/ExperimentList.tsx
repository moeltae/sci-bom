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
import {
  Experiment,
  ExperimentStatus,
} from "../../../generated/prisma/index-browser";
import { useExperiments } from "@/hooks/use-experiments";
import { Skeleton } from "@/components/ui/skeleton";

const formatExperimentStatus = (status: ExperimentStatus) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "analyzing":
      return "bg-blue-100 text-blue-800";
    case "failed":
      return "bg-red-100 text-gray-800";
    case "submitted":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

function ExperimentCard({ experiment }: { experiment: Experiment }) {
  return (
    <Card key={experiment.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">{experiment.name}</CardTitle>
            <CardDescription>{experiment.description}</CardDescription>
          </div>
          <Badge className={formatExperimentStatus(experiment.status)}>
            {experiment.status}
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
            Cost Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonCard(): JSX.Element {
  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  );
}

export const ExperimentList = () => {
  const { experiments, loading, error } = useExperiments();

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
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <p>{error}</p>
        ) : (
          experiments.map((experiment) => (
            <ExperimentCard experiment={experiment} />
          ))
        )}
      </div>
    </div>
  );
};
