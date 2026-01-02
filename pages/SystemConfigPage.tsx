
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings, Save, RotateCcw, Cpu, Layers, Target, Info } from 'lucide-react';
import { base44 } from '../api/base44Client';
import { SystemConfig, AIModelType } from '../types';

const SystemConfigPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [localConfig, setLocalConfig] = useState<SystemConfig | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  const { data: config } = useQuery({
    queryKey: ['system_config'],
    queryFn: () => base44.entities.SystemConfig.get()
  });

  useEffect(() => {
    if (config) setLocalConfig(config);
  }, [config]);

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<SystemConfig>) => base44.entities.SystemConfig.update(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_config'] });
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    }
  });

  if (!localConfig) return null;

  const handleSave = () => {
    updateMutation.mutate(localConfig);
  };

  const resetToDefaults = () => {
    setLocalConfig({
      id: 'default',
      system_name: "2-DOF Robotic Arm",
      link1_mass: 2.5,
      link2_mass: 1.5,
      link1_length: 0.5,
      link2_length: 0.4,
      rom_states: 4,
      full_model_states: 12,
      ai_model_type: "LSTM",
      prediction_threshold: 0.75
    });
  };

  const reductionPercent = Math.round((1 - (localConfig.rom_states / localConfig.full_model_states)) * 100);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">System Configuration</h2>
          <p className="text-slate-400 mt-1">Fine-tune physics, model architecture, and AI thresholds</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={resetToDefaults}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all border border-slate-700"
          >
            <RotateCcw size={18} />
            RESET
          </button>
          <button 
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20"
          >
            <Save size={18} />
            {updateMutation.isPending ? 'SAVING...' : 'SAVE CONFIG'}
          </button>
        </div>
      </div>

      {showSaved && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400 flex items-center justify-between animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2">
            <Info size={20} />
            <span>Configuration updated and deployed successfully to all edge instances.</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Physical Params */}
          <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 space-y-8 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
                <Layers size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">Physical Parameters</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Name</label>
                <input 
                  value={localConfig.system_name}
                  onChange={e => setLocalConfig({...localConfig, system_name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500" 
                />
              </div>

              {[
                { key: 'link1_mass', label: 'Link 1 Mass', min: 0.5, max: 5, unit: 'kg' },
                { key: 'link2_mass', label: 'Link 2 Mass', min: 0.5, max: 5, unit: 'kg' },
                { key: 'link1_length', label: 'Link 1 Length', min: 0.2, max: 1, unit: 'm' },
                { key: 'link2_length', label: 'Link 2 Length', min: 0.2, max: 1, unit: 'm' },
              ].map(item => (
                <div key={item.key} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</label>
                    <span className="text-sm font-bold text-cyan-400">{localConfig[item.key as keyof SystemConfig]} {item.unit}</span>
                  </div>
                  <input 
                    type="range"
                    min={item.min}
                    max={item.max}
                    step="0.1"
                    value={localConfig[item.key as keyof SystemConfig] as number}
                    onChange={e => setLocalConfig({...localConfig, [item.key]: parseFloat(e.target.value)})}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Model Configuration */}
          <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 space-y-8 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                <Cpu size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">Model Architecture</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Model State Count</label>
                  <span className="text-sm font-bold text-white">{localConfig.full_model_states} states</span>
                </div>
                <input 
                  type="range"
                  min="6"
                  max="24"
                  step="1"
                  value={localConfig.full_model_states}
                  onChange={e => setLocalConfig({...localConfig, full_model_states: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">ROM Reduction States</label>
                  <span className="text-sm font-bold text-cyan-400">{localConfig.rom_states} states</span>
                </div>
                <input 
                  type="range"
                  min="2"
                  max="8"
                  step="1"
                  value={localConfig.rom_states}
                  onChange={e => setLocalConfig({...localConfig, rom_states: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl flex items-center justify-between">
                <span className="text-sm text-slate-400">Order Reduction Potential</span>
                <span className="text-2xl font-black text-cyan-400">-{reductionPercent}%</span>
              </div>
            </div>
          </div>

          {/* AI Settings */}
          <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 space-y-8 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                <Target size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">AI Engine Settings</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Primary Model Type</label>
                <select 
                  value={localConfig.ai_model_type}
                  onChange={e => setLocalConfig({...localConfig, ai_model_type: e.target.value as AIModelType})}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  <option>LSTM</option>
                  <option>Random Forest</option>
                  <option>Autoencoder</option>
                  <option>Gradient Boosting</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Prediction Threshold</label>
                  <span className="text-sm font-bold text-amber-400">{Math.round(localConfig.prediction_threshold * 100)}%</span>
                </div>
                <input 
                  type="range"
                  min="0.5"
                  max="0.95"
                  step="0.05"
                  value={localConfig.prediction_threshold}
                  onChange={e => setLocalConfig({...localConfig, prediction_threshold: parseFloat(e.target.value)})}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                  Confidence level required before the AI triggers a formal maintenance alert in the system dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfigPage;
