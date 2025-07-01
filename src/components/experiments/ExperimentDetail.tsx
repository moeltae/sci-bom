import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  Loader2,
  AlertCircle,
  Clock,
  Brain,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Download,
  Share2,
} from "lucide-react";
import {
  Experiment,
  ExperimentStatus,
} from "../../../generated/prisma/index-browser";
import { getStatusBadgeStyles } from "@/lib/experiment-styles";
import DashboardTab from "../dashboard/DashboardTab";

interface ExperimentDetailProps {
  experiment: Experiment;
  onClose?: () => void;
}

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

export const ExperimentDetail = ({
  experiment,
  onClose,
}: ExperimentDetailProps) => {
  const [activeTab, setActiveTab] = useState(DashboardTab.Experiments);

  // Use real experiment items, with fallback to empty array if items not loaded
  const items = experiment.items || [];

  // For now, we'll use the estimated costs from the database
  // In the future, when AI analysis is implemented, we'll have thermoFisherPrice data
  const totalEstimatedCost = items.reduce(
    (sum, item) => sum + (item.estimatedCostUSD || 0),
    0
  );

  // For demo purposes, simulate some Thermo Fisher pricing (remove this when real AI is implemented)
  const itemsWithSimulatedPricing = items.map((item, index) => ({
    ...item,
    thermoFisherPrice: item.estimatedCostUSD
      ? item.estimatedCostUSD * (0.9 + Math.random() * 0.2)
      : 0, // ±10% variation
    thermoFisherCatalog: `TF-${Math.random()
      .toString(36)
      .substr(2, 8)
      .toUpperCase()}`,
    analysisStatus:
      experiment.status === "completed"
        ? ("completed" as const)
        : ("pending" as const),
  }));

  const totalThermoFisherCost = itemsWithSimulatedPricing.reduce(
    (sum, item) => sum + (item.thermoFisherPrice || 0),
    0
  );
  const costDifference = totalThermoFisherCost - totalEstimatedCost;
  const costDifferencePercent =
    totalEstimatedCost > 0 ? (costDifference / totalEstimatedCost) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {experiment.name}
          </h1>
          <p className="text-gray-600 mt-2">{experiment.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={getStatusBadgeStyles(experiment.status)}>
            {getStatusIcon(experiment.status)}
            {experiment.status}
          </Badge>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">
                Materials
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{items.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600">
                Estimated Cost
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${totalEstimatedCost.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-600">
                AI Pricing
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${totalThermoFisherCost.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {costDifference > 0 ? (
                <TrendingUp className="h-5 w-5 text-red-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-green-500" />
              )}
              <span className="text-sm font-medium text-gray-600">
                Difference
              </span>
            </div>
            <p
              className={`text-2xl font-bold ${
                costDifference > 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {costDifference > 0 ? "+" : ""}${costDifference.toFixed(2)}
            </p>
            <p
              className={`text-sm ${
                costDifference > 0 ? "text-red-500" : "text-green-500"
              }`}
            >
              {costDifference > 0 ? "+" : ""}
              {costDifferencePercent.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Analysis</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Experiment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Basic Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span>
                        {new Date(experiment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span>
                        {new Date(experiment.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge
                        className={getStatusBadgeStyles(experiment.status)}
                      >
                        {getStatusIcon(experiment.status)}
                        {experiment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Cost Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Original Estimate:</span>
                      <span>${totalEstimatedCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">AI-Priced Total:</span>
                      <span>${totalThermoFisherCost.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Difference:</span>
                      <span
                        className={
                          costDifference > 0 ? "text-red-600" : "text-green-600"
                        }
                      >
                        {costDifference > 0 ? "+" : ""}$
                        {costDifference.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Materials List</CardTitle>
              <CardDescription>
                {items.length} materials with Thermo Fisher pricing analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-medium">Material</th>
                      <th className="text-left p-3 font-medium">Quantity</th>
                      <th className="text-left p-3 font-medium">Est. Cost</th>
                      <th className="text-left p-3 font-medium">
                        Thermo Fisher
                      </th>
                      <th className="text-left p-3 font-medium">Difference</th>
                      <th className="text-left p-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsWithSimulatedPricing.map((item) => {
                      const itemDiff =
                        (item.thermoFisherPrice || 0) -
                        (item.estimatedCostUSD || 0);
                      return (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{item.name}</td>
                          <td className="p-3">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="p-3">
                            ${item.estimatedCostUSD?.toFixed(2) || "TBD"}
                          </td>
                          <td className="p-3">
                            <div>
                              <div className="font-medium">
                                ${item.thermoFisherPrice?.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.thermoFisherCatalog}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span
                              className={
                                itemDiff > 0 ? "text-red-600" : "text-green-600"
                              }
                            >
                              {itemDiff > 0 ? "+" : ""}${itemDiff.toFixed(2)}
                            </span>
                          </td>
                          <td className="p-3">
                            <Badge
                              variant={
                                item.analysisStatus === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {item.analysisStatus === "completed"
                                ? "Found"
                                : "Pending"}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Analysis</CardTitle>
              <CardDescription>
                Comparison between estimated costs and Thermo Fisher pricing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cost Comparison Chart */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Cost Breakdown</h4>
                  <div className="space-y-3">
                    {itemsWithSimulatedPricing.map((item) => {
                      const itemDiff =
                        (item.thermoFisherPrice || 0) -
                        (item.estimatedCostUSD || 0);
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.quantity} {item.unit}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm">
                              ${item.estimatedCostUSD?.toFixed(2) || "TBD"} → $
                              {item.thermoFisherPrice?.toFixed(2)}
                            </div>
                            <div
                              className={`text-xs ${
                                itemDiff > 0 ? "text-red-600" : "text-green-600"
                              }`}
                            >
                              {itemDiff > 0 ? "+" : ""}${itemDiff.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Summary</h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Total Estimated</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        ${totalEstimatedCost.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-purple-500" />
                        <span className="font-medium">AI-Priced Total</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">
                        ${totalThermoFisherCost.toFixed(2)}
                      </p>
                    </div>
                    <div
                      className={`p-4 rounded-lg ${
                        costDifference > 0 ? "bg-red-50" : "bg-green-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {costDifference > 0 ? (
                          <TrendingUp className="h-4 w-4 text-red-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-green-500" />
                        )}
                        <span className="font-medium">Difference</span>
                      </div>
                      <p
                        className={`text-2xl font-bold ${
                          costDifference > 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {costDifference > 0 ? "+" : ""}$
                        {costDifference.toFixed(2)}
                      </p>
                      <p
                        className={`text-sm ${
                          costDifference > 0 ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {costDifference > 0 ? "+" : ""}
                        {costDifferencePercent.toFixed(1)}% change
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                Export, share, or manage your experiment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Materials List
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Experiment
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View in Thermo Fisher
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
