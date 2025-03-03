/**
 * AgentManager.ts
 * Manages and orchestrates AI agents in the War Room
 */

import { BaseAgent, AgentConfig } from './BaseAgent';
import { v4 as uuidv4 } from 'uuid';

export class AgentManager {
  private agents: Map<string, BaseAgent>;
  private static instance: AgentManager;

  private constructor() {
    this.agents = new Map<string, BaseAgent>();
  }

  public static getInstance(): AgentManager {
    if (!AgentManager.instance) {
      AgentManager.instance = new AgentManager();
    }
    return AgentManager.instance;
  }

  public createAgent(config: Omit<AgentConfig, 'id' | 'createdAt' | 'updatedAt'>): BaseAgent {
    const now = new Date();
    const agentConfig: AgentConfig = {
      ...config,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    
    const agent = new BaseAgent(agentConfig);
    this.agents.set(agent.getId(), agent);
    return agent;
  }

  public getAgent(id: string): BaseAgent | undefined {
    return this.agents.get(id);
  }

  public getAllAgents(): BaseAgent[] {
    return Array.from(this.agents.values());
  }

  public updateAgent(id: string, updates: Partial<Omit<AgentConfig, 'id' | 'createdAt' | 'updatedAt'>>): boolean {
    const agent = this.agents.get(id);
    if (!agent) return false;

    const currentConfig = agent.toJSON();
    const updatedConfig: AgentConfig = {
      ...currentConfig,
      ...updates,
      updatedAt: new Date()
    };

    this.agents.set(id, new BaseAgent(updatedConfig));
    return true;
  }

  public deleteAgent(id: string): boolean {
    return this.agents.delete(id);
  }

  public saveAgents(): void {
    const agentsData = Array.from(this.agents.values()).map(agent => agent.toJSON());
    localStorage.setItem('ai-warroom-agents', JSON.stringify(agentsData));
  }

  public loadAgents(): void {
    const agentsData = localStorage.getItem('ai-warroom-agents');
    if (agentsData) {
      const parsedData: AgentConfig[] = JSON.parse(agentsData);
      parsedData.forEach(config => {
        // Convert string dates back to Date objects
        config.createdAt = new Date(config.createdAt);
        config.updatedAt = new Date(config.updatedAt);
        
        const agent = new BaseAgent(config);
        this.agents.set(agent.getId(), agent);
      });
    }
  }
} 