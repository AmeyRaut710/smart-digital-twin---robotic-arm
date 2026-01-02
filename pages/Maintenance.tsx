
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, CheckCircle, Clock, Calendar, AlertTriangle, Filter, Wrench, X, Bell } from 'lucide-react';
import { base44 } from '../api/base44Client';
import MaintenanceCard from '../components/MaintenanceCard';
import { MaintenanceTask, Priority, TaskStatus } from '../types';

const Maintenance: React.FC = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deadlineAlerts, setDeadlineAlerts] = useState<MaintenanceTask[]>([]);
  
  const [formData, setFormData] = useState<Partial<MaintenanceTask>>({
    title: '',
    component: 'Motor 1',
    priority: 'medium',
    scheduled_date: new Date().toISOString().split('T')[0],
    estimated_duration: 1,
    notes: 'Routine inspection and diagnostic verification.',
    status: 'scheduled',
    triggered_by_ai: false
  });

  const maintenanceNotesOptions = [
    "Routine inspection and diagnostic verification.",
    "Component reaching end-of-life; urgent replacement required.",
    "Minor calibration adjustment based on sensor drift.",
    "AI-triggered preventative maintenance check.",
    "Localized cleaning and lubrication of joint surfaces.",
    "Software firmware update and safety loop test.",
    "Corrective repair following detected torque anomaly.",
    "Quarterly deep-system integrity audit."
  ];

  const { data: tasks = [] } = useQuery({
    queryKey: ['maintenance_tasks'],
    queryFn: () => base44.entities.MaintenanceTask.list()
  });

  // Check for overdue tasks
  useEffect(() => {
    if (tasks.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const overdue = tasks.filter(t => t.status !== 'completed' && t.scheduled_date < today);
      if (overdue.length > 0) {
        setDeadlineAlerts(overdue);
      }
    }
  }, [tasks]);

  const createMutation = useMutation({
    mutationFn: (newTask: Omit<MaintenanceTask, 'id'>) => base44.entities.MaintenanceTask.create(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
      setIsFormOpen(false);
      setSuccessMessage("Maintenance task successfully registered in the ledger.");
      setTimeout(() => setSuccessMessage(null), 5000);
      setFormData({
        title: '',
        component: 'Motor 1',
        priority: 'medium',
        scheduled_date: new Date().toISOString().split('T')[0],
        estimated_duration: 1,
        notes: 'Routine inspection and diagnostic verification.',
        status: 'scheduled',
        triggered_by_ai: false
      });
    }
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => base44.entities.MaintenanceTask.update(id, { status: 'completed' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] })
  });

  const upcomingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const stats = {
    scheduled: tasks.filter(t => t.status === 'scheduled').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
  };

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Save Success Alert */}
      {successMessage && (
        <div className="fixed top-20 right-8 z-50 animate-in slide-in-from-right fade-in">
          <div className="bg-emerald-500/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/50">
            <CheckCircle size={20} />
            <span className="font-bold text-sm tracking-tight">{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)}><X size={16} /></button>
          </div>
        </div>
      )}

      {/* Overdue Deadlines Popup */}
      {deadlineAlerts.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="bg-slate-900 border border-red-500/50 rounded-[2.5rem] p-8 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.2)] animate-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-red-500/10 rounded-full text-red-500 animate-pulse">
                <Bell size={40} />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Deadline Alert</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                System diagnostics indicate <span className="text-red-400 font-bold">{deadlineAlerts.length}</span> critical maintenance tasks have exceeded their scheduled deadlines. Immediate action is required to maintain kinematic integrity.
              </p>
              <div className="w-full bg-slate-950/50 rounded-2xl border border-slate-800 p-4 space-y-2 max-h-32 overflow-y-auto">
                {deadlineAlerts.map(t => (
                  <div key={t.id} className="text-left text-xs font-bold text-slate-300 flex justify-between">
                    <span>• {t.title}</span>
                    <span className="text-red-500">{t.scheduled_date}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setDeadlineAlerts([])}
                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-red-500/20"
              >
                Acknowledge Warnings
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Maintenance Schedule</h2>
          <p className="text-slate-400 mt-1">Resource planning for predictive & corrective actions</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition-all shadow-lg shadow-cyan-500/20 font-bold"
        >
          <Plus size={18} />
          NEW TASK
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Scheduled', value: stats.scheduled, icon: Calendar, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'In Progress', value: stats.in_progress, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' }
        ].map(s => (
          <div key={s.label} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.bg} ${s.color}`}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">{s.label}</p>
              <p className="text-xl font-bold text-white leading-none">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl space-y-6 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <Wrench size={24} className="text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Schedule Maintenance Task</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Task Title</label>
              <input 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500" 
                placeholder="Replace motor bearings..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Component</label>
              <select 
                value={formData.component}
                onChange={e => setFormData({...formData, component: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              >
                <option>Motor 1</option>
                <option>Motor 2</option>
                <option>Joint 1 Bearing</option>
                <option>Joint 2 Bearing</option>
                <option>End Effector</option>
                <option>Control System</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Priority</label>
              <select 
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value as Priority})}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Scheduled Date</label>
              <input 
                type="date"
                value={formData.scheduled_date}
                onChange={e => setFormData({...formData, scheduled_date: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Est. Duration (hrs)</label>
              <input 
                type="number"
                value={formData.estimated_duration}
                onChange={e => setFormData({...formData, estimated_duration: parseInt(e.target.value)})}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Maintenance Notes</label>
              <select 
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              >
                {maintenanceNotesOptions.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="px-6 py-2.5 text-slate-400 hover:text-white font-bold transition-all"
            >
              CANCEL
            </button>
            <button 
              onClick={() => createMutation.mutate(formData as Omit<MaintenanceTask, 'id'>)}
              className="px-8 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-cyan-500/20"
            >
              CREATE TASK
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Filter size={20} className="text-slate-500" />
            <h3 className="font-bold text-white uppercase tracking-widest text-sm">Upcoming Operations</h3>
          </div>
          <div className="space-y-4">
            {upcomingTasks.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl text-slate-500">
                <CheckCircle size={40} className="mx-auto mb-3 opacity-20" />
                <p>All clear! No upcoming maintenance.</p>
              </div>
            ) : (
              upcomingTasks.map(t => <MaintenanceCard key={t.id} task={t} onComplete={id => completeMutation.mutate(id)} />)
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-emerald-400" />
            <h3 className="font-bold text-white uppercase tracking-widest text-sm">Completed Logs</h3>
          </div>
          <div className="space-y-4">
            {completedTasks.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl text-slate-500">
                <p>No completed tasks yet.</p>
              </div>
            ) : (
              completedTasks.map(t => <MaintenanceCard key={t.id} task={t} onComplete={() => {}} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
