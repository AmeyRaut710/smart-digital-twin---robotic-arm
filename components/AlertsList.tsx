
import React from 'react';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Prediction } from '../types';

interface AlertsListProps {
  predictions: Prediction[];
}

const AlertsList: React.FC<AlertsListProps> = ({ predictions }) => {
  const activeAlerts = predictions.filter(p => p.is_active);

  const severityStyles = {
    low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  if (activeAlerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500 bg-slate-900/40 rounded-2xl border border-dashed border-slate-700">
        <CheckCircle size={40} className="mb-3 text-emerald-500/40" />
        <p className="font-medium">No active alerts</p>
        <p className="text-xs">System health is optimal</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activeAlerts.map((alert) => (
        <div 
          key={alert.id}
          className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${severityStyles[alert.severity]}`}>
                  {alert.severity}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{alert.prediction_type}</span>
              </div>
              <h4 className="text-sm font-semibold text-white">{alert.component}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{alert.description}</p>
            </div>
            <div className="p-2 bg-slate-900 rounded-lg text-slate-400">
              <AlertTriangle size={18} className={alert.severity === 'critical' ? 'text-red-400' : 'text-amber-400'} />
            </div>
          </div>
          {alert.rul_days && (
            <div className="mt-3 flex items-center gap-2 text-[10px] font-medium text-slate-500 uppercase">
              <Clock size={12} />
              Est. RUL: {alert.rul_days} days
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AlertsList;
