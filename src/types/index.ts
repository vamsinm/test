export interface Cluster {
  id: string;
  name: string;
  region: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface Namespace {
  id: string;
  name: string;
  clusterId: string;
  resourceCount: number;
}

export interface Workload {
  id: string;
  name: string;
  type: 'deployment' | 'statefulset' | 'daemonset';
  namespaceId: string;
  status: 'running' | 'pending' | 'error';
}

export interface ResourceMetrics {
  cpu: {
    current: number;
    recommended: number;
    unit: 'cores';
  };
  memory: {
    current: number;
    recommended: number;
    unit: 'GB';
  };
  replicas: {
    current: number;
    recommended: number;
    unit: 'pods';
  };
  costPerMonth: {
    current: number;
    recommended: number;
    unit: 'USD';
  };
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}