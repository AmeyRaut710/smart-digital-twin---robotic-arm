
import React from 'react';
import { LucideIcon, Activity } from 'lucide-react';

interface SystemHealthCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: number;
  status?: 'healthy' | 'warning' | 'critical';
}

const SystemHealthCard: React.FC<SystemHealthCardProps> = ({ 
  title, value, unit, icon: Icon, trend, status = 'healthy' 
}) => {
  const statusColors = {
    healthy: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-400 shadow-emerald-500/5',
    warning: 'from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-400 shadow-amber-500/5',
    critical: 'from-red-500/10 to-red-500/5 border-red-500/20 text-red-400 shadow-red-500/5',
  };

  const iconColors = {
    healthy: 'bg-emerald-500/10 text-emerald-400',
    warning: 'bg-amber-500/10 text-amber-400',
    critical: 'bg-red-500/10 text-red-400',
  };

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br border shadow-xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] ${statusColors[status]}`}>
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${iconColors[status]}`}>
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            <Activity size={12} className={trend < 0 ? 'rotate-180' : ''} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{title}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
          {unit && <span className="text-sm font-medium text-slate-500">{unit}</span>}
        </div>
      </div>
    </div>
  );
};

export default SystemHealthCard;
