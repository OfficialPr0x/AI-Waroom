/**
 * BaseAgent.ts
 * Base class for all AI agents in the War Room
 */

export type AgentCapability = 
  | 'code_review'
  | 'security_analysis'
  | 'optimization'
  | 'documentation'
  | 'testing'
  | 'refactoring'
  | 'debugging';

export type AgentLevel = 1 | 2 | 3 | 4 | 5;

export interface AgentModule {
  id: string;
  name: string;
  description: string;
  capability: AgentCapability;
  level: number;
  isActive: boolean;
}

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  level: AgentLevel;
  experience: number;
  modules: AgentModule[];
  createdAt: Date;
  updatedAt: Date;
}

export class BaseAgent {
  protected config: AgentConfig;
  
  constructor(config: AgentConfig) {
    this.config = config;
  }

  public getId(): string {
    return this.config.id;
  }

  public getName(): string {
    return this.config.name;
  }

  public getDescription(): string {
    return this.config.description;
  }

  public getLevel(): AgentLevel {
    return this.config.level;
  }

  public getExperience(): number {
    return this.config.experience;
  }

  public getModules(): AgentModule[] {
    return this.config.modules;
  }

  public getActiveModules(): AgentModule[] {
    return this.config.modules.filter(module => module.isActive);
  }

  public addExperience(amount: number): void {
    this.config.experience += amount;
    this.checkLevelUp();
    this.config.updatedAt = new Date();
  }

  protected checkLevelUp(): void {
    const experienceThresholds = [0, 100, 300, 600, 1000];
    const currentLevel = this.config.level;
    const nextLevel = currentLevel + 1 as AgentLevel;
    
    if (nextLevel <= 5 && this.config.experience >= experienceThresholds[nextLevel - 1]) {
      this.config.level = nextLevel;
    }
  }

  public activateModule(moduleId: string): boolean {
    const module = this.config.modules.find(m => m.id === moduleId);
    if (module) {
      module.isActive = true;
      this.config.updatedAt = new Date();
      return true;
    }
    return false;
  }

  public deactivateModule(moduleId: string): boolean {
    const module = this.config.modules.find(m => m.id === moduleId);
    if (module) {
      module.isActive = false;
      this.config.updatedAt = new Date();
      return true;
    }
    return false;
  }

  public toJSON(): AgentConfig {
    return { ...this.config };
  }
} 