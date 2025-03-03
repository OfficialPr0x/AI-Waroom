/**
 * OptimizationAgent.ts
 * Specialized agent for code optimization and performance improvement
 */

import { BaseAgent, AgentConfig, AgentModule } from '../BaseAgent';

export interface OptimizationIssue {
  id: string;
  file: string;
  line: number;
  type: 'performance' | 'memory' | 'network' | 'rendering' | 'other';
  impact: 'low' | 'medium' | 'high';
  description: string;
  suggestion: string;
  estimatedImprovement?: string; // e.g., "~30% faster execution"
}

export interface OptimizationResult {
  issues: OptimizationIssue[];
  summary: {
    total: number;
    byImpact: {
      low: number;
      medium: number;
      high: number;
    };
    byType: {
      performance: number;
      memory: number;
      network: number;
      rendering: number;
      other: number;
    };
    score: number; // 0-100, higher is better optimized
  };
  optimizedCode?: string; // Optional optimized version of the code
}

export class OptimizationAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super(config);
  }

  public async analyzeCode(code: string, language: string, filename: string): Promise<OptimizationResult> {
    // This is a placeholder for the actual AI-powered optimization analysis
    // In a real implementation, this would call an AI service
    
    const activeModules = this.getActiveModules();
    const hasAdvancedOptimization = activeModules.some(
      module => module.capability === 'optimization' && module.level >= 3
    );
    
    // Simulate different optimization quality based on agent level and modules
    const issues = hasAdvancedOptimization 
      ? this.performAdvancedOptimization(code, language, filename)
      : this.performBasicOptimization(code, language, filename);
    
    // Count issues by impact and type
    const byImpact = {
      low: 0,
      medium: 0,
      high: 0
    };
    
    const byType = {
      performance: 0,
      memory: 0,
      network: 0,
      rendering: 0,
      other: 0
    };
    
    issues.forEach(issue => {
      byImpact[issue.impact]++;
      byType[issue.type]++;
    });
    
    // Calculate optimization score (higher is better)
    const impactWeights = {
      low: 1,
      medium: 3,
      high: 5
    };
    
    const weightedIssues = 
      byImpact.low * impactWeights.low +
      byImpact.medium * impactWeights.medium +
      byImpact.high * impactWeights.high;
    
    // Base score starts high and decreases with issues
    const score = Math.max(0, 100 - (weightedIssues * 3));
    
    // Generate optimized code if agent level is high enough
    let optimizedCode: string | undefined;
    if (this.getLevel() >= 3 && issues.length > 0) {
      optimizedCode = this.generateOptimizedCode(code, issues);
    }
    
    return {
      issues,
      summary: {
        total: issues.length,
        byImpact,
        byType,
        score
      },
      optimizedCode
    };
  }

  private performBasicOptimization(code: string, language: string, filename: string): OptimizationIssue[] {
    const issues: OptimizationIssue[] = [];
    const lines = code.split('\n');
    
    // Simple pattern matching for common optimization issues
    // This is just a simulation - a real implementation would use more sophisticated analysis
    
    // Check for nested loops (potential O(n²) complexity)
    if (language === 'javascript' || language === 'typescript') {
      let inLoop = false;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/for\s*\(/.test(line) || /while\s*\(/.test(line)) {
          if (inLoop) {
            issues.push({
              id: `nested-loop-${i}`,
              file: filename,
              line: i + 1,
              type: 'performance',
              impact: 'medium',
              description: 'Nested loop detected, potential O(n²) time complexity',
              suggestion: 'Consider restructuring to avoid nested loops or use a more efficient algorithm'
            });
          }
          inLoop = true;
        }
        if (/}/.test(line) && inLoop) {
          inLoop = false;
        }
      }
    }
    
    // Check for large array operations
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/\.map\(|\.filter\(|\.reduce\(/.test(line)) {
        issues.push({
          id: `array-operation-${i}`,
          file: filename,
          line: i + 1,
          type: 'performance',
          impact: 'low',
          description: 'Array operation that may be inefficient for large datasets',
          suggestion: 'For large arrays, consider using a for loop or optimizing the callback function'
        });
      }
    }
    
    return issues;
  }

  private performAdvancedOptimization(code: string, language: string, filename: string): OptimizationIssue[] {
    // Start with basic optimization
    const issues = this.performBasicOptimization(code, language, filename);
    const lines = code.split('\n');
    
    // Add more sophisticated checks
    
    // Check for memory leaks in event listeners (simplified example)
    if (language === 'javascript' || language === 'typescript') {
      let addListenerCount = 0;
      let removeListenerCount = 0;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/addEventListener|on\w+\s*=/.test(line)) {
          addListenerCount++;
        }
        if (/removeEventListener/.test(line)) {
          removeListenerCount++;
        }
      }
      
      if (addListenerCount > removeListenerCount) {
        issues.push({
          id: `event-listener-leak-${Date.now()}`,
          file: filename,
          line: 1, // General issue, not line-specific
          type: 'memory',
          impact: 'high',
          description: 'Potential memory leak: more event listeners added than removed',
          suggestion: 'Ensure all event listeners are properly removed when components unmount',
          estimatedImprovement: 'Prevents memory growth over time'
        });
      }
    }
    
    // Check for React-specific optimization issues
    if (language === 'typescript' || language === 'javascript') {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check for missing React.memo or useMemo
        if (/function\s+\w+Component/.test(line) && !code.includes('React.memo') && !code.includes('useMemo')) {
          issues.push({
            id: `missing-memo-${i}`,
            file: filename,
            line: i + 1,
            type: 'rendering',
            impact: 'medium',
            description: 'Component may re-render unnecessarily',
            suggestion: 'Use React.memo() for functional components or useMemo() for expensive calculations',
            estimatedImprovement: 'Can reduce unnecessary renders by 30-50%'
          });
        }
        
        // Check for inline object creation in render
        if (/style=\{{/.test(line) || /props=\{{/.test(line)) {
          issues.push({
            id: `inline-object-${i}`,
            file: filename,
            line: i + 1,
            type: 'rendering',
            impact: 'low',
            description: 'Inline object creation in render method',
            suggestion: 'Move object creation outside the render function or memoize it',
            estimatedImprovement: 'Small performance improvement on frequent re-renders'
          });
        }
      }
    }
    
    return issues;
  }

  private generateOptimizedCode(code: string, issues: OptimizationIssue[]): string {
    // This is a simplified simulation of code optimization
    // In a real implementation, this would use more sophisticated techniques
    
    let optimizedCode = code;
    const lines = code.split('\n');
    
    // Sort issues by line number in descending order to avoid offset issues when modifying the code
    const sortedIssues = [...issues].sort((a, b) => b.line - a.line);
    
    for (const issue of sortedIssues) {
      if (issue.line > 0 && issue.line <= lines.length) {
        const lineIndex = issue.line - 1;
        
        // Simple optimization examples based on issue type
        switch (issue.type) {
          case 'performance':
            if (issue.id.includes('nested-loop')) {
              // Add a comment suggesting optimization
              lines[lineIndex] = `${lines[lineIndex]} // TODO: Optimize nested loop`;
            } else if (issue.id.includes('array-operation')) {
              // Replace array method with for loop comment
              if (lines[lineIndex].includes('.map(')) {
                lines[lineIndex] += ' // Consider using for loop for better performance';
              }
            }
            break;
            
          case 'memory':
            if (issue.id.includes('event-listener-leak')) {
              // Add cleanup comment
              lines[lineIndex] += ' // TODO: Add removeEventListener in cleanup function';
            }
            break;
            
          case 'rendering':
            if (issue.id.includes('missing-memo')) {
              // Add React.memo suggestion
              lines[lineIndex] = `// Consider wrapping with React.memo:\n${lines[lineIndex]}`;
            } else if (issue.id.includes('inline-object')) {
              // Add comment about memoization
              lines[lineIndex] += ' // Move object declaration outside render or use useMemo';
            }
            break;
        }
      }
    }
    
    optimizedCode = lines.join('\n');
    return optimizedCode;
  }

  // Factory method to create a new OptimizationAgent with default modules
  public static createDefault(name: string, description: string): AgentConfig {
    const defaultModules: AgentModule[] = [
      {
        id: '1',
        name: 'Basic Performance Analyzer',
        description: 'Identifies common performance bottlenecks',
        capability: 'optimization',
        level: 1,
        isActive: true
      },
      {
        id: '2',
        name: 'Memory Usage Optimizer',
        description: 'Detects memory leaks and excessive memory usage',
        capability: 'optimization',
        level: 2,
        isActive: true
      },
      {
        id: '3',
        name: 'Advanced Algorithm Optimizer',
        description: 'Suggests algorithm improvements for better time complexity',
        capability: 'optimization',
        level: 3,
        isActive: false
      },
      {
        id: '4',
        name: 'Framework-Specific Optimizer',
        description: 'Provides optimization techniques specific to frameworks like React',
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