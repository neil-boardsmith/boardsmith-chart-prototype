'use client';

import React from 'react';
import { ChevronDown, ChevronUp, Type, BarChart3, Tag, Palette, Check } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChartConfig } from '@/types/chart-types';
import { colorPalettes } from '@/constants/color-palettes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-gray-900">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-3 pb-3 space-y-3">
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
            <Label htmlFor="legend-toggle" className="text-xs font-medium text-gray-700">
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
            <Label htmlFor="data-labels-toggle" className="text-xs font-medium text-gray-700">
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
              <Label htmlFor="stack-totals-toggle" className="text-xs font-medium text-gray-700">
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
          <div className="space-y-1">
            <Label htmlFor="chart-title" className="text-xs font-medium text-gray-700">
              Title
            </Label>
            <Input
              id="chart-title"
              value={config.title}
              onChange={(e) => updateConfig({ title: e.target.value })}
              placeholder="Chart title"
              className="h-8 text-xs md:text-xs"
            />
          </div>

          {/* Chart Subtitle */}
          <div className="space-y-1">
            <Label htmlFor="chart-subtitle" className="text-xs font-medium text-gray-700">
              Subtitle
            </Label>
            <Input
              id="chart-subtitle"
              value={config.subtitle || ''}
              onChange={(e) => updateConfig({ subtitle: e.target.value })}
              placeholder="Chart subtitle"
              className="h-8 text-xs md:text-xs"
            />
          </div>

          {/* Chart Source */}
          <div className="space-y-1">
            <Label htmlFor="chart-source" className="text-xs font-medium text-gray-700">
              Source
            </Label>
            <Input
              id="chart-source"
              value={config.source || ''}
              onChange={(e) => updateConfig({ source: e.target.value })}
              placeholder="Data source"
              className="h-8 text-xs md:text-xs"
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
            <Label htmlFor="x-axis-labels-toggle" className="text-xs font-medium text-gray-700">
              Axis labels
            </Label>
            <Switch
              id="x-axis-labels-toggle"
              checked={config.showXAxisLabels !== false}
              onCheckedChange={(checked) => updateConfig({ showXAxisLabels: checked })}
            />
          </div>

          {/* X Axis Title */}
          <div className="space-y-1">
            <Label htmlFor="x-axis-title" className="text-xs font-medium text-gray-700">
              X axis title
            </Label>
            <Input
              id="x-axis-title"
              value={config.xAxisTitle || ''}
              onChange={(e) => updateConfig({ xAxisTitle: e.target.value })}
              placeholder="X axis title"
              className="h-8 text-xs md:text-xs"
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
            <Label htmlFor="y-axis-labels-toggle" className="text-xs font-medium text-gray-700">
              Axis labels
            </Label>
            <Switch
              id="y-axis-labels-toggle"
              checked={config.showYAxisLabels !== false}
              onCheckedChange={(checked) => updateConfig({ showYAxisLabels: checked })}
            />
          </div>

          {/* Y Axis Title */}
          <div className="space-y-1">
            <Label htmlFor="y-axis-title" className="text-xs font-medium text-gray-700">
              Y axis title
            </Label>
            <Input
              id="y-axis-title"
              value={config.yAxisTitle || ''}
              onChange={(e) => updateConfig({ yAxisTitle: e.target.value })}
              placeholder="Y axis title"
              className="h-8 text-xs md:text-xs"
            />
          </div>
        </CollapsibleSection>

        {/* Style Section */}
        <CollapsibleSection
          title="Style"
          icon={<Palette className="w-4 h-4 text-gray-600" />}
        >
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-700">
              Color Theme
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {(() => {
                        const currentPalette = colorPalettes.find(p => 
                          JSON.stringify(p.colors) === JSON.stringify(config.colors)
                        ) || colorPalettes[0];
                        return currentPalette.colors.slice(0, 4).map((color, idx) => (
                          <div
                            key={idx}
                            className="w-3 h-5 first:rounded-l last:rounded-r"
                            style={{ backgroundColor: color }}
                          />
                        ));
                      })()}
                    </div>
                    <span className="text-sm">
                      {colorPalettes.find(p => 
                        JSON.stringify(p.colors) === JSON.stringify(config.colors)
                      )?.name || 'Teal'}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 z-[1100]">
                {colorPalettes.map((palette) => (
                  <DropdownMenuItem
                    key={palette.name}
                    onClick={() => updateConfig({ colors: palette.colors })}
                    className="flex items-center justify-between p-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {palette.colors.slice(0, 4).map((color, idx) => (
                          <div
                            key={idx}
                            className="w-3 h-5 first:rounded-l last:rounded-r"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-sm">{palette.name}</span>
                    </div>
                    {JSON.stringify(config.colors) === JSON.stringify(palette.colors) && (
                      <Check className="w-4 h-4 text-teal-600" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
};