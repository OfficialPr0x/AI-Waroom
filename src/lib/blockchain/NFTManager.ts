/**
 * NFTManager.ts
 * Manages NFT interactions for AI agents
 */

import { BaseAgent } from '../agents/BaseAgent';

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  agentData: any; // Serialized agent data
}

export interface NFTInfo {
  tokenId: string;
  contractAddress: string;
  owner: string;
  metadata: NFTMetadata;
  createdAt: Date;
  lastTransferredAt: Date;
}

export class NFTManager {
  private static instance: NFTManager;
  private isWalletConnected: boolean = false;
  private walletAddress: string = '';
  private mockNFTs: NFTInfo[] = [];

  private constructor() {
    // Initialize with mock data
    this.initializeMockData();
  }

  public static getInstance(): NFTManager {
    if (!NFTManager.instance) {
      NFTManager.instance = new NFTManager();
    }
    return NFTManager.instance;
  }

  private initializeMockData(): void {
    // Create some mock NFTs for demonstration
    this.mockNFTs = [
      {
        tokenId: '1',
        contractAddress: '0x1234567890123456789012345678901234567890',
        owner: '0xabcdef1234567890abcdef1234567890abcdef12',
        metadata: {
          name: 'Elite Code Reviewer',
          description: 'A high-level code review agent with advanced capabilities',
          image: 'https://example.com/nft-images/code-reviewer.png',
          attributes: [
            { trait_type: 'Level', value: 4 },
            { trait_type: 'Type', value: 'Code Review' },
            { trait_type: 'Rarity', value: 'Rare' },
            { trait_type: 'Modules', value: 8 }
          ],
          agentData: {
            // Serialized agent data would go here
            id: 'mock-agent-1',
            level: 4,
            experience: 750,
            modules: [
              {
                id: '1',
                name: 'Advanced Pattern Recognition',
                capability: 'code_review',
                level: 4,
                isActive: true
              }
            ]
          }
        },
        createdAt: new Date('2023-01-15'),
        lastTransferredAt: new Date('2023-03-22')
      },
      {
        tokenId: '2',
        contractAddress: '0x1234567890123456789012345678901234567890',
        owner: '0xabcdef1234567890abcdef1234567890abcdef12',
        metadata: {
          name: 'Security Guardian Elite',
          description: 'A specialized security agent with vulnerability detection',
          image: 'https://example.com/nft-images/security-guardian.png',
          attributes: [
            { trait_type: 'Level', value: 3 },
            { trait_type: 'Type', value: 'Security' },
            { trait_type: 'Rarity', value: 'Epic' },
            { trait_type: 'Modules', value: 6 }
          ],
          agentData: {
            // Serialized agent data would go here
            id: 'mock-agent-2',
            level: 3,
            experience: 450,
            modules: [
              {
                id: '1',
                name: 'Vulnerability Scanner',
                capability: 'security_analysis',
                level: 3,
                isActive: true
              }
            ]
          }
        },
        createdAt: new Date('2023-02-10'),
        lastTransferredAt: new Date('2023-04-05')
      }
    ];
  }

  public async connectWallet(): Promise<boolean> {
    // In a real implementation, this would connect to MetaMask or another wallet
    // For now, we'll simulate a successful connection
    this.isWalletConnected = true;
    this.walletAddress = '0xabcdef1234567890abcdef1234567890abcdef12';
    return true;
  }

  public async disconnectWallet(): Promise<boolean> {
    this.isWalletConnected = false;
    this.walletAddress = '';
    return true;
  }

  public isConnected(): boolean {
    return this.isWalletConnected;
  }

  public getWalletAddress(): string {
    return this.walletAddress;
  }

  public async mintAgentNFT(agent: BaseAgent): Promise<NFTInfo | null> {
    if (!this.isWalletConnected) {
      throw new Error('Wallet not connected');
    }

    // In a real implementation, this would interact with a smart contract
    // For now, we'll create a mock NFT
    const tokenId = (this.mockNFTs.length + 1).toString();
    const now = new Date();
    
    const nftMetadata: NFTMetadata = {
      name: agent.getName(),
      description: agent.getDescription(),
      image: `https://example.com/nft-images/agent-${tokenId}.png`,
      attributes: [
        { trait_type: 'Level', value: agent.getLevel() },
        { trait_type: 'Type', value: this.getAgentType(agent) },
        { trait_type: 'Rarity', value: this.calculateRarity(agent) },
        { trait_type: 'Modules', value: agent.getModules().length }
      ],
      agentData: agent.toJSON()
    };
    
    const nftInfo: NFTInfo = {
      tokenId,
      contractAddress: '0x1234567890123456789012345678901234567890',
      owner: this.walletAddress,
      metadata: nftMetadata,
      createdAt: now,
      lastTransferredAt: now
    };
    
    this.mockNFTs.push(nftInfo);
    return nftInfo;
  }

  public async getOwnedNFTs(): Promise<NFTInfo[]> {
    if (!this.isWalletConnected) {
      throw new Error('Wallet not connected');
    }
    
    // In a real implementation, this would query the blockchain
    // For now, we'll return our mock NFTs
    return this.mockNFTs.filter(nft => nft.owner === this.walletAddress);
  }

  public async importAgentFromNFT(tokenId: string): Promise<BaseAgent | null> {
    if (!this.isWalletConnected) {
      throw new Error('Wallet not connected');
    }
    
    // Find the NFT in our mock data
    const nft = this.mockNFTs.find(nft => nft.tokenId === tokenId);
    if (!nft || nft.owner !== this.walletAddress) {
      return null;
    }
    
    // In a real implementation, we would verify ownership on the blockchain
    // For now, we'll just create an agent from the NFT metadata
    const agentData = nft.metadata.agentData;
    
    // Convert dates from strings back to Date objects
    agentData.createdAt = new Date(agentData.createdAt);
    agentData.updatedAt = new Date(agentData.updatedAt);
    
    return new BaseAgent(agentData);
  }

  private getAgentType(agent: BaseAgent): string {
    // Determine agent type based on name or capabilities
    const name = agent.getName().toLowerCase();
    
    if (name.includes('code') || name.includes('review')) {
      return 'Code Review';
    } else if (name.includes('security') || name.includes('guardian')) {
      return 'Security';
    } else if (name.includes('performance') || name.includes('optimi')) {
      return 'Optimization';
    }
    
    return 'General';
  }

  private calculateRarity(agent: BaseAgent): string {
    // Calculate rarity based on level and modules
    const level = agent.getLevel();
    const moduleCount = agent.getModules().length;
    const activeModuleCount = agent.getActiveModules().length;
    
    if (level >= 4 && moduleCount >= 6) {
      return 'Legendary';
    } else if (level >= 3 && moduleCount >= 5) {
      return 'Epic';
    } else if (level >= 2 && moduleCount >= 4) {
      return 'Rare';
    }
    
    return 'Common';
  }
} 