
import React from 'react';

interface SensorGaugeProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  warningThreshold: number;
  criticalThreshold: number;
}

const SensorGauge: React.FC<SensorGaugeProps> = ({
  label, value, min, max, unit, warningThreshold, criticalThreshold
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  let color = 'bg-cyan-500 shadow-cyan-500/40';
  if (value >= criticalThreshold) color = 'bg-red-500 shadow-red-500/40';
  else if (value >= warningThreshold) color = 'bg-amber-500 shadow-amber-500/40';

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-sm font-medium text-slate-400">{label}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-white leading-none">{value.toFixed(1)}</span>
          <span className="text-xs text-slate-500 font-medium">{unit}</span>
        </div>
      </div>
      <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out rounded-full shadow-lg ${color}`}
          style={{ width: `${clampedPercentage}%` }}
        />
        {/* Threshold Markers */}
        <div 
          className="absolute top-0 h-full w-px bg-slate-600 z-10" 
          style={{ left: `${((warningThreshold - min) / (max - min)) * 100}%` }}
        />
        <div 
          className="absolute top-0 h-full w-px bg-slate-600 z-10" 
          style={{ left: `${((criticalThreshold - min) / (max - min)) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default SensorGauge;
