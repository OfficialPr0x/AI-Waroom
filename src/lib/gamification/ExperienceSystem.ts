/**
 * ExperienceSystem.ts
 * Manages experience points and leveling for AI agents
 */

import { BaseAgent } from '../agents/BaseAgent';
import { AgentManager } from '../agents/AgentManager';

export interface ExperienceEvent {
  id: string;
  agentId: string;
  type: 'code_review' | 'security_scan' | 'optimization' | 'challenge' | 'contribution';
  amount: number;
  timestamp: Date;
  details?: string;
}

export class ExperienceSystem {
  private static instance: ExperienceSystem;
  private events: ExperienceEvent[] = [];
  private agentManager: AgentManager;

  private constructor() {
    this.agentManager = AgentManager.getInstance();
    this.loadEvents();
  }

  public static getInstance(): ExperienceSystem {
    if (!ExperienceSystem.instance) {
      ExperienceSystem.instance = new ExperienceSystem();
    }
    return ExperienceSystem.instance;
  }

  public addExperience(agentId: string, type: ExperienceEvent['type'], amount: number, details?: string): boolean {
    const agent = this.agentManager.getAgent(agentId);
    if (!agent) {
      return false;
    }

    // Create an experience event
    const event: ExperienceEvent = {
      id: `exp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      agentId,
      type,
      amount,
      timestamp: new Date(),
      details
    };

    // Add experience to the agent
    agent.addExperience(amount);
    
    // Save the agent
    this.agentManager.updateAgent(agentId, {});
    this.agentManager.saveAgents();

    // Save the event
    this.events.push(event);
    this.saveEvents();

    return true;
  }

  public getAgentEvents(agentId: string): ExperienceEvent[] {
    return this.events.filter(event => event.agentId === agentId);
  }

  public getAllEvents(): ExperienceEvent[] {
    return [...this.events];
  }

  public getExperienceForLevel(level: number): number {
    const experienceThresholds = [0, 100, 300, 600, 1000];
    return level <= 5 ? experienceThresholds[level - 1] : Infinity;
  }

  public getExperienceToNextLevel(agent: BaseAgent): number {
    const level = agent.getLevel();
    const experience = agent.getExperience();
    
    // If max level, return 0
    if (level >= 5) return 0;
    
    // Calculate experience needed for next level
    const nextLevelExp = this.getExperienceForLevel(level + 1);
    return nextLevelExp - experience;
  }

  public getLevelProgress(agent: BaseAgent): number {
    const level = agent.getLevel();
    const experience = agent.getExperience();
    
    // If max level, return 100%
    if (level >= 5) return 100;
    
    // Calculate current level progress
    const currentLevelExp = this.getExperienceForLevel(level);
    const nextLevelExp = this.getExperienceForLevel(level + 1);
    const levelProgress = experience - currentLevelExp;
    const levelTotal = nextLevelExp - currentLevelExp;
    
    return Math.floor((levelProgress / levelTotal) * 100);
  }

  private saveEvents(): void {
    localStorage.setItem('ai-warroom-experience-events', JSON.stringify(this.events));
  }

  private loadEvents(): void {
    const eventsData = localStorage.getItem('ai-warroom-experience-events');
    if (eventsData) {
      try {
        const parsedEvents: ExperienceEvent[] = JSON.parse(eventsData);
        this.events = parsedEvents.map(event => ({
          ...event,
          timestamp: new Date(event.timestamp)
        }));
      } catch (error) {
        console.error('Failed to load experience events:', error);
        this.events = [];
      }
    }
  }
} 