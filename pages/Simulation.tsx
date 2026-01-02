
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, Layers, Cpu, Gauge, Zap, Binary, Hash, ArrowDownRight, ShieldCheck, CpuChip, AlertCircle } from 'lucide-react';
import { base44 } from '../api/base44Client';
import RoboticArmVisualization from '../components/RoboticArmVisualization';
import SimulationControls from '../components/SimulationControls';
import ROMComparisonChart from '../components/ROMComparisonChart';
import SensorChart from '../components/SensorChart';
import ModelComparison from '../components/ModelComparison';

const Simulation: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [simTime, setSimTime] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'comparison' | 'response'>('comparison');
  const [activeFault, setActiveFault] = useState<string | null>(null);

  const { data: config } = useQuery({
    queryKey: ['system_config'],
    queryFn: () => base44.entities.SystemConfig.get()
  });

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        setSimTime(prev => prev + (0.05 * speed));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isRunning, speed]);

  useEffect(() => {
    // Advanced dynamic model: double pendulum approximation
    const freq1 = 0.8 * speed;
    const freq2 = 1.4 * speed;
    
    let fullJ1 = 45 + Math.sin(simTime * freq1) * 30 + Math.cos(simTime * 0.2) * 2;
    let fullJ2 = -20 + Math.cos(simTime * freq2) * 15 + Math.sin(simTime * 0.4) * 4;
    
    // Inject Fault Logic
    if (activeFault === 'vibration') {
      fullJ1 += (Math.random() - 0.5) * 8;
      fullJ2 += (Math.random() - 0.5) * 6;
    } else if (activeFault === 'drift') {
      const driftOffset = (simTime % 10) * 2;
      fullJ1 += driftOffset;
      fullJ2 -= driftOffset;
    } else if (activeFault === 'stiction') {
      // Simulate "sticking" at specific intervals
      if (Math.abs(Math.sin(simTime * 2)) > 0.8) {
        fullJ1 = chartData.length > 0 ? chartData[chartData.length-1].full : fullJ1;
        fullJ2 = chartData.length > 0 ? chartData[chartData.length-1].joint2_full : fullJ2;
      }
    }

    // ROM Approximation (The "Twin" tries to follow smoothly)
    const romJ1 = 45 + Math.sin(simTime * freq1 - 0.02) * 29.8;
    const romJ2 = -20 + Math.cos(simTime * freq2 - 0.01) * 14.9;
    
    // Reconstruction Error Calculation
    const error = Math.sqrt(Math.pow(fullJ1 - romJ1, 2) + Math.pow(fullJ2 - romJ2, 2));

    const newPoint = {
      time: simTime.toFixed(2),
      timestamp: simTime.toFixed(2),
      full: fullJ1,
      rom: romJ1,
      joint2_full: fullJ2,
      joint2_rom: romJ2,
      error: error
    };

    setChartData(prev => {
      const next = [...prev, newPoint];
      return next.length > 200 ? next.slice(next.length - 200) : next;
    });
  }, [simTime, speed, activeFault]);

  const latest = chartData[chartData.length - 1] || { 
    full: 45, 
    rom: 45, 
    joint2_full: -20, 
    joint2_rom: -20, 
    error: 0 
  };

  const fullModelStates = config?.full_model_states || 12;
  const romStates = config?.rom_states || 4;
  const reductionPercent = Math.round((1 - romStates / fullModelStates) * 100);

  const fullStats = { 
    states: fullModelStates, 
    computeTime: 45.2, 
    memory: '256KB', 
    accuracy: '100.0%' 
  };
  
  const romStatsObj = { 
    states: romStates, 
    computeTime: parseFloat((8.7 * speed).toFixed(1)), 
    memory: '48KB', 
    accuracy: '99.2%' 
  };

  const handleInjectFault = () => {
    if (activeFault) {
      setActiveFault(null);
    } else {
      const faults = ['vibration', 'drift', 'stiction'];
      setActiveFault(faults[Math.floor(Math.random() * faults.length)]);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-fuchsia-500 uppercase tracking-[0.3em] mb-1">
            <Activity size={10} /> Solver Fidelity Benchmark
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tighter">Physics Simulation</h2>
        </div>
        <div className="flex gap-2">
          <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 transition-all duration-500 ${
            activeFault 
            ? 'bg-red-500/10 text-red-400 border-red-500/30' 
            : isRunning 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-slate-900 text-slate-500 border-slate-800'
          }`}>
            {activeFault ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                System Fault Detected
              </>
            ) : isRunning ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Solver
              </>
            ) : (
              'Paused'
            )}
          </div>
          <div className="px-5 py-2 rounded-2xl bg-slate-950 text-slate-400 border border-slate-800 text-[10px] font-black uppercase tracking-widest shadow-inner">
            Epoch: <span className="text-white font-mono ml-2">{(simTime * 20).toFixed(0)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/40 p-5 rounded-3xl border border-slate-800/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-slate-500 group-hover:scale-110 transition-transform">
                <Hash size={40} />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Source Dimension</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white tracking-tighter">{fullModelStates}</span>
                <span className="text-[10px] font-bold text-slate-600">NODES</span>
              </div>
            </div>
            
            <div className="bg-cyan-500/5 p-5 rounded-3xl border border-cyan-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-cyan-500 group-hover:scale-110 transition-transform">
                <Binary size={40} />
              </div>
              <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-2">ROM Embedding</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white tracking-tighter">{romStates}</span>
                <span className="text-[10px] font-bold text-cyan-600">MODES</span>
              </div>
            </div>

            <div className="bg-emerald-500/5 p-5 rounded-3xl border border-emerald-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-500 group-hover:scale-110 transition-transform">
                <ArrowDownRight size={40} />
              </div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Solve Efficiency</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-emerald-400 tracking-tighter">-{reductionPercent}%</span>
                <span className="text-[10px] font-bold text-emerald-600">CYCLES</span>
              </div>
            </div>
          </div>

          <div className={`bg-slate-950/60 p-6 rounded-[2.5rem] border shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-3xl relative overflow-hidden group transition-all duration-500 ${activeFault ? 'border-red-500/40' : 'border-slate-800'}`}>
            <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors ${activeFault ? 'bg-red-500 animate-pulse' : 'bg-cyan-500/50 group-hover:bg-cyan-400'}`} />
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-[1.5rem] border shadow-xl transition-colors ${activeFault ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-slate-900 border-slate-800 text-cyan-400'}`}>
                {activeFault ? <AlertCircle size={28} /> : <ShieldCheck size={28} />}
              </div>
              <div>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-1 ${activeFault ? 'text-red-400' : 'text-slate-400'}`}>
                  {activeFault ? 'ABNORMAL KINEMATICS' : 'Stability Analysis'}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">Reconstruction Error: <span className={activeFault ? 'text-red-400' : 'text-cyan-400'}>{(latest.error || 0).toFixed(4)}°</span></p>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center gap-12 w-full px-8">
              <div className="h-1.5 flex-1 bg-slate-900 rounded-full overflow-hidden relative">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${activeFault ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-cyan-600 to-cyan-400'}`}
                  style={{ width: `${reductionPercent}%` }}
                />
              </div>
              <div className="text-center">
                 <span className={`text-[10px] font-black bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 shadow-xl tracking-widest uppercase ${activeFault ? 'text-red-400 border-red-500/20' : 'text-white'}`}>
                   {activeFault ? 'FAULT ACTIVE' : `${reductionPercent}% Compression`}
                 </span>
              </div>
            </div>
          </div>

          <RoboticArmVisualization 
            joint1Angle={latest.full} 
            joint2Angle={latest.joint2_full} 
            isAnimating={isRunning}
            temperature={activeFault ? 48 : 38}
          />

          <div className="bg-slate-950/50 p-6 rounded-[2.5rem] border border-slate-800 space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/50 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <Layers size={16} className="text-cyan-400" />
                </div>
                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Scientific Visualizer</h3>
              </div>
              <div className="flex gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner">
                {[
                  { id: 'comparison', label: 'DYNAMICS' },
                  { id: 'response', label: 'ERROR' }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-5 py-2 rounded-xl text-[9px] font-black tracking-widest transition-all ${activeTab === tab.id ? 'bg-slate-800 text-white shadow-xl border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-[340px]">
              {activeTab === 'comparison' && <ROMComparisonChart data={chartData} title="Kinematic Trajectory Correlation" />}
              {activeTab === 'response' && (
                <SensorChart 
                  data={chartData} 
                  title="Residual Manifold Error (L2-Norm)" 
                  dataKey="error" 
                  color={activeFault ? "#ef4444" : "#f43f5e"} 
                  unit="°" 
                />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <SimulationControls 
            isRunning={isRunning}
            onToggleRun={() => setIsRunning(!isRunning)}
            onReset={() => {
              setSimTime(0);
              setChartData([]);
              setIsRunning(false);
              setActiveFault(null);
            }}
            speed={speed}
            onSpeedChange={setSpeed}
            onInjectFault={handleInjectFault}
            activeFault={activeFault}
          />

          <div className="bg-slate-950/40 p-6 rounded-3xl border border-slate-800 space-y-6 shadow-2xl backdrop-blur-md">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Cpu size={14} className="text-cyan-400" /> Edge Performance
            </h3>
            <ModelComparison fullModelStats={fullStats} romStats={romStatsObj} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
