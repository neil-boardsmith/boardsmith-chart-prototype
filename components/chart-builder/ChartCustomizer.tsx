'use client';

import React from 'react';
import { ChevronDown, ChevronUp, Type, BarChart3, Tag } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChartConfig } from '@/types/chart-types';

interface ChartCustomizerProps {
  config: ChartConfig;
  onChange: (config: ChartConfig) => void;
  isExpanded?: boolean;
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  children,
  defaultOpen = true
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

export const ChartCustomizer: React.FC<ChartCustomizerProps> = ({
  config,
  onChange,
  isExpanded = false
}) => {
  const updateConfig = (updates: Partial<ChartConfig>) => {
    onChange({ ...config, ...updates });
  };


  return (
    <div className="h-full flex flex-col">
      <div className={`${isExpanded ? 'flex-1 overflow-y-auto' : ''}`}>
        {/* Text Controls Section */}
        <CollapsibleSection
          title="Text"
          icon={<Type className="w-4 h-4 text-gray-600" />}
        >
          {/* Legend Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="legend-toggle" className="text-sm font-medium text-gray-700">
              Legend
            </Label>
            <Switch
              id="legend-toggle"
              checked={config.showLegend}
              onCheckedChange={(checked) => updateConfig({ showLegend: checked })}
            />
          </div>

          {/* Data Labels Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="data-labels-toggle" className="text-sm font-medium text-gray-700">
              Data labels
            </Label>
            <Switch
              id="data-labels-toggle"
              checked={config.showDataLabels}
              onCheckedChange={(checked) => updateConfig({ showDataLabels: checked })}
            />
          </div>

          {/* Stack Totals (only for stacked charts) */}
          {(config.subtype === 'stacked' || config.subtype === 'stacked100') && (
            <div className="flex items-center justify-between">
              <Label htmlFor="stack-totals-toggle" className="text-sm font-medium text-gray-700">
                Stack totals
              </Label>
              <Switch
                id="stack-totals-toggle"
                checked={config.showStackTotals || false}
                onCheckedChange={(checked) => updateConfig({ showStackTotals: checked })}
              />
            </div>
          )}
        </CollapsibleSection>

        {/* Title & Content Section */}
        <CollapsibleSection
          title="Content"
          icon={<Tag className="w-4 h-4 text-gray-600" />}
        >
          {/* Chart Title */}
          <div className="space-y-2">
            <Label htmlFor="chart-title" className="text-sm font-medium text-gray-700">
              Title
            </Label>
            <Input
              id="chart-title"
              value={config.title}
              onChange={(e) => updateConfig({ title: e.target.value })}
              placeholder="Chart title"
              className="text-sm"
            />
          </div>

          {/* Chart Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="chart-subtitle" className="text-sm font-medium text-gray-700">
              Subtitle
            </Label>
            <Input
              id="chart-subtitle"
              value={config.subtitle || ''}
              onChange={(e) => updateConfig({ subtitle: e.target.value })}
              placeholder="Chart subtitle"
              className="text-sm"
            />
          </div>

          {/* Chart Source */}
          <div className="space-y-2">
            <Label htmlFor="chart-source" className="text-sm font-medium text-gray-700">
              Source
            </Label>
            <Input
              id="chart-source"
              value={config.source || ''}
              onChange={(e) => updateConfig({ source: e.target.value })}
              placeholder="Data source"
              className="text-sm"
            />
          </div>
        </CollapsibleSection>

        {/* X Axis Section */}
        <CollapsibleSection
          title="X Axis"
          icon={<BarChart3 className="w-4 h-4 text-gray-600 rotate-90" />}
        >
          {/* X Axis Labels Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="x-axis-labels-toggle" className="text-sm font-medium text-gray-700">
              Axis labels
            </Label>
            <Switch
              id="x-axis-labels-toggle"
              checked={config.showXAxisLabels !== false}
              onCheckedChange={(checked) => updateConfig({ showXAxisLabels: checked })}
            />
          </div>

          {/* X Axis Title */}
          <div className="space-y-2">
            <Label htmlFor="x-axis-title" className="text-sm font-medium text-gray-700">
              X axis title
            </Label>
            <Input
              id="x-axis-title"
              value={config.xAxisTitle || ''}
              onChange={(e) => updateConfig({ xAxisTitle: e.target.value })}
              placeholder="X axis title"
              className="text-sm"
            />
          </div>
        </CollapsibleSection>

        {/* Y Axis Section */}
        <CollapsibleSection
          title="Y Axis"
          icon={<BarChart3 className="w-4 h-4 text-gray-600" />}
        >
          {/* Y Axis Labels Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="y-axis-labels-toggle" className="text-sm font-medium text-gray-700">
              Axis labels
            </Label>
            <Switch
              id="y-axis-labels-toggle"
              checked={config.showYAxisLabels !== false}
              onCheckedChange={(checked) => updateConfig({ showYAxisLabels: checked })}
            />
          </div>

          {/* Y Axis Title */}
          <div className="space-y-2">
            <Label htmlFor="y-axis-title" className="text-sm font-medium text-gray-700">
              Y axis title
            </Label>
            <Input
              id="y-axis-title"
              value={config.yAxisTitle || ''}
              onChange={(e) => updateConfig({ yAxisTitle: e.target.value })}
              placeholder="Y axis title"
              className="text-sm"
            />
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
};