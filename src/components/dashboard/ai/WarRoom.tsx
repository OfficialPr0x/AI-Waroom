import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  Code2,
  Shield,
  Zap,
  Plus,
  Settings,
  BarChart,
  RefreshCw,
  Trophy,
  Sparkles,
} from "lucide-react";
import AgentCard from "./AgentCard";
import AgentDetail from "./AgentDetail";
import Marketplace from "./Marketplace";
import { AgentManager } from "@/lib/agents/AgentManager";
import { BaseAgent } from "@/lib/agents/BaseAgent";
import { CodeReviewAgent } from "@/lib/agents/specialized/CodeReviewAgent";
import { SecurityAgent } from "@/lib/agents/specialized/SecurityAgent";
import { OptimizationAgent } from "@/lib/agents/specialized/OptimizationAgent";

interface WarRoomProps {
  onSettingsClick?: () => void;
}

const WarRoom: React.FC<WarRoomProps> = ({ onSettingsClick }) => {
  const [agents, setAgents] = useState<BaseAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<BaseAgent | null>(null);
  const [activeTab, setActiveTab] = useState("agents");
  const agentManager = AgentManager.getInstance();

  useEffect(() => {
    // Load agents from storage on component mount
    agentManager.loadAgents();
    setAgents(agentManager.getAllAgents());

    // If no agents exist, create default ones
    if (agentManager.getAllAgents().length === 0) {
      createDefaultAgents();
    }
  }, []);

  const createDefaultAgents = () => {
    // Create default agents if none exist
    const codeReviewConfig = CodeReviewAgent.createDefault(
      "Code Reviewer",
      "Reviews code for quality and best practices"
    );
    const securityConfig = SecurityAgent.createDefault(
      "Security Guardian",
      "Scans code for security vulnerabilities"
    );
    const optimizationConfig = OptimizationAgent.createDefault(
      "Performance Optimizer",
      "Analyzes and improves code performance"
    );

    const codeReviewAgent = agentManager.createAgent(codeReviewConfig);
    const securityAgent = agentManager.createAgent(securityConfig);
    const optimizationAgent = agentManager.createAgent(optimizationConfig);

    agentManager.saveAgents();
    setAgents(agentManager.getAllAgents());
  };

  const handleAgentSelect = (agent: BaseAgent) => {
    setSelectedAgent(agent);
  };

  const handleCreateAgent = (type: string) => {
    let newAgent: BaseAgent | null = null;

    switch (type) {
      case "code-review":
        const codeReviewConfig = CodeReviewAgent.createDefault(
          "New Code Reviewer",
          "Custom code review agent"
        );
        newAgent = agentManager.createAgent(codeReviewConfig);
        break;
      case "security":
        const securityConfig = SecurityAgent.createDefault(
          "New Security Guardian",
          "Custom security analysis agent"
        );
        newAgent = agentManager.createAgent(securityConfig);
        break;
      case "optimization":
        const optimizationConfig = OptimizationAgent.createDefault(
          "New Performance Optimizer",
          "Custom optimization agent"
        );
        newAgent = agentManager.createAgent(optimizationConfig);
        break;
    }

    if (newAgent) {
      agentManager.saveAgents();
      setAgents(agentManager.getAllAgents());
      setSelectedAgent(newAgent);
    }
  };

  const handleAgentUpdate = (agentId: string, updates: any) => {
    const success = agentManager.updateAgent(agentId, updates);
    if (success) {
      agentManager.saveAgents();
      setAgents(agentManager.getAllAgents());
      
      // Update selected agent if it's the one being updated
      if (selectedAgent && selectedAgent.getId() === agentId) {
        setSelectedAgent(agentManager.getAgent(agentId) || null);
      }
    }
  };

  const handleAgentDelete = (agentId: string) => {
    const success = agentManager.deleteAgent(agentId);
    if (success) {
      agentManager.saveAgents();
      setAgents(agentManager.getAllAgents());
      
      // Clear selected agent if it's the one being deleted
      if (selectedAgent && selectedAgent.getId() === agentId) {
        setSelectedAgent(null);
      }
    }
  };

  const handleImportAgent = (agentId: string) => {
    const agent = agentManager.getAgent(agentId);
    if (agent) {
      setSelectedAgent(agent);
      setActiveTab("agents");
    }
  };

  return (
    <div className="w-full h-full bg-black/90 text-white p-6">
      <div className="flex flex-col h-full gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
            AI War Room
          </h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="border-purple-500 hover:bg-purple-500/20"
              onClick={onSettingsClick}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              className="border-cyan-500 hover:bg-cyan-500/20"
              onClick={() => setActiveTab("marketplace")}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Marketplace
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
          <TabsList className="w-full grid grid-cols-4 bg-gray-900/50 mb-6">
            <TabsTrigger value="agents">My Agents</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <div className="flex-grow">
            <TabsContent value="agents" className="m-0 h-full">
              <div className="grid grid-cols-12 gap-6 h-full">
                {/* Agents Panel */}
                <Card className="col-span-8 bg-gray-900/50 border-gray-800">
                  <div className="p-4 border-b border-gray-800">
                    <h3 className="text-lg font-semibold">My AI Agents</h3>
                  </div>
                  <ScrollArea className="h-[calc(100%-60px)] p-4">
                    <div className="grid grid-cols-2 gap-4">
                      {agents.map((agent) => (
                        <AgentCard
                          key={agent.getId()}
                          agent={agent}
                          isSelected={selectedAgent?.getId() === agent.getId()}
                          onClick={() => handleAgentSelect(agent)}
                        />
                      ))}
                      
                      {/* Add New Agent Cards */}
                      <Card
                        className="p-4 border-gray-800 hover:border-purple-500 cursor-pointer transition-colors flex flex-col items-center justify-center h-48"
                        onClick={() => handleCreateAgent("code-review")}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <Code2 className="w-6 h-6 text-purple-400" />
                          </div>
                          <span className="font-semibold">New Code Review Agent</span>
                          <Plus className="w-5 h-5 text-gray-400" />
                        </div>
                      </Card>
                      
                      <Card
                        className="p-4 border-gray-800 hover:border-red-500 cursor-pointer transition-colors flex flex-col items-center justify-center h-48"
                        onClick={() => handleCreateAgent("security")}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-red-400" />
                          </div>
                          <span className="font-semibold">New Security Agent</span>
                          <Plus className="w-5 h-5 text-gray-400" />
                        </div>
                      </Card>
                      
                      <Card
                        className="p-4 border-gray-800 hover:border-green-500 cursor-pointer transition-colors flex flex-col items-center justify-center h-48"
                        onClick={() => handleCreateAgent("optimization")}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-green-400" />
                          </div>
                          <span className="font-semibold">New Optimization Agent</span>
                          <Plus className="w-5 h-5 text-gray-400" />
                        </div>
                      </Card>
                    </div>
                  </ScrollArea>
                </Card>

                {/* Agent Detail Panel */}
                <Card className="col-span-4 bg-gray-900/50 border-gray-800">
                  <div className="p-4 border-b border-gray-800">
                    <h3 className="text-lg font-semibold">Agent Details</h3>
                  </div>
                  <ScrollArea className="h-[calc(100%-60px)] p-4">
                    {selectedAgent ? (
                      <AgentDetail 
                        agent={selectedAgent} 
                        onUpdate={(updates) => handleAgentUpdate(selectedAgent.getId(), updates)}
                        onDelete={() => handleAgentDelete(selectedAgent.getId())}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <Bot className="w-12 h-12 mb-4" />
                        <p>Select an agent to view details</p>
                      </div>
                    )}
                  </ScrollArea>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="marketplace" className="m-0 h-full">
              <Marketplace onImportAgent={handleImportAgent} />
            </TabsContent>

            <TabsContent value="challenges" className="m-0 h-full">
              <div className="flex flex-col items-center justify-center h-full">
                <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Challenges Coming Soon</h3>
                <p className="text-gray-400 text-center max-w-md">
                  Complete coding challenges with your agents to earn experience and rewards.
                  Compete with other developers and level up your agents.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="m-0 h-full">
              <div className="flex flex-col items-center justify-center h-full">
                <BarChart className="w-16 h-16 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Statistics Coming Soon</h3>
                <p className="text-gray-400 text-center max-w-md">
                  Track your agents' performance, experience growth, and contribution to your projects.
                  Detailed analytics will help you optimize your AI team.
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default WarRoom; 