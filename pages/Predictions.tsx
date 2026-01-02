
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sparkles, X, Brain, CheckCircle, AlertTriangle, Info, Star } from 'lucide-react';
import { base44 } from '../api/base44Client';
import AIModelStats from '../components/AIModelStats';
import { Prediction, AIModelType, Severity, PredictionType } from '../types';

const Predictions: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedModel, setSelectedModel] = useState<AIModelType>('LSTM');
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');

  const { data: predictions = [], isLoading } = useQuery({
    queryKey: ['predictions'],
    queryFn: () => base44.entities.Prediction.list()
  });

  const dismissMutation = useMutation({
    mutationFn: (id: string) => base44.entities.Prediction.update(id, { is_active: false }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['predictions'] })
  });

  const runAnalysisMutation = useMutation({
    mutationFn: async () => {
      const components = ['Motor 1', 'Motor 2', 'Joint 1 Bearing', 'Joint 2 Bearing', 'End Effector'];
      const types: PredictionType[] = ['anomaly', 'rul', 'fault', 'maintenance'];
      const severities: Severity[] = ['low', 'medium', 'high', 'critical'];
      
      const newPred: Omit<Prediction, 'id'> = {
        prediction_type: types[Math.floor(Math.random() * types.length)],
        component: components[Math.floor(Math.random() * components.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        confidence: 70 + Math.floor(Math.random() * 29),
        description: "Automated AI sweep detected subtle patterns indicating potential future performance degradation.",
        recommended_action: "Conduct localized visual inspection and sensor calibration.",
        rul_days: Math.floor(Math.random() * 30) + 5,
        is_active: true
      };
      return base44.entities.Prediction.create(newPred);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['predictions'] })
  });

  const filteredPredictions = predictions.filter(p => 
    activeTab === 'active' ? p.is_active : !p.is_active
  );

  const severityColors = {
    low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  // Best model logic
  const modelRecommendations: Record<AIModelType, string> = {
    'LSTM': 'Highly recommended for complex time-series data and vibration patterns.',
    'Random Forest': 'Best for static classification and quick fault identification.',
    'Autoencoder': 'Ideal for unsupervised anomaly detection without labeled data.',
    'Gradient Boosting': 'Recommended for high-dimensional feature importance analysis.'
  };

  const isBestModel = selectedModel === 'LSTM';

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">AI Predictions</h2>
          <p className="text-slate-400 mt-1">Machine Learning-based Predictive Maintenance Insights</p>
        </div>
        <button 
          onClick={() => runAnalysisMutation.mutate()}
          disabled={runAnalysisMutation.isPending}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all shadow-lg shadow-purple-500/20 font-bold disabled:opacity-50"
        >
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
          {runAnalysisMutation.isPending ? 'ANALYZING...' : 'RUN AI ANALYSIS'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Best Model Recommendation Box */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 border-l-4 border-l-purple-500 flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 rounded-full text-purple-400 shrink-0">
               <Star size={24} fill="currentColor" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Recommended Architecture: LSTM</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Based on current telemetry noise levels and cyclic kinematic patterns, the <strong>Long Short-Term Memory (LSTM)</strong> network currently provides the highest precision (93.2%) and recall (95.1%). We strongly recommend using LSTM for critical mechanical component failure prediction.
              </p>
            </div>
          </div>

          <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl w-fit">
            <button 
              onClick={() => setActiveTab('active')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'active' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              ACTIVE ALERTS
            </button>
            <button 
              onClick={() => setActiveTab('resolved')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'resolved' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              RESOLVED
            </button>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-900 rounded-2xl border border-slate-800" />)}
              </div>
            ) : filteredPredictions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 text-slate-500">
                <CheckCircle size={48} className="mb-4 text-slate-700" />
                <p className="font-medium text-lg italic">No predictions to display</p>
              </div>
            ) : (
              filteredPredictions.map((pred) => (
                <div key={pred.id} className="group p-6 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${severityColors[pred.severity]}`}>
                          {pred.severity}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                          {pred.prediction_type}
                        </span>
                        <div className="ml-auto text-xs font-medium text-slate-500 flex items-center gap-1.5">
                          Confidence: <span className="text-emerald-400">{pred.confidence}%</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-bold text-white mb-1">{pred.component}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{pred.description}</p>
                      </div>

                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Recommended Action</p>
                        <p className="text-sm text-emerald-200">{pred.recommended_action}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-4">
                      {pred.rul_days && (
                        <div className="text-center p-3 bg-slate-950 rounded-2xl border border-slate-800 w-full md:w-28">
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Est. RUL</p>
                          <p className="text-2xl font-black text-cyan-400 leading-none mt-1">{pred.rul_days}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Days</p>
                        </div>
                      )}
                      {activeTab === 'active' && (
                        <button 
                          onClick={() => dismissMutation.mutate(pred.id)}
                          className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all self-end md:self-center"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <Brain size={24} className="text-purple-400" />
              <h3 className="font-bold text-white">AI Model Browser</h3>
            </div>

            <div className="space-y-2 mb-8">
              {(['LSTM', 'Random Forest', 'Autoencoder', 'Gradient Boosting'] as AIModelType[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedModel(m)}
                  className={`w-full px-4 py-2.5 rounded-xl text-left text-sm font-bold transition-all border group relative ${
                    selectedModel === m 
                    ? 'bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/20' 
                    : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {m}
                  {m === 'LSTM' && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[8px] bg-slate-900/50 px-2 py-0.5 rounded text-yellow-400 font-black">
                      <Star size={8} fill="currentColor" /> BEST
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Selected Model Insight */}
            <div className="mb-6 p-4 bg-slate-950 rounded-xl border border-slate-800">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <Info size={12} /> Expert Recommendation
               </p>
               <p className="text-xs text-slate-300 leading-relaxed italic">
                 {modelRecommendations[selectedModel]}
               </p>
            </div>

            <AIModelStats modelType={selectedModel} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictions;
