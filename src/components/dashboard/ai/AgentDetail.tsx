import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Bot,
  Edit2,
  Save,
  Trash2,
  Star,
  Plus,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { BaseAgent, AgentModule } from "@/lib/agents/BaseAgent";

interface AgentDetailProps {
  agent: BaseAgent;
  onUpdate?: (updates: any) => void;
  onDelete?: () => void;
}

const AgentDetail: React.FC<AgentDetailProps> = ({
  agent,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(agent.getName());
  const [description, setDescription] = useState(agent.getDescription());
  const [modules, setModules] = useState<AgentModule[]>(agent.getModules());

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        name,
        description,
        modules,
      });
    }
    setIsEditing(false);
  };

  const handleModuleToggle = (moduleId: string, isActive: boolean) => {
    const updatedModules = modules.map((module) =>
      module.id === moduleId ? { ...module, isActive } : module
    );
    setModules(updatedModules);
    
    // If not in edit mode, save immediately
    if (!isEditing && onUpdate) {
      onUpdate({ modules: updatedModules });
    }
  };

  const getExperienceToNextLevel = () => {
    const level = agent.getLevel();
    const experience = agent.getExperience();
    
    // Define experience thresholds for each level
    const thresholds = [0, 100, 300, 600, 1000];
    
    // If max level, return 0
    if (level >= 5) return 0;
    
    // Calculate experience needed for next level
    const nextLevelExp = thresholds[level];
    return nextLevelExp - experience;
  };

  const getModuleStatusColor = (module: AgentModule) => {
    if (!module.isActive) return "text-gray-500";
    
    if (module.level > agent.getLevel()) {
      return "text-yellow-500";
    }
    
    return "text-green-500";
  };

  const getModuleStatusIcon = (module: AgentModule) => {
    if (!module.isActive) {
      return <Plus className="w-4 h-4 text-gray-500" />;
    }
    
    if (module.level > agent.getLevel()) {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
    
    return <Zap className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            <Bot className="w-5 h-5 text-blue-400" />
          </div>
          {isEditing ? (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          ) : (
            <h3 className="text-lg font-semibold">{agent.getName()}</h3>
          )}
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <Button
              size="sm"
              variant="outline"
              className="border-green-500 hover:bg-green-500/20"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="border-blue-500 hover:bg-blue-500/20"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="border-red-500 hover:bg-red-500/20"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      <div>
        {isEditing ? (
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-gray-800 border-gray-700 h-20"
          />
        ) : (
          <p className="text-sm text-gray-400">{agent.getDescription()}</p>
        )}
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <div className="flex items-center">
            <h4 className="font-semibold">Level {agent.getLevel()}</h4>
            <div className="flex ml-2">
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
          <span className="text-xs text-gray-400">
            {agent.getExperience()} XP
          </span>
        </div>
        <Progress value={agent.getExperience() / 10} className="h-1" />
        {agent.getLevel() < 5 && (
          <p className="text-xs text-gray-400 mt-1">
            {getExperienceToNextLevel()} XP to next level
          </p>
        )}
      </div>

      <Separator className="bg-gray-700" />

      <div>
        <h4 className="font-semibold mb-3">Modules</h4>
        <div className="space-y-3">
          {modules.map((module) => (
            <div
              key={module.id}
              className="flex items-center justify-between bg-gray-800 p-3 rounded-md"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {getModuleStatusIcon(module)}
                  <span className="font-medium">{module.name}</span>
                  {module.level > 1 && (
                    <span className="text-xs text-gray-400">
                      (Lv. {module.level})
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {module.description}
                </p>
                {module.level > agent.getLevel() && module.isActive && (
                  <p className="text-xs text-yellow-500 mt-1">
                    Agent level too low for full functionality
                  </p>
                )}
              </div>
              <Switch
                checked={module.isActive}
                onCheckedChange={(checked) =>
                  handleModuleToggle(module.id, checked)
                }
              />
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-gray-700" />

      <div>
        <h4 className="font-semibold mb-2">Agent Stats</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-800 p-2 rounded-md">
            <p className="text-gray-400">Created</p>
            <p>{agent.toJSON().createdAt.toLocaleDateString()}</p>
          </div>
          <div className="bg-gray-800 p-2 rounded-md">
            <p className="text-gray-400">Last Updated</p>
            <p>{agent.toJSON().updatedAt.toLocaleDateString()}</p>
          </div>
          <div className="bg-gray-800 p-2 rounded-md">
            <p className="text-gray-400">Active Modules</p>
            <p>{agent.getActiveModules().length}</p>
          </div>
          <div className="bg-gray-800 p-2 rounded-md">
            <p className="text-gray-400">Total Modules</p>
            <p>{agent.getModules().length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetail; 