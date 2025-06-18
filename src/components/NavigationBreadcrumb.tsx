import React from 'react';
import { ChevronRight, Server, Package, Layers } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface NavigationBreadcrumbProps {
  cluster?: string;
  namespace?: string;
  workload?: string;
}

export const NavigationBreadcrumb: React.FC<NavigationBreadcrumbProps> = ({
  cluster,
  namespace,
  workload,
}) => {
  const items: BreadcrumbItem[] = [
    {
      label: cluster || 'Select Cluster',
      icon: <Server className="w-4 h-4" />,
      active: !!cluster,
    },
    {
      label: namespace || 'Select Namespace',
      icon: <Package className="w-4 h-4" />,
      active: !!namespace,
    },
    {
      label: workload || 'Select Workload',
      icon: <Layers className="w-4 h-4" />,
      active: !!workload,
    },
  ];

  return (
    <nav className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <div className={`
            flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200
            ${item.active 
              ? 'bg-blue-100 text-blue-800' 
              : 'text-gray-500 bg-gray-100'
            }
          `}>
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </div>
          {index < items.length - 1 && (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};