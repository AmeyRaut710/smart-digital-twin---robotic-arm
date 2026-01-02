
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heart, Zap, Thermometer, Activity, Brain, Gauge, ArrowUpRight, Monitor } from 'lucide-react';
import { base44 } from '../api/base44Client';
import SystemHealthCard from '../components/SystemHealthCard';
import RoboticArmVisualization from '../components/RoboticArmVisualization';
import SensorGauge from '../components/SensorGauge';
import AlertsList from '../components/AlertsList';
import SensorChart from '../components/SensorChart';
import VibrationSpectrum from '../components/VibrationSpectrum';
import ROMComparisonChart from '../components/ROMComparisonChart';
import { SensorReading } from '../types';

const Dashboard: React.FC = () => {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [overlayData, setOverlayData] = useState<any[]>([]);
  const [time, setTime] = useState(0);

  const { data: predictions = [] } = useQuery({
    queryKey: ['predictions'],
    queryFn: () => base44.entities.Prediction.list(),
    refetchInterval: 5000
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 0.1);
      
      const j1 = 45 + Math.sin(time) * 25 + Math.cos(time * 0.5) * 5;
      const j2 = -30 + Math.cos(time * 0.8) * 20 + Math.sin(time * 1.2) * 8;
      
      const rom_j1 = 45 + Math.sin(time - 0.05) * 24.8 + (Math.random() * 0.3);
      const rom_j2 = -30 + Math.cos(time * 0.8 - 0.03) * 19.8 + (Math.random() * 0.2);

      const vibBase = 2.5 + (Math.sin(time * 2.5) * 0.8);
      const vib = vibBase + Math.random() * 0.4;
      const temp = 38.5 + (Math.sin(time * 0.3) * 2.5) + (vib > 4 ? 2 : 0);
      const cur1 = 4.2 + Math.abs(Math.sin(time)) * 2 + (vib * 0.2);
      const cur2 = 3.1 + Math.abs(Math.cos(time * 0.7)) * 1.5;
      
      let health = 98.2;
      if (vib > 4.5) health -= 8;
      if (temp > 42) health -= 12;
      health -= Math.random() * 0.5;

      const newReading: SensorReading = {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        motor_current_1: cur1,
        motor_current_2: cur2,
        joint_angle_1: j1,
        joint_angle_2: j2,
        velocity_1: Math.cos(time) * 5,
        velocity_2: -Math.sin(time) * 4,
        vibration: vib,
        temperature: temp,
        health_score: Math.max(0, health)
      };

      setReadings(prev => {
        const next = [...prev, newReading];
        return next.length > 30 ? next.slice(next.length - 30) : next;
      });

      setOverlayData(prev => {
        const next = [...prev, {
          time: time.toFixed(1),
          full: j1,
          rom: rom_j1,
          joint2_full: j2,
          joint2_rom: rom_j2
        }];
        return next.length > 40 ? next.slice(next.length - 40) : next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [time]);

  const latest = readings[readings.length - 1] || {
    health_score: 98.5,
    motor_current_1: 4.2,
    motor_current_2: 3.1,
    temperature: 38.5,
    vibration: 2.8,
    joint_angle_1: 45,
    joint_angle_2: -30
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em]">
            <Activity size={10} /> Live Digital Twin Telemetry
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tighter">Operational Overview</h2>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              <div className="text-right">
                 <p className="text-[8px] font-bold text-slate-400 uppercase">Twin Synchronicity</p>
                 <p className="text-xs font-bold text-white">99.8% Sync</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SystemHealthCard 
          title="System Health" 
          value={latest.health_score.toFixed(1)} 
          unit="%" 
          icon={Heart} 
          trend={1.2} 
          status={latest.health_score > 90 ? 'healthy' : latest.health_score > 70 ? 'warning' : 'critical'}
        />
        <SystemHealthCard 
          title="Drive Potential" 
          value={latest.motor_current_1.toFixed(1)} 
          unit="V" 
          icon={Zap} 
          trend={-2.1}
        />
        <SystemHealthCard 
          title="Surface Temp" 
          value={latest.temperature.toFixed(1)} 
          unit="°C" 
          icon={Thermometer} 
          status={latest.temperature > 40 ? 'warning' : 'healthy'}
        />
        <SystemHealthCard 
          title="Peak Vibration" 
          value={latest.vibration.toFixed(2)} 
          unit="g-rms" 
          icon={Activity} 
          status={latest.vibration > 5.5 ? 'critical' : 'healthy'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative group">
            <RoboticArmVisualization 
              joint1Angle={latest.joint_angle_1} 
              joint2Angle={latest.joint_angle_2} 
              isAnimating={true}
              temperature={latest.temperature}
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <div className="px-5 py-3 rounded-2xl bg-slate-950/90 border border-slate-700/50 backdrop-blur-2xl shadow-2xl">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Live Resolver Feedback</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-cyan-400 font-mono text-lg font-bold">{latest.joint_angle_1.toFixed(1)}°</p>
                  <ArrowUpRight size={12} className="text-slate-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-fuchsia-500/10 rounded-xl">
                 <Monitor className="text-fuchsia-400" size={18} />
               </div>
               <h3 className="text-xs font-bold text-slate-200 uppercase tracking-[0.2em]">Twin Correlation Overlay</h3>
            </div>
            <ROMComparisonChart data={overlayData} title="Real-Time Kinematic Synchronization" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VibrationSpectrum vibrationLevel={latest.vibration} />
            <SensorChart 
              data={readings} 
              title="Phase Potential (V)" 
              dataKey="motor_current_1" 
              color="#d946ef" 
              unit="V" 
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-950/40 rounded-3xl border border-slate-800/50 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500/10 rounded-xl">
                  <Brain className="text-purple-400" size={18} />
                </div>
                <h3 className="font-bold text-slate-100 text-sm tracking-tight">AI Diagnostics Feed</h3>
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-ping" />
            </div>
            <AlertsList predictions={predictions} />
          </div>

          <div className="bg-slate-950/40 rounded-3xl border border-slate-800/50 p-6 space-y-6 shadow-2xl backdrop-blur-xl">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Gauge size={14} className="text-cyan-400" /> Boundary Conditions
            </h3>
            <div className="space-y-6">
              <SensorGauge 
                label="Primary Motor Temp" 
                value={latest.temperature} 
                min={20} 
                max={60} 
                unit="°C" 
                warningThreshold={40} 
                criticalThreshold={50} 
              />
              <SensorGauge 
                label="Axial Acceleration" 
                value={latest.vibration} 
                min={0} 
                max={10} 
                unit="g" 
                warningThreshold={5.5} 
                criticalThreshold={7.5} 
              />
              <SensorGauge 
                label="Inverter Voltage" 
                value={48.2 + (Math.random() * 0.4)} 
                min={40} 
                max={60} 
                unit="V" 
                warningThreshold={55} 
                criticalThreshold={58} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
