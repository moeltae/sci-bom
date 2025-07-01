import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, DollarSign, Calendar, CheckCircle, Loader2, AlertCircle, Clock } from "lucide-react";
import {
  Experiment,
  ExperimentStatus,
} from "../../../generated/prisma/index-browser";
import { useExperiments } from "@/hooks/use-experiments";
import { Skeleton } from "@/components/ui/skeleton";
import { ExperimentDetail } from "./ExperimentDetail";

const formatExperimentStatus = (status: ExperimentStatus) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "analyzing":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "failed":
      return "bg-red-100 text-red-800 border-red-200";
    case "submitted":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status: ExperimentStatus) => {
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

function ExperimentCard({ experiment, onViewDetails }: { experiment: Experiment; onViewDetails: (experiment: Experiment) => void }) {
  return (
    <Card key={experiment.id} className={`hover:shadow-md transition-shadow ${
      experiment.status === 'analyzing' ? 'ring-2 ring-blue-200 bg-blue-50' : ''
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">{experiment.name}</CardTitle>
            <CardDescription>{experiment.description}</CardDescription>
          </div>
          <Badge className={`${formatExperimentStatus(experiment.status)} flex items-center gap-1`}>
            {getStatusIcon(experiment.status)}
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

        {experiment.status === 'analyzing' && (
          <div className="mb-3 p-3 bg-blue-100 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>AI analysis in progress... This may take a few minutes.</span>
            </div>
          </div>
        )}
        
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
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);

  return (
    <div className="space-y-6">
      {selectedExperiment ? (
        <ExperimentDetail 
          experiment={selectedExperiment} 
          onClose={() => setSelectedExperiment(null)}
        />
      ) : (
        <>
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
                <ExperimentCard 
                  key={experiment.id}
                  experiment={experiment} 
                  onViewDetails={setSelectedExperiment}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
