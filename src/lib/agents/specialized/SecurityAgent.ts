/**
 * SecurityAgent.ts
 * Specialized agent for security analysis and vulnerability detection
 */

import { BaseAgent, AgentConfig, AgentModule } from '../BaseAgent';

export interface SecurityVulnerability {
  id: string;
  file: string;
  line: number;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  remediation: string;
  cwe?: string; // Common Weakness Enumeration reference
  cvss?: number; // Common Vulnerability Scoring System (0-10)
}

export interface SecurityScanResult {
  vulnerabilities: SecurityVulnerability[];
  summary: {
    total: number;
    bySeverity: {
      low: number;
      medium: number;
      high: number;
      critical: number;
    };
    score: number; // 0-100, higher is more secure
  };
  scanTime: Date;
}

export class SecurityAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super(config);
  }

  public async scanCode(code: string, language: string, filename: string): Promise<SecurityScanResult> {
    // This is a placeholder for the actual AI-powered security scan
    // In a real implementation, this would call an AI service
    
    const activeModules = this.getActiveModules();
    const hasAdvancedScan = activeModules.some(
      module => module.capability === 'security_analysis' && module.level >= 3
    );
    
    // Simulate different scan quality based on agent level and modules
    const vulnerabilities = hasAdvancedScan 
      ? this.performAdvancedScan(code, language, filename)
      : this.performBasicScan(code, language, filename);
    
    // Count vulnerabilities by severity
    const bySeverity = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };
    
    vulnerabilities.forEach(vuln => {
      bySeverity[vuln.severity]++;
    });
    
    // Calculate security score (higher is better)
    const severityWeights = {
      low: 1,
      medium: 3,
      high: 5,
      critical: 10
    };
    
    const weightedIssues = 
      bySeverity.low * severityWeights.low +
      bySeverity.medium * severityWeights.medium +
      bySeverity.high * severityWeights.high +
      bySeverity.critical * severityWeights.critical;
    
    const score = Math.max(0, 100 - (weightedIssues * 2));
    
    return {
      vulnerabilities,
      summary: {
        total: vulnerabilities.length,
        bySeverity,
        score
      },
      scanTime: new Date()
    };
  }

  private performBasicScan(code: string, language: string, filename: string): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];
    const lines = code.split('\n');
    
    // Simple pattern matching for common security issues
    // This is just a simulation - a real implementation would use more sophisticated analysis
    
    // Check for SQL injection vulnerabilities in string concatenation
    if (language === 'javascript' || language === 'typescript') {
      const sqlInjectionPattern = /SELECT|INSERT|UPDATE|DELETE.*\+\s*[a-zA-Z]/i;
      for (let i = 0; i < lines.length; i++) {
        if (sqlInjectionPattern.test(lines[i])) {
          vulnerabilities.push({
            id: `sql-injection-${i}`,
            file: filename,
            line: i + 1,
            type: 'SQL Injection',
            severity: 'high',
            description: 'Possible SQL injection vulnerability detected in string concatenation',
            remediation: 'Use parameterized queries or prepared statements',
            cwe: 'CWE-89'
          });
        }
      }
    }
    
    // Add a random low severity issue based on agent level
    if (Math.random() > 0.5) {
      vulnerabilities.push({
        id: `random-issue-${Date.now()}`,
        file: filename,
        line: Math.floor(Math.random() * lines.length) + 1,
        type: 'Insecure Configuration',
        severity: 'low',
        description: 'Potentially insecure configuration detected',
        remediation: 'Review and update security settings',
        cwe: 'CWE-1004'
      });
    }
    
    return vulnerabilities;
  }

  private performAdvancedScan(code: string, language: string, filename: string): SecurityVulnerability[] {
    // Start with basic scan
    const vulnerabilities = this.performBasicScan(code, language, filename);
    const lines = code.split('\n');
    
    // Add more sophisticated checks
    
    // Check for hardcoded secrets
    const secretPattern = /password|secret|key|token|credential|api[_-]?key/i;
    const valuePattern = /['"][a-zA-Z0-9_\-\.]{8,}['"]/;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (secretPattern.test(line) && valuePattern.test(line)) {
        vulnerabilities.push({
          id: `hardcoded-secret-${i}`,
          file: filename,
          line: i + 1,
          type: 'Hardcoded Secret',
          severity: 'critical',
          description: 'Potential hardcoded secret or credential detected',
          remediation: 'Move secrets to environment variables or a secure vault',
          cwe: 'CWE-798',
          cvss: 9.1
        });
      }
    }
    
    // Check for XSS vulnerabilities in React (simplified example)
    if (language === 'typescript' || language === 'javascript') {
      const xssPattern = /dangerouslySetInnerHTML/;
      for (let i = 0; i < lines.length; i++) {
        if (xssPattern.test(lines[i])) {
          vulnerabilities.push({
            id: `xss-${i}`,
            file: filename,
            line: i + 1,
            type: 'Cross-Site Scripting (XSS)',
            severity: 'medium',
            description: 'Potential XSS vulnerability with dangerouslySetInnerHTML',
            remediation: 'Sanitize user input and avoid using dangerouslySetInnerHTML',
            cwe: 'CWE-79',
            cvss: 6.5
          });
        }
      }
    }
    
    return vulnerabilities;
  }

  // Factory method to create a new SecurityAgent with default modules
  public static createDefault(name: string, description: string): AgentConfig {
    const defaultModules: AgentModule[] = [
      {
        id: '1',
        name: 'Basic Vulnerability Scanner',
        description: 'Detects common security vulnerabilities',
        capability: 'security_analysis',
        level: 1,
        isActive: true
      },
      {
        id: '2',
        name: 'Secret Detector',
        description: 'Identifies hardcoded secrets and credentials',
        capability: 'security_analysis',
        level: 2,
        isActive: true
      },
      {
        id: '3',
        name: 'Advanced Threat Detection',
        description: 'Identifies sophisticated security threats and vulnerabilities',
        capability: 'security_analysis',
        level: 3,
        isActive: false
      },
      {
        id: '4',
        name: 'Compliance Checker',
        description: 'Verifies code against security compliance standards',
        capability: 'security_analysis',
        level: 4,
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