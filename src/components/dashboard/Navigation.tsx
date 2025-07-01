import DashboardTab from "./DashboardTab";

const tabs = [
  {
    id: DashboardTab.Overview,
    label: "Overview",
  },
  {
    id: DashboardTab.Experiments,
    label: "Experiments",
  },
  {
    id: DashboardTab.Create,
    label: "Create",
  },
] as const;

export default function Navigation({
  onSelectTab,
  activeTab,
}: {
  onSelectTab: (tab: DashboardTab) => void;
  activeTab: DashboardTab;
}): JSX.Element {
  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
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
  );
}
