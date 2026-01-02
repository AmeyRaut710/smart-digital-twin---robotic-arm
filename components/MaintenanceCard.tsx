
import React from 'react';
import { CheckCircle, Clock, Calendar, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { MaintenanceTask } from '../types';

interface MaintenanceCardProps {
  task: MaintenanceTask;
  onComplete: (id: string) => void;
}

const MaintenanceCard: React.FC<MaintenanceCardProps> = ({ task, onComplete }) => {
  const priorityColors = {
    low: 'border-emerald-500/30 bg-emerald-500/5',
    medium: 'border-cyan-500/30 bg-cyan-500/5',
    high: 'border-amber-500/30 bg-amber-500/5',
    urgent: 'border-red-500/30 bg-red-500/5',
  };

  const statusColors = {
    scheduled: 'bg-slate-800 text-slate-400',
    in_progress: 'bg-cyan-500/20 text-cyan-400',
    completed: 'bg-emerald-500/20 text-emerald-400',
    overdue: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all hover:shadow-lg ${priorityColors[task.priority]}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${statusColors[task.status]}`}>
                {task.status.replace('_', ' ')}
              </span>
              {task.triggered_by_ai && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider border border-purple-500/20">
                  <Sparkles size={10} /> AI Triggered
                </span>
              )}
            </div>
            <h4 className="text-lg font-bold text-white">{task.title}</h4>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">{task.component}</p>
          </div>
          {task.status !== 'completed' && (
            <button 
              onClick={() => onComplete(task.id)}
              className="p-2 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all"
              title="Mark as completed"
            >
              <CheckCircle size={24} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Calendar size={16} className="text-slate-600" />
            <span>{format(new Date(task.scheduled_date), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Clock size={16} className="text-slate-600" />
            <span>{task.estimated_duration} hours</span>
          </div>
        </div>

        {task.notes && (
          <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/50">
            <p className="text-xs text-slate-400 italic">"{task.notes}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceCard;
