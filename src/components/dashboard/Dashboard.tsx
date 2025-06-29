
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, DollarSign, Users, TrendingUp, Plus } from "lucide-react";
import { BomUploader } from "@/components/bom/BomUploader";
import { ExperimentList } from "@/components/experiments/ExperimentList";
import { CostAnalysis } from "@/components/analysis/CostAnalysis";

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { title: "Active Experiments", value: "12", icon: FileText, color: "text-blue-600" },
    { title: "Total Budget", value: "$45,230", icon: DollarSign, color: "text-green-600" },
    { title: "Materials Tracked", value: "156", icon: TrendingUp, color: "text-purple-600" },
    { title: "Team Members", value: "8", icon: Users, color: "text-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">BoM Generator</h1>
              <p className="text-gray-600">Biotech Experiment Planning Platform</p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => setActiveTab("upload")} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Experiment
              </Button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                JS
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "experiments", label: "Experiments" },
              { id: "upload", label: "Upload BoM" },
              { id: "analysis", label: "Cost Analysis" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates on your experiments and BoMs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Cell Culture Media BoM updated", time: "2 hours ago", type: "update" },
                    { title: "New experiment: Protein Purification", time: "1 day ago", type: "new" },
                    { title: "Cost analysis completed for CRISPR project", time: "2 days ago", type: "analysis" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.type === "update" ? "bg-blue-500" :
                        activity.type === "new" ? "bg-green-500" : "bg-purple-500"
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "experiments" && <ExperimentList />}
        {activeTab === "upload" && <BomUploader />}
        {activeTab === "analysis" && <CostAnalysis />}
      </main>
    </div>
  );
};
