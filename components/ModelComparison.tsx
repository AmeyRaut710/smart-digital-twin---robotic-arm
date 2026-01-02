
import React from 'react';
import { Cpu, Layers, Gauge, Activity } from 'lucide-react';

interface ModelStats {
  states: number;
  computeTime: number;
  memory: string;
  accuracy: string;
}

interface ModelComparisonProps {
  fullModelStats: ModelStats;
  romStats: ModelStats;
}

const ModelComparison: React.FC<ModelComparisonProps> = ({ fullModelStats, romStats }) => {
  const computeImprovement = Math.round((1 - romStats.computeTime / fullModelStats.computeTime) * 100);
  const memoryValue = (str: string) => parseInt(str);
  const memoryImprovement = Math.round((1 - memoryValue(romStats.memory) / memoryValue(fullModelStats.memory)) * 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Full Model Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-slate-500" />
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Model</h4>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 uppercase font-medium">States</span>
              <span className="text-sm font-bold text-white">{fullModelStats.states}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Latency</span>
              <span className="text-sm font-bold text-white">{fullModelStats.computeTime}ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Memory</span>
              <span className="text-sm font-bold text-white">{fullModelStats.memory}</span>
            </div>
          </div>
        </div>

        {/* ROM Card */}
        <div className="p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
            <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">ROM Agent</h4>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 uppercase font-medium">States</span>
              <span className="text-sm font-bold text-white">{romStats.states}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Latency</span>
              <span className="text-sm font-bold text-white">{romStats.computeTime}ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Memory</span>
              <span className="text-sm font-bold text-white">{romStats.memory}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 bg-slate-900/50 rounded-2xl border border-slate-800 divide-y divide-slate-800">
        <div className="py-2 flex justify-between items-center text-xs">
          <span className="text-slate-400">Compute Efficiency</span>
          <span className="text-emerald-400 font-bold">+{computeImprovement}% Improvement</span>
        </div>
        <div className="py-2 flex justify-between items-center text-xs">
          <span className="text-slate-400">Memory Reduction</span>
          <span className="text-emerald-400 font-bold">-{memoryImprovement}% Optimized</span>
        </div>
        <div className="py-2 flex justify-between items-center text-xs">
          <span className="text-slate-400">ROM Accuracy (Reconstruction)</span>
          <span className="text-cyan-400 font-bold">{romStats.accuracy}</span>
        </div>
      </div>
    </div>
  );
};

export default ModelComparison;
