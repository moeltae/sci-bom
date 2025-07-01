import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  DollarSign,
  Users,
  TrendingUp,
  Plus,
  LogOut,
} from "lucide-react";
import { BomUploader } from "@/components/bom/BomUploader";
import { ExperimentList } from "@/components/experiments/ExperimentList";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/dashboard/Header";
import Navigation from "./Navigation";
import DashboardTab from "./DashboardTab";

const stats = [
  {
    title: "Active Experiments",
    value: "12",
    icon: FileText,
    color: "text-blue-600",
  },
  {
    title: "Total Budget",
    value: "$45,230",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Materials Tracked",
    value: "156",
    icon: TrendingUp,
    color: "text-purple-600",
  },
  {
    title: "Team Members",
    value: "8",
    icon: Users,
    color: "text-orange-600",
  },
];

function StatsList() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MainContent({
  activeTab,
  setActiveTab,
}: {
  activeTab: DashboardTab;
  setActiveTab: (DashboardTab) => void;
}): JSX.Element {
  switch (activeTab) {
    case DashboardTab.Overview:
      return <StatsList />;
    case DashboardTab.Experiments:
      return <ExperimentList />;
    case DashboardTab.Create:
      return (
        <BomUploader
          onExperimentCreated={() => setActiveTab(DashboardTab.Create)}
        />
      );
    default:
      return null;
  }
}

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(DashboardTab.Overview);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <Navigation onSelectTab={setActiveTab} activeTab={activeTab} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MainContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </div>
  );
};
