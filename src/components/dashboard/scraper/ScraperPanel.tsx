import React, { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { runScraper } from "@/lib/scraper";
import {
  Terminal,
  FolderTree,
  Play,
  AlertCircle,
  XCircle,
  CheckCircle,
} from "lucide-react";

interface FileTreeItem {
  name: string;
  type: "file" | "folder";
  children?: FileTreeItem[];
}

const initialFileTree: FileTreeItem[] = [
  {
    name: "scraped_data",
    type: "folder",
    children: [],
  },
];

const ScraperPanel = () => {
  const [url, setUrl] = useState("https://example.com");
  const [depth, setDepth] = useState(2);
  const [logs, setLogs] = useState<string[]>([]);
  const [fileTree, setFileTree] = useState(initialFileTree);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScrape = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      setLogs([]);

      const { process } = await runScraper(url, depth);

      process.output.on("data", (data) => {
        setLogs((prev) => [...prev, data]);
      });

      process.output.on("error", (err) => {
        setError(err.message);
        setIsLoading(false);
      });

      await process.finished;
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [url, depth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleScrape();
  };

  const renderFileTree = (items: FileTreeItem[], level = 0) => {
    return items.map((item, index) => (
      <div key={index} className={`ml-${level * 4}`}>
        <div className="flex items-center gap-2 py-1">
          <FolderTree
            className={`w-4 h-4 ${item.type === "folder" ? "text-blue-400" : "text-gray-400"}`}
          />
          <span className="text-sm">{item.name}</span>
        </div>
        {item.children && renderFileTree(item.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="h-full w-full bg-gray-900 p-6">
      <div className="space-y-6">
        <Card className="p-6 bg-gray-800 border-blue-500/50 shadow-lg shadow-blue-500/20">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to scrape"
              className="flex-1 bg-gray-900 border-blue-500/30"
            />
            <Input
              type="number"
              value={depth}
              onChange={(e) => setDepth(parseInt(e.target.value))}
              placeholder="Depth"
              min="1"
              max="5"
              className="w-24 bg-gray-900 border-blue-500/30"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Play className="w-4 h-4 mr-2" />
              {isLoading ? "Scraping..." : "Start Scraping"}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-md flex items-center gap-2">
              <AlertCircle className="text-red-500 w-5 h-5" />
              <span className="text-red-200">{error}</span>
            </div>
          )}
        </Card>

        <Tabs defaultValue="terminal" className="w-full">
          <TabsList className="bg-gray-800 border-blue-500/30">
            <TabsTrigger
              value="terminal"
              className="data-[state=active]:bg-blue-600"
            >
              <Terminal className="w-4 h-4 mr-2" />
              Terminal
            </TabsTrigger>
            <TabsTrigger
              value="files"
              className="data-[state=active]:bg-blue-600"
            >
              <FolderTree className="w-4 h-4 mr-2" />
              Files
            </TabsTrigger>
          </TabsList>

          <TabsContent value="terminal" className="mt-4">
            <Card className="bg-gray-800 border-blue-500/30">
              <ScrollArea className="h-[400px] w-full rounded-md border border-blue-500/30 bg-black/50 p-4">
                {logs.map((log, index) => {
                  const logType = log.match(/\[(.*?)\]/)?.[1]?.toUpperCase();
                  let icon = null;
                  let textColor = "text-gray-300";

                  switch (logType) {
                    case "ERROR":
                      icon = <XCircle className="w-4 h-4 text-red-500" />;
                      textColor = "text-red-400";
                      break;
                    case "SUCCESS":
                      icon = <CheckCircle className="w-4 h-4 text-green-500" />;
                      textColor = "text-green-400";
                      break;
                    case "INFO":
                      icon = <Terminal className="w-4 h-4 text-blue-500" />;
                      textColor = "text-blue-400";
                      break;
                  }

                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 font-mono text-sm ${textColor} mb-2`}
                    >
                      {icon}
                      <span>{log}</span>
                    </div>
                  );
                })}
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="mt-4">
            <Card className="bg-gray-800 border-blue-500/30">
              <ScrollArea className="h-[400px] w-full rounded-md border border-blue-500/30 bg-black/50 p-4">
                {renderFileTree(fileTree)}
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScraperPanel;
