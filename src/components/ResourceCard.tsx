import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ResourceItemProps {
  label: string;
  current: number;
  recommended: number;
  unit: string;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ label, current, recommended, unit }) => {
  const difference = recommended - current;
  const percentChange = current > 0 ? ((difference / current) * 100) : 0;
  
  const getTrendIcon = () => {
    if (Math.abs(percentChange) < 1) return <Minus className="w-4 h-4 text-gray-400" />;
    return percentChange > 0 
      ? <TrendingUp className="w-4 h-4 text-red-500" />
      : <TrendingDown className="w-4 h-4 text-green-500" />;
  };

  const getTrendColor = () => {
    if (Math.abs(percentChange) < 1) return 'text-gray-600';
    return percentChange > 0 ? 'text-red-600' : 'text-green-600';
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex-1">
        <div className="font-medium text-gray-900">{label}</div>
        <div className="flex items-center mt-1 space-x-2">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {Math.abs(percentChange).toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-semibold text-gray-900">
          {current} {unit}
        </div>
        <div className="text-sm text-gray-500">
          → {recommended} {unit}
        </div>
      </div>
    </div>
  );
};

interface ResourceCardProps {
  title: string;
  subtitle: string;
  cpu: { current: number; recommended: number; unit: string };
  memory: { current: number; recommended: number; unit: string };
  replicas: { current: number; recommended: number; unit: string };
  costPerMonth: { current: number; recommended: number; unit: string };
  className?: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  subtitle,
  cpu,
  memory,
  replicas,
  costPerMonth,
  className = '',
}) => {
  const totalSavings = costPerMonth.current - costPerMonth.recommended;
  const savingsPercentage = costPerMonth.current > 0 
    ? ((totalSavings / costPerMonth.current) * 100) 
    : 0;

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-600 mt-1">{subtitle}</p>
        
        {totalSavings !== 0 && (
          <div className={`
            inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-3
            ${totalSavings > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
            }
          `}>
            {totalSavings > 0 ? '💰 ' : '⚠️ '}
            {totalSavings > 0 ? 'Potential Savings: ' : 'Additional Cost: '}
            ${Math.abs(totalSavings).toFixed(2)}/month 
            ({Math.abs(savingsPercentage).toFixed(1)}%)
          </div>
        )}
      </div>

      <div className="space-y-1">
        <ResourceItem
          label="CPU Usage"
          current={cpu.current}
          recommended={cpu.recommended}
          unit={cpu.unit}
        />
        <ResourceItem
          label="Memory Usage"
          current={memory.current}
          recommended={memory.recommended}
          unit={memory.unit}
        />
        <ResourceItem
          label="Replica Count"
          current={replicas.current}
          recommended={replicas.recommended}
          unit={replicas.unit}
        />
        <ResourceItem
          label="Monthly Cost"
          current={costPerMonth.current}
          recommended={costPerMonth.recommended}
          unit={costPerMonth.unit}
        />
      </div>
    </div>
  );
};