import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Home,
  Code2,
  Bot,
  Rocket,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  status?: "active" | "warning" | "error";
}

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const defaultNavItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, label: "Dashboard", href: "/" },
  {
    icon: <Code2 className="w-5 h-5" />,
    label: "Code Editor",
    href: "/editor",
    status: "active",
  },
  { icon: <Bot className="w-5 h-5" />, label: "AI Lab", href: "/ai-lab" },
  {
    icon: <Rocket className="w-5 h-5" />,
    label: "Deployment",
    href: "/deployment",
    status: "warning",
  },
  {
    icon: <Settings className="w-5 h-5" />,
    label: "Settings",
    href: "/settings",
  },
];

const Sidebar = ({
  isCollapsed = false,
  onToggle = () => {},
  activeTab = "/",
  onTabChange = () => {},
}: SidebarProps) => {
  const [navItems] = useState<NavItem[]>(defaultNavItems);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "";
    }
  };

  return (
    <div
      className={`relative h-screen bg-gray-900 border-r border-purple-500/20 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-80"
      }`}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border border-purple-500/20 bg-gray-900"
        onClick={onToggle}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-purple-500" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-purple-500" />
        )}
      </Button>

      {/* Logo Area */}
      <div className="p-4 border-b border-purple-500/20">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-purple-500" />
          {!isCollapsed && (
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
              HUD Dashboard
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="h-[calc(100vh-5rem)] px-3">
        <nav className="space-y-2 py-4">
          <TooltipProvider>
            {navItems.map((item) => (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTab === item.href ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 ${
                      activeTab === item.href
                        ? "bg-purple-500/20 hover:bg-purple-500/30"
                        : ""
                    }`}
                    onClick={() => onTabChange(item.href)}
                  >
                    <div className="relative">
                      {item.icon}
                      {item.status && (
                        <div
                          className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${getStatusColor(
                            item.status,
                          )}`}
                        />
                      )}
                    </div>
                    {!isCollapsed && <span>{item.label}</span>}
                  </Button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </ScrollArea>

      {/* System Status */}
      <div className="absolute bottom-0 w-full p-4 border-t border-purple-500/20 bg-gray-900">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                </div>
                {!isCollapsed && (
                  <span className="text-sm text-gray-400">System Online</span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>All Systems Operational</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Sidebar;
