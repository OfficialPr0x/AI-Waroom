/**
 * CodeReviewAgent.ts
 * Specialized agent for code review tasks
 */

import { BaseAgent, AgentConfig, AgentModule } from '../BaseAgent';

export interface CodeReviewResult {
  file: string;
  issues: Array<{
    line: number;
    severity: 'info' | 'warning' | 'error';
    message: string;
    suggestion?: string;
  }>;
  summary: string;
  score: number; // 0-100
}

export class CodeReviewAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super(config);
  }

  public async reviewCode(code: string, language: string): Promise<CodeReviewResult> {
    // This is a placeholder for the actual AI-powered code review
    // In a real implementation, this would call an AI service
    
    const activeModules = this.getActiveModules();
    const hasAdvancedReview = activeModules.some(
      module => module.capability === 'code_review' && module.level >= 3
    );
    
    // Simulate different review quality based on agent level and modules
    const mockIssues = hasAdvancedReview 
      ? this.generateAdvancedReview(code, language)
      : this.generateBasicReview(code, language);
    
    return {
      file: 'example.ts',
      issues: mockIssues,
      summary: `Found ${mockIssues.length} issues in the code.`,
      score: Math.max(0, 100 - (mockIssues.length * 5))
    };
  }

  private generateBasicReview(code: string, language: string) {
    // Simple mock review that counts lines and generates basic issues
    const lines = code.split('\n');
    const issues = [];
    
    // Generate some mock issues based on code length
    if (lines.length > 50) {
      issues.push({
        line: Math.floor(Math.random() * lines.length),
        severity: 'warning' as const,
        message: 'Function is too long, consider breaking it down',
      });
    }
    
    // Add a random number of issues based on agent level
    const numberOfIssues = Math.max(1, 5 - this.getLevel());
    for (let i = 0; i < numberOfIssues; i++) {
      issues.push({
        line: Math.floor(Math.random() * lines.length),
        severity: Math.random() > 0.7 ? 'error' as const : 'warning' as const,
        message: 'Potential issue detected',
        suggestion: 'Consider refactoring this section'
      });
    }
    
    return issues;
  }

  private generateAdvancedReview(code: string, language: string) {
    // More sophisticated mock review
    const issues = this.generateBasicReview(code, language);
    
    // Add more detailed issues
    issues.push({
      line: Math.floor(Math.random() * code.split('\n').length),
      severity: 'info',
      message: 'Consider adding more descriptive variable names',
      suggestion: 'Use semantic naming to improve code readability'
    });
    
    // Add performance suggestions if the agent has optimization capability
    const hasOptimization = this.getActiveModules().some(
      module => module.capability === 'optimization'
    );
    
    if (hasOptimization) {
      issues.push({
        line: Math.floor(Math.random() * code.split('\n').length),
        severity: 'info',
        message: 'This operation could be optimized',
        suggestion: 'Consider using a more efficient algorithm here'
      });
    }
    
    return issues;
  }

  // Factory method to create a new CodeReviewAgent with default modules
  public static createDefault(name: string, description: string): AgentConfig {
    const defaultModules: AgentModule[] = [
      {
        id: '1',
        name: 'Basic Code Review',
        description: 'Identifies common code issues and style problems',
        capability: 'code_review',
        level: 1,
        isActive: true
      },
      {
        id: '2',
        name: 'Style Checker',
        description: 'Ensures code follows style guidelines',
        capability: 'code_review',
        level: 1,
        isActive: true
      },
      {
        id: '3',
        name: 'Advanced Pattern Recognition',
        description: 'Identifies complex code patterns and anti-patterns',
        capability: 'code_review',
        level: 3,
        isActive: false
      },
      {
        id: '4',
        name: 'Performance Analysis',
        description: 'Identifies performance bottlenecks',
        capability: 'optimization',
        level: 2,
        isActive: false
      }
    ];
    
    return {
      id: '',  // Will be set by AgentManager
      name,
      description,
      level: 1,
      experience: 0,
      modules: defaultModules,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
} 