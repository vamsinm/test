import { Cluster, Namespace, Workload, ResourceMetrics, ApiResponse } from '../types';

// Mock data - In production, these would be API calls to Lambda functions
const mockClusters: Cluster[] = [
  { id: 'cluster-1', name: 'Production EKS', region: 'us-east-1', status: 'active' },
  { id: 'cluster-2', name: 'Staging EKS', region: 'us-west-2', status: 'active' },
  { id: 'cluster-3', name: 'Development EKS', region: 'eu-west-1', status: 'active' },
];

const mockNamespaces: Namespace[] = [
  { id: 'ns-1', name: 'default', clusterId: 'cluster-1', resourceCount: 12 },
  { id: 'ns-2', name: 'kube-system', clusterId: 'cluster-1', resourceCount: 8 },
  { id: 'ns-3', name: 'monitoring', clusterId: 'cluster-1', resourceCount: 5 },
  { id: 'ns-4', name: 'ingress-nginx', clusterId: 'cluster-1', resourceCount: 3 },
  { id: 'ns-5', name: 'default', clusterId: 'cluster-2', resourceCount: 6 },
  { id: 'ns-6', name: 'staging', clusterId: 'cluster-2', resourceCount: 4 },
];

const mockWorkloads: Workload[] = [
  { id: 'wl-1', name: 'web-frontend', type: 'deployment', namespaceId: 'ns-1', status: 'running' },
  { id: 'wl-2', name: 'api-backend', type: 'deployment', namespaceId: 'ns-1', status: 'running' },
  { id: 'wl-3', name: 'redis-cache', type: 'statefulset', namespaceId: 'ns-1', status: 'running' },
  { id: 'wl-4', name: 'log-collector', type: 'daemonset', namespaceId: 'ns-1', status: 'running' },
  { id: 'wl-5', name: 'prometheus', type: 'deployment', namespaceId: 'ns-3', status: 'running' },
  { id: 'wl-6', name: 'grafana', type: 'deployment', namespaceId: 'ns-3', status: 'running' },
];

const mockResourceMetrics: Record<string, ResourceMetrics> = {
  'wl-1': {
    cpu: { current: 2.5, recommended: 1.8, unit: 'cores' },
    memory: { current: 4.0, recommended: 2.8, unit: 'GB' },
    replicas: { current: 5, recommended: 3, unit: 'pods' },
    costPerMonth: { current: 245.60, recommended: 172.80, unit: 'USD' },
  },
  'wl-2': {
    cpu: { current: 1.2, recommended: 1.6, unit: 'cores' },
    memory: { current: 2.0, recommended: 3.2, unit: 'GB' },
    replicas: { current: 3, recommended: 4, unit: 'pods' },
    costPerMonth: { current: 156.40, recommended: 198.20, unit: 'USD' },
  },
  'wl-3': {
    cpu: { current: 0.8, recommended: 0.6, unit: 'cores' },
    memory: { current: 1.5, recommended: 1.2, unit: 'GB' },
    replicas: { current: 2, recommended: 2, unit: 'pods' },
    costPerMonth: { current: 89.30, recommended: 71.20, unit: 'USD' },
  },
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  async getClusters(): Promise<ApiResponse<Cluster[]>> {
    await delay(800);
    return {
      data: mockClusters,
      success: true,
      message: 'Clusters fetched successfully',
    };
  },

  async getNamespaces(clusterId: string): Promise<ApiResponse<Namespace[]>> {
    await delay(600);
    const namespaces = mockNamespaces.filter(ns => ns.clusterId === clusterId);
    return {
      data: namespaces,
      success: true,
      message: 'Namespaces fetched successfully',
    };
  },

  async getWorkloads(namespaceId: string): Promise<ApiResponse<Workload[]>> {
    await delay(500);
    const workloads = mockWorkloads.filter(wl => wl.namespaceId === namespaceId);
    return {
      data: workloads,
      success: true,
      message: 'Workloads fetched successfully',
    };
  },

  async getResourceMetrics(workloadId: string): Promise<ApiResponse<ResourceMetrics>> {
    await delay(400);
    const metrics = mockResourceMetrics[workloadId];
    if (!metrics) {
      return {
        data: {} as ResourceMetrics,
        success: false,
        message: 'Resource metrics not found',
      };
    }
    return {
      data: metrics,
      success: true,
      message: 'Resource metrics fetched successfully',
    };
  },
};