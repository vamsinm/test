import React, { useState, useEffect } from 'react';
import { Settings, Database, Cloud } from 'lucide-react';
import { Dropdown } from './components/Dropdown';
import { ResourceCard } from './components/ResourceCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { NavigationBreadcrumb } from './components/NavigationBreadcrumb';
import { apiService } from './services/api';
import { Cluster, Namespace, Workload, ResourceMetrics } from './types';

function App() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [namespaces, setNamespaces] = useState<Namespace[]>([]);
  const [workloads, setWorkloads] = useState<Workload[]>([]);
  const [resourceMetrics, setResourceMetrics] = useState<ResourceMetrics | null>(null);

  const [selectedCluster, setSelectedCluster] = useState<string>('');
  const [selectedNamespace, setSelectedNamespace] = useState<string>('');
  const [selectedWorkload, setSelectedWorkload] = useState<string>('');

  const [loading, setLoading] = useState({
    clusters: false,
    namespaces: false,
    workloads: false,
    metrics: false,
  });

  // Fetch clusters on component mount
  useEffect(() => {
    const fetchClusters = async () => {
      setLoading(prev => ({ ...prev, clusters: true }));
      try {
        const response = await apiService.getClusters();
        if (response.success) {
          setClusters(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch clusters:', error);
      } finally {
        setLoading(prev => ({ ...prev, clusters: false }));
      }
    };

    fetchClusters();
  }, []);

  // Fetch namespaces when cluster is selected
  useEffect(() => {
    if (selectedCluster) {
      const fetchNamespaces = async () => {
        setLoading(prev => ({ ...prev, namespaces: true }));
        setSelectedNamespace('');
        setSelectedWorkload('');
        setResourceMetrics(null);
        try {
          const response = await apiService.getNamespaces(selectedCluster);
          if (response.success) {
            setNamespaces(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch namespaces:', error);
        } finally {
          setLoading(prev => ({ ...prev, namespaces: false }));
        }
      };

      fetchNamespaces();
    } else {
      setNamespaces([]);
      setSelectedNamespace('');
      setSelectedWorkload('');
      setResourceMetrics(null);
    }
  }, [selectedCluster]);

  // Fetch workloads when namespace is selected
  useEffect(() => {
    if (selectedNamespace) {
      const fetchWorkloads = async () => {
        setLoading(prev => ({ ...prev, workloads: true }));
        setSelectedWorkload('');
        setResourceMetrics(null);
        try {
          const response = await apiService.getWorkloads(selectedNamespace);
          if (response.success) {
            setWorkloads(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch workloads:', error);
        } finally {
          setLoading(prev => ({ ...prev, workloads: false }));
        }
      };

      fetchWorkloads();
    } else {
      setWorkloads([]);
      setSelectedWorkload('');
      setResourceMetrics(null);
    }
  }, [selectedNamespace]);

  // Fetch resource metrics when workload is selected
  useEffect(() => {
    if (selectedWorkload) {
      const fetchResourceMetrics = async () => {
        setLoading(prev => ({ ...prev, metrics: true }));
        try {
          const response = await apiService.getResourceMetrics(selectedWorkload);
          if (response.success) {
            setResourceMetrics(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch resource metrics:', error);
        } finally {
          setLoading(prev => ({ ...prev, metrics: false }));
        }
      };

      fetchResourceMetrics();
    } else {
      setResourceMetrics(null);
    }
  }, [selectedWorkload]);

  const getSelectedClusterName = () => {
    return clusters.find(c => c.id === selectedCluster)?.name;
  };

  const getSelectedNamespaceName = () => {
    return namespaces.find(n => n.id === selectedNamespace)?.name;
  };

  const getSelectedWorkloadName = () => {
    return workloads.find(w => w.id === selectedWorkload)?.name;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Cluster Resource Manager</h1>
                <p className="text-sm text-gray-500">Optimize your Kubernetes workloads</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Database className="w-4 h-4" />
                <span>Connected to DynamoDB</span>
              </div>
              <Settings className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <NavigationBreadcrumb
            cluster={getSelectedClusterName()}
            namespace={getSelectedNamespaceName()}
            workload={getSelectedWorkloadName()}
          />
        </div>

        {/* Selection Controls */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Resource Selection</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cluster Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cluster
              </label>
              {loading.clusters ? (
                <div className="flex items-center justify-center p-4 border border-gray-300 rounded-lg">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2 text-gray-500">Loading clusters...</span>
                </div>
              ) : (
                <Dropdown
                  options={clusters.map(cluster => ({
                    id: cluster.id,
                    label: cluster.name,
                    sublabel: cluster.region,
                    status: cluster.status,
                  }))}
                  selectedId={selectedCluster}
                  onSelect={setSelectedCluster}
                  placeholder="Select a cluster"
                />
              )}
            </div>

            {/* Namespace Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Namespace
              </label>
              {loading.namespaces ? (
                <div className="flex items-center justify-center p-4 border border-gray-300 rounded-lg">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2 text-gray-500">Loading namespaces...</span>
                </div>
              ) : (
                <Dropdown
                  options={namespaces.map(namespace => ({
                    id: namespace.id,
                    label: namespace.name,
                    sublabel: `${namespace.resourceCount} resources`,
                  }))}
                  selectedId={selectedNamespace}
                  onSelect={setSelectedNamespace}
                  placeholder="Select a namespace"
                  disabled={!selectedCluster}
                />
              )}
            </div>

            {/* Workload Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workload
              </label>
              {loading.workloads ? (
                <div className="flex items-center justify-center p-4 border border-gray-300 rounded-lg">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2 text-gray-500">Loading workloads...</span>
                </div>
              ) : (
                <Dropdown
                  options={workloads.map(workload => ({
                    id: workload.id,
                    label: workload.name,
                    sublabel: workload.type,
                    status: workload.status,
                  }))}
                  selectedId={selectedWorkload}
                  onSelect={setSelectedWorkload}
                  placeholder="Select a workload"
                  disabled={!selectedNamespace}
                />
              )}
            </div>
          </div>
        </div>

        {/* Resource Comparison */}
        {selectedWorkload && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {loading.metrics ? (
              <div className="lg:col-span-2 flex items-center justify-center p-12 bg-white rounded-xl shadow-lg border border-gray-200">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-gray-600">Loading resource metrics...</span>
              </div>
            ) : resourceMetrics ? (
              <>
                <ResourceCard
                  title="Current Resources"
                  subtitle="Current resource allocation and usage"
                  cpu={resourceMetrics.cpu}
                  memory={resourceMetrics.memory}
                  replicas={resourceMetrics.replicas}
                  costPerMonth={resourceMetrics.costPerMonth}
                />
                <ResourceCard
                  title="Recommended Resources"
                  subtitle="AI-optimized resource recommendations"
                  cpu={{ 
                    current: resourceMetrics.cpu.recommended, 
                    recommended: resourceMetrics.cpu.recommended, 
                    unit: resourceMetrics.cpu.unit 
                  }}
                  memory={{ 
                    current: resourceMetrics.memory.recommended, 
                    recommended: resourceMetrics.memory.recommended, 
                    unit: resourceMetrics.memory.unit 
                  }}
                  replicas={{ 
                    current: resourceMetrics.replicas.recommended, 
                    recommended: resourceMetrics.replicas.recommended, 
                    unit: resourceMetrics.replicas.unit 
                  }}
                  costPerMonth={{ 
                    current: resourceMetrics.costPerMonth.recommended, 
                    recommended: resourceMetrics.costPerMonth.recommended, 
                    unit: resourceMetrics.costPerMonth.unit 
                  }}
                  className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50"
                />
              </>
            ) : (
              <div className="lg:col-span-2 text-center p-12 bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="text-gray-400 mb-4">
                  <Database className="w-16 h-16 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
                <p className="text-gray-600">
                  Resource metrics could not be loaded for the selected workload.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!selectedWorkload && (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="text-gray-400 mb-4">
              <Cloud className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Workload</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Choose a cluster, namespace, and workload to view current and recommended resource allocations.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>© 2025 Cluster Resource Manager. Built for AWS Serverless.</p>
            <div className="flex items-center space-x-6">
              <span>API Gateway</span>
              <span>Lambda</span>
              <span>DynamoDB</span>
              <span>S3 + CloudFront</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;