import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScraperPanel from "./scraper/ScraperPanel";
import CodeEditorPanel from "./editor/CodeEditorPanel";
import AILabPanel from "./ai/AILabPanel";
import DeploymentPanel from "./deployment/DeploymentPanel";
import { Code, Bot, Globe, Rocket, Home } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, GitBranch, Search, ArrowRight } from "lucide-react";

interface Stack {
  id: string;
  name: string;
  description: string;
  icon: string;
  tags: string[];
}

const stacks: Stack[] = [
  {
    id: "t3",
    name: "T3 Stack",
    description: "Full-stack, typesafe Next.js with tRPC, Tailwind, and Prisma",
    icon: "https://create.t3.gg/images/t3-light.svg",
    tags: ["Next.js", "tRPC", "Tailwind", "Prisma"],
  },
  {
    id: "remix",
    name: "Remix",
    description: "Full-stack React framework with great DX and performance",
    icon: "https://remix.run/img/og.1.jpg",
    tags: ["Remix", "React", "TypeScript"],
  },
  {
    id: "nuxt",
    name: "Nuxt.js",
    description: "Intuitive Vue Framework for building universal applications",
    icon: "https://nuxt.com/icon.png",
    tags: ["Vue", "Nuxt", "TypeScript"],
  },
  {
    id: "react-vite",
    name: "React + Vite",
    description: "Lightning fast React development with Vite",
    icon: "https://vitejs.dev/logo.svg",
    tags: ["React", "Vite", "TypeScript"],
  },
];

interface WorkspaceContainerProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const WorkspaceContainer: React.FC<WorkspaceContainerProps> = ({
  activeTab = "dashboard",
  onTabChange = () => {},
}) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="h-full w-full bg-black text-white overflow-hidden">
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="h-full flex flex-col"
      >
        <div className="border-b border-gray-800 px-4">
          <TabsList className="bg-transparent">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-400"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="scraper"
              className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400"
            >
              <Globe className="w-4 h-4 mr-2" />
              Scraper
            </TabsTrigger>
            <TabsTrigger
              value="editor"
              className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-400"
            >
              <Code className="w-4 h-4 mr-2" />
              Code Editor
            </TabsTrigger>
            <TabsTrigger
              value="ai"
              className="data-[state=active]:bg-pink-600/20 data-[state=active]:text-pink-400"
            >
              <Bot className="w-4 h-4 mr-2" />
              AI Lab
            </TabsTrigger>
            <TabsTrigger
              value="deployment"
              className="data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Deployment
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto">
          <TabsContent value="dashboard" className="h-full m-0 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Start a New Project</h2>
                <div className="flex items-center gap-4">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search templates..."
                      className="pl-9 bg-gray-800 border-gray-700"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stacks.map((stack) => (
                  <Card
                    key={stack.id}
                    className="bg-gray-800/50 border-gray-700 hover:border-purple-500 transition-colors cursor-pointer p-6 flex gap-4"
                    onClick={() => handleTabChange("editor")}
                  >
                    <img
                      src={stack.icon}
                      alt={stack.name}
                      className="w-12 h-12 object-contain"
                    />
                    <div>
                      <h3 className="font-semibold mb-2">{stack.name}</h3>
                      <p className="text-sm text-gray-400 mb-3">
                        {stack.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {stack.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-700 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="scraper" className="h-full m-0">
            <ScraperPanel />
          </TabsContent>
          <TabsContent value="editor" className="h-full m-0">
            <CodeEditorPanel />
          </TabsContent>
          <TabsContent value="ai" className="h-full m-0">
            <AILabPanel />
          </TabsContent>
          <TabsContent value="deployment" className="h-full m-0">
            <DeploymentPanel />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default WorkspaceContainer;
