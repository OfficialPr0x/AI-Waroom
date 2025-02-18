import { useState } from "react";
import Sidebar from "./dashboard/Sidebar";
import WorkspaceContainer from "./dashboard/WorkspaceContainer";

interface HomeProps {
  initialTab?: string;
}

const Home = ({ initialTab = "/" }: HomeProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleSidebarToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const getWorkspaceTab = (path: string) => {
    switch (path) {
      case "/editor":
        return "editor";
      case "/ai-lab":
        return "ai";
      case "/deployment":
        return "deployment";
      case "/":
        return "dashboard";
      default:
        return "scraper";
    }
  };

  return (
    <div className="flex h-screen w-full bg-black text-white overflow-hidden">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={handleSidebarToggle}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <div className="flex-1 overflow-hidden">
        <WorkspaceContainer
          activeTab={getWorkspaceTab(activeTab)}
          onTabChange={(tab) => {
            switch (tab) {
              case "editor":
                handleTabChange("/editor");
                break;
              case "ai":
                handleTabChange("/ai-lab");
                break;
              case "deployment":
                handleTabChange("/deployment");
                break;
              case "dashboard":
                handleTabChange("/");
                break;
              default:
                handleTabChange("/scraper");
            }
          }}
        />
      </div>
    </div>
  );
};

export default Home;
