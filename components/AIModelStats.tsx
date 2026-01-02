
import React from 'react';
import { Target, Activity, Clock, Layers } from 'lucide-react';
import { AIModelType } from '../types';

interface AIModelStatsProps {
  modelType: AIModelType;
}

const AIModelStats: React.FC<AIModelStatsProps> = ({ modelType }) => {
  const statsMap: Record<AIModelType, any> = {
    'LSTM': { accuracy: 94.7, precision: 93.2, recall: 95.1, f1: 94.1, samples: 12500, paramLabel: 'Epochs', paramValue: 150 },
    'Random Forest': { accuracy: 91.2, precision: 89.4, recall: 90.5, f1: 89.9, samples: 12500, paramLabel: 'Estimators', paramValue: 500 },
    'Autoencoder': { accuracy: 93.1, precision: 92.5, recall: 91.8, f1: 92.1, samples: 12500, paramLabel: 'Latent Dim', paramValue: 16 },
    'Gradient Boosting': { accuracy: 92.8, precision: 93.1, recall: 91.5, f1: 92.3, samples: 12500, paramLabel: 'Max Depth', paramValue: 12 }
  };

  const s = statsMap[modelType];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Accuracy', value: `${s.accuracy}%`, icon: Target, color: 'text-emerald-400' },
          { label: 'Precision', value: `${s.precision}%`, icon: Activity, color: 'text-cyan-400' },
          { label: 'Recall', value: `${s.recall}%`, icon: Clock, color: 'text-purple-400' },
          { label: 'F1 Score', value: `${s.f1}%`, icon: Layers, color: 'text-amber-400' }
        ].map((item) => (
          <div key={item.label} className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
            <div className={`p-1.5 rounded-lg bg-slate-900 w-fit mb-2 ${item.color}`}>
              <item.icon size={16} />
            </div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{item.label}</p>
            <p className="text-xl font-bold text-white mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Training Metrics</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Training Samples</span>
            <span className="text-sm font-bold text-white">{s.samples.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">{s.paramLabel}</span>
            <span className="text-sm font-bold text-white">{s.paramValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModelStats;
