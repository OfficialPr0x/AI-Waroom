import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Workflow,
  Settings,
  Play,
  Save,
  Trash2,
  Bot,
  Rocket,
  Code2,
  Users,
  Globe,
  Megaphone,
  Sword,
} from "lucide-react";
import WarRoom from "./WarRoom";

type AgentType =
  | "marketing"
  | "coding"
  | "project"
  | "brand"
  | "bot"
  | "community";

interface AgentTemplate {
  id: string;
  type: AgentType;
  name: string;
  description: string;
  icon: React.ReactNode;
  config: Record<string, any>;
}

const agentTemplates: AgentTemplate[] = [
  {
    id: "marketing-1",
    type: "marketing",
    name: "Content Generator",
    description: "Creates engaging marketing content across platforms",
    icon: <Megaphone className="w-5 h-5 text-blue-500" />,
    config: { platforms: ["twitter", "linkedin"] },
  },
  {
    id: "coding-1",
    type: "coding",
    name: "Code Assistant",
    description: "Helps with code review and optimization",
    icon: <Code2 className="w-5 h-5 text-green-500" />,
    config: { languages: ["javascript", "python"] },
  },
  {
    id: "project-1",
    type: "project",
    name: "Project Manager",
    description: "Manages tasks and team coordination",
    icon: <Workflow className="w-5 h-5 text-purple-500" />,
    config: { methodology: "agile" },
  },
  {
    id: "brand-1",
    type: "brand",
    name: "Brand Strategist",
    description: "Develops and maintains brand identity",
    icon: <Globe className="w-5 h-5 text-pink-500" />,
    config: { channels: ["social", "web"] },
  },
  {
    id: "bot-1",
    type: "bot",
    name: "Customer Service Bot",
    description: "Handles customer inquiries and support",
    icon: <Bot className="w-5 h-5 text-yellow-500" />,
    config: { platform: "chat" },
  },
  {
    id: "community-1",
    type: "community",
    name: "Community Manager",
    description: "Grows and engages community members",
    icon: <Users className="w-5 h-5 text-red-500" />,
    config: { platforms: ["discord", "slack"] },
  },
];

interface AILabPanelProps {
  onSave?: (agent: AgentTemplate) => void;
  onDeploy?: (agent: AgentTemplate) => void;
}

const AILabPanel = ({ onSave, onDeploy }: AILabPanelProps) => {
  const [selectedTemplate, setSelectedTemplate] =
    useState<AgentTemplate | null>(null);
  const [activeTab, setActiveTab] = useState("war-room");

  return (
    <div className="w-full h-full bg-black/90 text-white">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <div className="border-b border-gray-800">
          <TabsList className="w-full justify-start bg-transparent border-b border-gray-800 rounded-none px-6">
            <TabsTrigger value="war-room" className="data-[state=active]:bg-gray-800/50">
              War Room
            </TabsTrigger>
            <TabsTrigger value="agent-builder" className="data-[state=active]:bg-gray-800/50">
              Agent Builder
            </TabsTrigger>
            <TabsTrigger value="playground" className="data-[state=active]:bg-gray-800/50">
              AI Playground
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="war-room" className="h-[calc(100%-48px)] m-0 outline-none">
          <WarRoom onSettingsClick={() => {}} />
        </TabsContent>

        <TabsContent value="agent-builder" className="h-[calc(100%-48px)] m-0 p-6 outline-none">
          <div className="flex flex-col h-full gap-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500">
                AI Agent Builder
              </h1>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="border-pink-500 hover:bg-pink-500/20"
                  onClick={() => onSave?.(selectedTemplate)}
                  disabled={!selectedTemplate}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Agent
                </Button>
                <Button
                  variant="outline"
                  className="border-cyan-500 hover:bg-cyan-500/20"
                  onClick={() => onDeploy?.(selectedTemplate)}
                  disabled={!selectedTemplate}
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Deploy
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6 flex-grow">
              {/* Templates Panel */}
              <Card className="col-span-8 bg-gray-900/50 border-gray-800">
                <Tabs defaultValue="templates">
                  <TabsList className="w-full grid grid-cols-2 bg-gray-900/50">
                    <TabsTrigger value="templates">Agent Templates</TabsTrigger>
                    <TabsTrigger value="custom">Custom Agent</TabsTrigger>
                  </TabsList>

                  <TabsContent value="templates" className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      {agentTemplates.map((template) => (
                        <Card
                          key={template.id}
                          className={`p-4 border-gray-800 hover:border-pink-500 cursor-pointer transition-colors ${selectedTemplate?.id === template.id ? "border-pink-500" : ""}`}
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            {template.icon}
                            <span className="font-semibold">{template.name}</span>
                          </div>
                          <p className="text-sm text-gray-400">
                            {template.description}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="custom" className="p-6">
                    <Card className="p-6 border-gray-800">
                      <h3 className="text-lg font-semibold mb-4">
                        Create Custom Agent
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-gray-400">
                            Agent Name
                          </label>
                          <Input
                            className="mt-1 bg-gray-900 border-gray-800"
                            placeholder="Enter agent name"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">
                            Description
                          </label>
                          <Input
                            className="mt-1 bg-gray-900 border-gray-800"
                            placeholder="Describe your agent's purpose"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">
                            Capabilities
                          </label>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {[
                              "Natural Language Processing",
                              "Data Analysis",
                              "Task Automation",
                              "Content Generation",
                              "Decision Making",
                              "Pattern Recognition",
                            ].map((capability) => (
                              <Button
                                key={capability}
                                variant="outline"
                                className="justify-start border-gray-800 hover:border-pink-500"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                {capability}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </Card>

              {/* Configuration Panel */}
              <Card className="col-span-4 bg-gray-900/50 border-gray-800">
                <div className="p-4 border-b border-gray-800">
                  <h3 className="text-lg font-semibold">Agent Configuration</h3>
                </div>
                <ScrollArea className="h-[calc(100%-60px)] p-4">
                  {selectedTemplate ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Agent Type</label>
                        <div className="mt-1 p-2 bg-gray-900 rounded-md border border-gray-800">
                          <div className="flex items-center gap-2">
                            {selectedTemplate.icon}
                            <span className="capitalize">
                              {selectedTemplate.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">Settings</label>
                        <Card className="mt-1 p-4 bg-gray-900 border-gray-800">
                          <pre className="text-sm text-gray-400">
                            {JSON.stringify(selectedTemplate.config, null, 2)}
                          </pre>
                        </Card>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">Actions</label>
                        <div className="mt-2 space-y-2">
                          <Button
                            variant="outline"
                            className="w-full justify-start border-gray-800 hover:border-pink-500"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Configure Permissions
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start border-gray-800 hover:border-pink-500"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Test Agent
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                      <Bot className="w-12 h-12 mb-4" />
                      <p>Select an agent template to configure</p>
                    </div>
                  )}
                </ScrollArea>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="playground" className="h-[calc(100%-48px)] m-0 p-6 outline-none">
          <div className="flex flex-col items-center justify-center h-full">
            <Sword className="w-16 h-16 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Playground Coming Soon</h3>
            <p className="text-gray-400 text-center max-w-md">
              Experiment with different AI models and capabilities in an interactive playground.
              Test prompts, fine-tune responses, and explore the potential of AI.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AILabPanel;
