import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Bot, Code2, Shield, Zap, Star } from "lucide-react";
import { BaseAgent, AgentLevel } from "@/lib/agents/BaseAgent";

interface AgentCardProps {
  agent: BaseAgent;
  isSelected?: boolean;
  onClick?: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  isSelected = false,
  onClick,
}) => {
  const getAgentIcon = () => {
    const name = agent.getName().toLowerCase();
    
    if (name.includes("code") || name.includes("review")) {
      return <Code2 className="w-6 h-6 text-purple-400" />;
    } else if (name.includes("security") || name.includes("guardian")) {
      return <Shield className="w-6 h-6 text-red-400" />;
    } else if (name.includes("performance") || name.includes("optimi")) {
      return <Zap className="w-6 h-6 text-green-400" />;
    }
    
    return <Bot className="w-6 h-6 text-blue-400" />;
  };

  const getExperiencePercentage = () => {
    const level = agent.getLevel();
    const experience = agent.getExperience();
    
    // Define experience thresholds for each level
    const thresholds = [0, 100, 300, 600, 1000];
    
    // If max level, return 100%
    if (level >= 5) return 100;
    
    // Calculate current level progress
    const currentLevelExp = thresholds[level - 1];
    const nextLevelExp = thresholds[level];
    const levelProgress = experience - currentLevelExp;
    const levelTotal = nextLevelExp - currentLevelExp;
    
    return Math.floor((levelProgress / levelTotal) * 100);
  };

  const getActiveModulesCount = () => {
    return agent.getActiveModules().length;
  };

  const getTotalModulesCount = () => {
    return agent.getModules().length;
  };

  return (
    <Card
      className={`p-4 border-gray-800 hover:border-purple-500 cursor-pointer transition-colors ${
        isSelected ? "border-purple-500 bg-purple-500/10" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
          {getAgentIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold">{agent.getName()}</h3>
            <div className="flex items-center">
              <Badge variant="outline" className="bg-gray-800 text-xs">
                Lv. {agent.getLevel()}
              </Badge>
            </div>
          </div>
          
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
            {agent.getDescription()}
          </p>
          
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Experience</span>
              <span>{getExperiencePercentage()}%</span>
            </div>
            <Progress value={getExperiencePercentage()} className="h-1" />
          </div>
          
          <div className="flex justify-between mt-3">
            <div className="text-xs text-gray-400">
              <span>Modules: </span>
              <span className="text-white">{getActiveModulesCount()}/{getTotalModulesCount()}</span>
            </div>
            
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < agent.getLevel()
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AgentCard; 