import { useState } from "react";
import { BomUploader } from "@/components/bom/BomUploader";
import { ExperimentList } from "@/components/experiments/ExperimentList";
import Header from "@/components/dashboard/Header";
import Navigation from "./Navigation";
import DashboardTab from "./DashboardTab";

function MainContent({
  activeTab,
  setActiveTab,
}: {
  activeTab: DashboardTab;
  setActiveTab: (DashboardTab) => void;
}): JSX.Element {
  switch (activeTab) {
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
  const [activeTab, setActiveTab] = useState(DashboardTab.Experiments);

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
