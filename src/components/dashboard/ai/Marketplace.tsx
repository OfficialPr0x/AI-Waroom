import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  ShoppingCart,
  Tag,
  Package,
  Bot,
  Shield,
  Code2,
  Zap,
  Star,
  Search,
  Filter,
  SortDesc,
} from "lucide-react";
import { NFTManager, NFTInfo } from "@/lib/blockchain/NFTManager";
import { AgentManager } from "@/lib/agents/AgentManager";

interface MarketplaceProps {
  onImportAgent?: (agentId: string) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onImportAgent }) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [ownedNFTs, setOwnedNFTs] = useState<NFTInfo[]>([]);
  const [marketplaceNFTs, setMarketplaceNFTs] = useState<NFTInfo[]>([]);
  const [activeTab, setActiveTab] = useState("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const nftManager = NFTManager.getInstance();
  const agentManager = AgentManager.getInstance();

  useEffect(() => {
    // Check if wallet is already connected
    if (nftManager.isConnected()) {
      setIsWalletConnected(true);
      setWalletAddress(nftManager.getWalletAddress());
      loadNFTs();
    }
  }, []);

  const connectWallet = async () => {
    try {
      const success = await nftManager.connectWallet();
      if (success) {
        setIsWalletConnected(true);
        setWalletAddress(nftManager.getWalletAddress());
        loadNFTs();
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnectWallet = async () => {
    try {
      const success = await nftManager.disconnectWallet();
      if (success) {
        setIsWalletConnected(false);
        setWalletAddress("");
        setOwnedNFTs([]);
      }
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  const loadNFTs = async () => {
    try {
      // Load owned NFTs
      const owned = await nftManager.getOwnedNFTs();
      setOwnedNFTs(owned);

      // In a real implementation, we would load marketplace NFTs from a contract or API
      // For now, we'll just use the same NFTs as owned ones for demonstration
      setMarketplaceNFTs([...owned]);
    } catch (error) {
      console.error("Failed to load NFTs:", error);
    }
  };

  const handleImportAgent = async (tokenId: string) => {
    try {
      const agent = await nftManager.importAgentFromNFT(tokenId);
      if (agent) {
        // Add the imported agent to the agent manager
        agentManager.createAgent(agent.toJSON());
        agentManager.saveAgents();
        
        if (onImportAgent) {
          onImportAgent(agent.getId());
        }
      }
    } catch (error) {
      console.error("Failed to import agent:", error);
    }
  };

  const handleMintAgent = async () => {
    try {
      // Get the first agent from the agent manager for demonstration
      const agents = agentManager.getAllAgents();
      if (agents.length > 0) {
        const nft = await nftManager.mintAgentNFT(agents[0]);
        if (nft) {
          loadNFTs();
        }
      }
    } catch (error) {
      console.error("Failed to mint agent NFT:", error);
    }
  };

  const filteredMarketplaceNFTs = marketplaceNFTs.filter((nft) => {
    // Apply search filter
    if (
      searchQuery &&
      !nft.metadata.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !nft.metadata.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Apply type filter
    if (selectedFilter !== "all") {
      const typeAttribute = nft.metadata.attributes.find(
        (attr) => attr.trait_type === "Type"
      );
      if (
        !typeAttribute ||
        typeAttribute.value.toString().toLowerCase() !== selectedFilter.toLowerCase()
      ) {
        return false;
      }
    }

    return true;
  });

  const getAgentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "code review":
        return <Code2 className="w-6 h-6 text-purple-400" />;
      case "security":
        return <Shield className="w-6 h-6 text-red-400" />;
      case "optimization":
        return <Zap className="w-6 h-6 text-green-400" />;
      default:
        return <Bot className="w-6 h-6 text-blue-400" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "legendary":
        return "bg-orange-500/20 text-orange-400 border-orange-500";
      case "epic":
        return "bg-purple-500/20 text-purple-400 border-purple-500";
      case "rare":
        return "bg-blue-500/20 text-blue-400 border-blue-500";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500";
    }
  };

  return (
    <div className="w-full h-full bg-black/90 text-white p-6">
      <div className="flex flex-col h-full gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
            NFT Marketplace
          </h1>
          <div className="flex gap-4">
            {isWalletConnected ? (
              <div className="flex items-center gap-4">
                <div className="bg-gray-800 px-3 py-1 rounded-md flex items-center">
                  <Wallet className="w-4 h-4 mr-2 text-green-400" />
                  <span className="text-sm text-gray-300">
                    {walletAddress.substring(0, 6)}...
                    {walletAddress.substring(walletAddress.length - 4)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="border-red-500 hover:bg-red-500/20"
                  onClick={disconnectWallet}
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="border-green-500 hover:bg-green-500/20"
                onClick={connectWallet}
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>

        {isWalletConnected ? (
          <div className="grid grid-cols-12 gap-6 flex-grow">
            <Card className="col-span-12 bg-gray-900/50 border-gray-800">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-3 bg-gray-900/50">
                  <TabsTrigger value="browse">Browse Marketplace</TabsTrigger>
                  <TabsTrigger value="owned">My NFTs</TabsTrigger>
                  <TabsTrigger value="mint">Mint Agent</TabsTrigger>
                </TabsList>

                <TabsContent value="browse" className="p-6">
                  <div className="flex justify-between mb-6">
                    <div className="relative w-1/3">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        className="pl-10 bg-gray-800 border-gray-700"
                        placeholder="Search agents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`border-gray-700 ${
                          selectedFilter === "all" ? "bg-gray-700" : ""
                        }`}
                        onClick={() => setSelectedFilter("all")}
                      >
                        All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`border-purple-700 ${
                          selectedFilter === "code review" ? "bg-purple-700/30" : ""
                        }`}
                        onClick={() => setSelectedFilter("code review")}
                      >
                        <Code2 className="w-4 h-4 mr-1" />
                        Code Review
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`border-red-700 ${
                          selectedFilter === "security" ? "bg-red-700/30" : ""
                        }`}
                        onClick={() => setSelectedFilter("security")}
                      >
                        <Shield className="w-4 h-4 mr-1" />
                        Security
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`border-green-700 ${
                          selectedFilter === "optimization" ? "bg-green-700/30" : ""
                        }`}
                        onClick={() => setSelectedFilter("optimization")}
                      >
                        <Zap className="w-4 h-4 mr-1" />
                        Optimization
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {filteredMarketplaceNFTs.map((nft) => {
                      const typeAttr = nft.metadata.attributes.find(
                        (attr) => attr.trait_type === "Type"
                      );
                      const levelAttr = nft.metadata.attributes.find(
                        (attr) => attr.trait_type === "Level"
                      );
                      const rarityAttr = nft.metadata.attributes.find(
                        (attr) => attr.trait_type === "Rarity"
                      );
                      const modulesAttr = nft.metadata.attributes.find(
                        (attr) => attr.trait_type === "Modules"
                      );

                      const type = typeAttr ? typeAttr.value.toString() : "Unknown";
                      const level = levelAttr ? Number(levelAttr.value) : 1;
                      const rarity = rarityAttr ? rarityAttr.value.toString() : "Common";
                      const modules = modulesAttr ? Number(modulesAttr.value) : 0;

                      return (
                        <Card
                          key={nft.tokenId}
                          className="border-gray-800 hover:border-purple-500 transition-colors overflow-hidden"
                        >
                          <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                              {getAgentIcon(type)}
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold">{nft.metadata.name}</h3>
                              <Badge
                                variant="outline"
                                className={getRarityColor(rarity)}
                              >
                                {rarity}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                              {nft.metadata.description}
                            </p>
                            <div className="flex justify-between mb-3">
                              <div className="flex items-center">
                                <Badge variant="outline" className="bg-gray-800 text-xs">
                                  Lv. {level}
                                </Badge>
                                <div className="flex ml-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < level
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-600"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="text-xs text-gray-400">
                                <span>Modules: </span>
                                <span className="text-white">{modules}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="text-sm font-semibold text-purple-400">
                                0.05 ETH
                              </div>
                              <Button
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                Buy
                              </Button>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="owned" className="p-6">
                  <div className="grid grid-cols-3 gap-4">
                    {ownedNFTs.map((nft) => {
                      const typeAttr = nft.metadata.attributes.find(
                        (attr) => attr.trait_type === "Type"
                      );
                      const levelAttr = nft.metadata.attributes.find(
                        (attr) => attr.trait_type === "Level"
                      );
                      const rarityAttr = nft.metadata.attributes.find(
                        (attr) => attr.trait_type === "Rarity"
                      );
                      const modulesAttr = nft.metadata.attributes.find(
                        (attr) => attr.trait_type === "Modules"
                      );

                      const type = typeAttr ? typeAttr.value.toString() : "Unknown";
                      const level = levelAttr ? Number(levelAttr.value) : 1;
                      const rarity = rarityAttr ? rarityAttr.value.toString() : "Common";
                      const modules = modulesAttr ? Number(modulesAttr.value) : 0;

                      return (
                        <Card
                          key={nft.tokenId}
                          className="border-gray-800 hover:border-cyan-500 transition-colors overflow-hidden"
                        >
                          <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                              {getAgentIcon(type)}
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold">{nft.metadata.name}</h3>
                              <Badge
                                variant="outline"
                                className={getRarityColor(rarity)}
                              >
                                {rarity}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                              {nft.metadata.description}
                            </p>
                            <div className="flex justify-between mb-3">
                              <div className="flex items-center">
                                <Badge variant="outline" className="bg-gray-800 text-xs">
                                  Lv. {level}
                                </Badge>
                                <div className="flex ml-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < level
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-600"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="text-xs text-gray-400">
                                <span>Modules: </span>
                                <span className="text-white">{modules}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-cyan-500 hover:bg-cyan-500/20"
                                onClick={() => handleImportAgent(nft.tokenId)}
                              >
                                <Package className="w-4 h-4 mr-1" />
                                Import
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-purple-500 hover:bg-purple-500/20"
                              >
                                <Tag className="w-4 h-4 mr-1" />
                                Sell
                              </Button>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="mint" className="p-6">
                  <div className="flex flex-col items-center justify-center h-64">
                    <h3 className="text-xl font-semibold mb-4">
                      Mint Your Agent as NFT
                    </h3>
                    <p className="text-gray-400 text-center max-w-md mb-6">
                      Convert your AI agent into an NFT to trade on the marketplace
                      or transfer to other users.
                    </p>
                    <Button
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                      onClick={handleMintAgent}
                    >
                      <Bot className="w-5 h-5 mr-2" />
                      Mint Agent NFT
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <Wallet className="w-16 h-16 text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-gray-400 text-center max-w-md mb-6">
              Connect your wallet to access the NFT marketplace and manage your
              AI agent NFTs.
            </p>
            <Button
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
              onClick={connectWallet}
            >
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace; 