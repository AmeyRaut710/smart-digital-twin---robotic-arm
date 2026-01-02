
import React from 'react';
import { Play, Pause, RotateCcw, Bug, Trash2 } from 'lucide-react';

interface SimulationControlsProps {
  isRunning: boolean;
  onToggleRun: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onInjectFault: () => void;
  activeFault: string | null;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  isRunning, onToggleRun, onReset, speed, onSpeedChange, onInjectFault, activeFault
}) => {
  return (
    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-8 shadow-2xl">
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Controls</h3>
        <div className="flex gap-3">
          <button 
            onClick={onToggleRun}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-200 font-bold shadow-lg ${
              isRunning 
              ? 'bg-amber-500 hover:bg-amber-600 text-amber-950 shadow-amber-500/20' 
              : 'bg-emerald-500 hover:bg-emerald-600 text-emerald-950 shadow-emerald-500/20'
            }`}
          >
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
            {isRunning ? 'PAUSE' : 'START'}
          </button>
          <button 
            onClick={onReset}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Simulation Speed</h3>
          <span className="text-cyan-400 font-mono font-bold">{speed}x</span>
        </div>
        <input 
          type="range" 
          min="0.1" 
          max="5" 
          step="0.1" 
          value={speed} 
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Chaos Engineering</h3>
          {activeFault && (
             <span className="text-[10px] font-black text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-500/20 animate-pulse">
               {activeFault.toUpperCase()} ACTIVE
             </span>
          )}
        </div>
        
        <button 
          onClick={onInjectFault}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold group border ${
            activeFault 
            ? 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/30' 
            : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          {activeFault ? <Trash2 size={20} /> : <Bug size={20} className="group-hover:animate-bounce" />}
          {activeFault ? 'CLEAR INJECTED FAULT' : 'INJECT RANDOM FAULT'}
        </button>
        <p className="text-[10px] text-slate-500 text-center italic">
          Test system resilience by introducing mechanical anomalies.
        </p>
      </div>
    </div>
  );
};

export default SimulationControls;
