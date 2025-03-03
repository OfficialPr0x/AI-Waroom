/**
 * Challenges.ts
 * Manages coding challenges and rewards for AI agents
 */

import { BaseAgent, AgentCapability } from '../agents/BaseAgent';
import { ExperienceSystem } from './ExperienceSystem';

export type ChallengeType = 'code_review' | 'security' | 'optimization' | 'refactoring' | 'debugging';
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  difficulty: ChallengeDifficulty;
  experienceReward: number;
  requirements: {
    minAgentLevel?: number;
    requiredCapabilities?: AgentCapability[];
  };
  code?: string;
  testCases?: Array<{
    input: string;
    expectedOutput: string;
  }>;
  completedBy: string[]; // Array of agent IDs that completed this challenge
  createdAt: Date;
}

export interface ChallengeAttempt {
  id: string;
  challengeId: string;
  agentId: string;
  successful: boolean;
  timestamp: Date;
  solution?: string;
  feedback?: string;
}

export class ChallengeSystem {
  private static instance: ChallengeSystem;
  private challenges: Challenge[] = [];
  private attempts: ChallengeAttempt[] = [];
  private experienceSystem: ExperienceSystem;

  private constructor() {
    this.experienceSystem = ExperienceSystem.getInstance();
    this.loadChallenges();
    this.loadAttempts();
    
    // Initialize with default challenges if none exist
    if (this.challenges.length === 0) {
      this.initializeDefaultChallenges();
    }
  }

  public static getInstance(): ChallengeSystem {
    if (!ChallengeSystem.instance) {
      ChallengeSystem.instance = new ChallengeSystem();
    }
    return ChallengeSystem.instance;
  }

  public getAllChallenges(): Challenge[] {
    return [...this.challenges];
  }

  public getChallengeById(id: string): Challenge | undefined {
    return this.challenges.find(challenge => challenge.id === id);
  }

  public getAvailableChallengesForAgent(agent: BaseAgent): Challenge[] {
    const agentLevel = agent.getLevel();
    const agentCapabilities = agent.getActiveModules().map(module => module.capability);
    
    return this.challenges.filter(challenge => {
      // Check if agent meets level requirement
      if (challenge.requirements.minAgentLevel && agentLevel < challenge.requirements.minAgentLevel) {
        return false;
      }
      
      // Check if agent has required capabilities
      if (challenge.requirements.requiredCapabilities && challenge.requirements.requiredCapabilities.length > 0) {
        const hasRequiredCapabilities = challenge.requirements.requiredCapabilities.every(
          capability => agentCapabilities.includes(capability)
        );
        if (!hasRequiredCapabilities) {
          return false;
        }
      }
      
      // Check if agent has already completed this challenge
      if (challenge.completedBy.includes(agent.getId())) {
        return false;
      }
      
      return true;
    });
  }

  public getCompletedChallengesForAgent(agent: BaseAgent): Challenge[] {
    return this.challenges.filter(challenge => 
      challenge.completedBy.includes(agent.getId())
    );
  }

  public getAttemptsByAgent(agentId: string): ChallengeAttempt[] {
    return this.attempts.filter(attempt => attempt.agentId === agentId);
  }

  public getAttemptsByChallenge(challengeId: string): ChallengeAttempt[] {
    return this.attempts.filter(attempt => attempt.challengeId === challengeId);
  }

  public async attemptChallenge(
    agent: BaseAgent, 
    challengeId: string, 
    solution: string
  ): Promise<ChallengeAttempt> {
    const challenge = this.getChallengeById(challengeId);
    if (!challenge) {
      throw new Error(`Challenge with ID ${challengeId} not found`);
    }
    
    // In a real implementation, this would evaluate the solution against test cases
    // For now, we'll simulate a success with 80% probability
    const successful = Math.random() < 0.8;
    
    const attempt: ChallengeAttempt = {
      id: `attempt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      challengeId,
      agentId: agent.getId(),
      successful,
      timestamp: new Date(),
      solution,
      feedback: successful 
        ? 'Great job! Your solution passed all test cases.' 
        : 'Your solution failed some test cases. Try again.'
    };
    
    this.attempts.push(attempt);
    this.saveAttempts();
    
    if (successful) {
      // Mark challenge as completed by this agent
      if (!challenge.completedBy.includes(agent.getId())) {
        challenge.completedBy.push(agent.getId());
        this.saveChallenges();
        
        // Award experience points
        this.experienceSystem.addExperience(
          agent.getId(),
          'challenge',
          challenge.experienceReward,
          `Completed challenge: ${challenge.title}`
        );
      }
    }
    
    return attempt;
  }

  public createChallenge(challenge: Omit<Challenge, 'id' | 'completedBy' | 'createdAt'>): Challenge {
    const newChallenge: Challenge = {
      ...challenge,
      id: `challenge-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      completedBy: [],
      createdAt: new Date()
    };
    
    this.challenges.push(newChallenge);
    this.saveChallenges();
    
    return newChallenge;
  }

  private initializeDefaultChallenges(): void {
    const defaultChallenges: Omit<Challenge, 'id' | 'completedBy' | 'createdAt'>[] = [
      {
        title: 'Find and Fix Security Vulnerabilities',
        description: 'Identify and fix security vulnerabilities in the provided code snippet.',
        type: 'security',
        difficulty: 'medium',
        experienceReward: 50,
        requirements: {
          minAgentLevel: 1,
          requiredCapabilities: ['security_analysis'] as AgentCapability[]
        },
        code: `
function login(username, password) {
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  return db.execute(query);
}
        `
      },
      {
        title: 'Optimize Algorithm Performance',
        description: 'Improve the performance of this inefficient algorithm.',
        type: 'optimization',
        difficulty: 'hard',
        experienceReward: 75,
        requirements: {
          minAgentLevel: 2,
          requiredCapabilities: ['optimization'] as AgentCapability[]
        },
        code: `
function findDuplicates(array) {
  const duplicates = [];
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length; j++) {
      if (i !== j && array[i] === array[j] && !duplicates.includes(array[i])) {
        duplicates.push(array[i]);
      }
    }
  }
  return duplicates;
}
        `
      },
      {
        title: 'Code Review Challenge',
        description: 'Review this code and identify all issues and potential improvements.',
        type: 'code_review',
        difficulty: 'easy',
        experienceReward: 30,
        requirements: {
          minAgentLevel: 1,
          requiredCapabilities: ['code_review'] as AgentCapability[]
        },
        code: `
class UserManager {
  constructor() {
    this.users = [];
  }
  
  addUser(user) {
    this.users.push(user);
  }
  
  findUser(name) {
    for (var i = 0; i < this.users.length; i++) {
      var user = this.users[i];
      if (user.name == name) return user;
    }
  }
  
  deleteUser(name) {
    var userIndex = -1;
    for (var i = 0; i < this.users.length; i++) {
      var user = this.users[i];
      if (user.name == name) userIndex = i;
    }
    if (userIndex != -1) this.users.splice(userIndex, 1);
  }
}
        `
      }
    ];
    
    defaultChallenges.forEach(challenge => this.createChallenge(challenge));
  }

  private saveChallenges(): void {
    localStorage.setItem('ai-warroom-challenges', JSON.stringify(this.challenges));
  }

  private loadChallenges(): void {
    const challengesData = localStorage.getItem('ai-warroom-challenges');
    if (challengesData) {
      try {
        const parsedChallenges: Challenge[] = JSON.parse(challengesData);
        this.challenges = parsedChallenges.map(challenge => ({
          ...challenge,
          createdAt: new Date(challenge.createdAt)
        }));
      } catch (error) {
        console.error('Failed to load challenges:', error);
        this.challenges = [];
      }
    }
  }

  private saveAttempts(): void {
    localStorage.setItem('ai-warroom-challenge-attempts', JSON.stringify(this.attempts));
  }

  private loadAttempts(): void {
    const attemptsData = localStorage.getItem('ai-warroom-challenge-attempts');
    if (attemptsData) {
      try {
        const parsedAttempts: ChallengeAttempt[] = JSON.parse(attemptsData);
        this.attempts = parsedAttempts.map(attempt => ({
          ...attempt,
          timestamp: new Date(attempt.timestamp)
        }));
      } catch (error) {
        console.error('Failed to load challenge attempts:', error);
        this.attempts = [];
      }
    }
  }
} 