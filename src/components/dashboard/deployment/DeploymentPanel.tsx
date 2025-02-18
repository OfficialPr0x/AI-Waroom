import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Server,
  Cpu,
  Database,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface SystemMetric {
  name: string;
  value: number;
  status: "healthy" | "warning" | "critical";
}

interface DeploymentStatus {
  environment: string;
  status: "running" | "failed" | "deploying";
  lastDeployed: string;
  version: string;
}

interface Props {
  metrics?: SystemMetric[];
  deployments?: DeploymentStatus[];
}

const defaultMetrics: SystemMetric[] = [
  { name: "CPU Usage", value: 45, status: "healthy" },
  { name: "Memory Usage", value: 72, status: "warning" },
  { name: "Storage", value: 28, status: "healthy" },
  { name: "Network Load", value: 65, status: "healthy" },
];

const defaultDeployments: DeploymentStatus[] = [
  {
    environment: "Production",
    status: "running",
    lastDeployed: "2024-01-20 14:30",
    version: "v1.2.3",
  },
  {
    environment: "Staging",
    status: "deploying",
    lastDeployed: "2024-01-20 13:15",
    version: "v1.2.4",
  },
  {
    environment: "Development",
    status: "failed",
    lastDeployed: "2024-01-20 12:00",
    version: "v1.2.4-beta",
  },
];

const DeploymentPanel = ({
  metrics = defaultMetrics,
  deployments = defaultDeployments,
}: Props) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "running":
        return "text-green-500";
      case "warning":
      case "deploying":
        return "text-yellow-500";
      case "critical":
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle className="w-5 h-5" />;
      case "deploying":
        return <Activity className="w-5 h-5" />;
      case "failed":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500">
          System Dashboard
        </h1>
        <p className="text-gray-400 mt-2">
          Real-time system metrics and deployment status
        </p>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="metrics" className="text-lg">
            <Server className="mr-2 h-5 w-5" /> System Metrics
          </TabsTrigger>
          <TabsTrigger value="deployments" className="text-lg">
            <Database className="mr-2 h-5 w-5" /> Deployments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.map((metric, index) => (
              <Card
                key={index}
                className="p-6 bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">{metric.name}</h3>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(metric.status)} border-current`}
                  >
                    {metric.status}
                  </Badge>
                </div>
                <Progress value={metric.value} className="h-2 mb-2" />
                <p className="text-right text-sm text-gray-400">
                  {metric.value}%
                </p>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deployments">
          <div className="space-y-6">
            {deployments.map((deployment, index) => (
              <Card key={index} className="p-6 bg-gray-800 border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-medium mb-2">
                      {deployment.environment}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>Version: {deployment.version}</span>
                      <span>Last deployed: {deployment.lastDeployed}</span>
                    </div>
                  </div>
                  <div
                    className={`flex items-center ${getStatusColor(deployment.status)}`}
                  >
                    {getStatusIcon(deployment.status)}
                    <span className="ml-2 font-medium">
                      {deployment.status}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeploymentPanel;
