
import React from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface PhasePortraitChartProps {
  data: any[];
  title: string;
}

const PhasePortraitChart: React.FC<PhasePortraitChartProps> = ({ data, title }) => {
  return (
    <div className="bg-slate-950/40 p-4 rounded-2xl h-[420px] flex flex-col border border-slate-800/50 shadow-inner">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">{title}</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <span className="text-[9px] font-bold text-slate-400 uppercase">J1 Mode</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
            <span className="text-[9px] font-bold text-slate-400 uppercase">J2 Mode</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative">
        {/* Background Oscilloscope Grid Lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
           <div className="w-full h-px bg-slate-700" />
           <div className="h-full w-px bg-slate-700" />
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="1 1" stroke="#334155" opacity={0.2} vertical={true} horizontal={true} />
            <XAxis 
              type="number" 
              dataKey="rom" 
              name="Position" 
              unit="°" 
              stroke="#94a3b8" 
              fontSize={10} 
              axisLine={{ stroke: '#475569' }}
              tickLine={false}
              tick={{ fill: '#cbd5e1' }}
              domain={['auto', 'auto']}
              label={{ value: 'θ (Angular Position)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
            />
            <YAxis 
              type="number" 
              dataKey="velocity" 
              name="Velocity" 
              unit="°/s" 
              stroke="#94a3b8" 
              fontSize={10}
              axisLine={{ stroke: '#475569' }}
              tickLine={false}
              tick={{ fill: '#cbd5e1' }}
              domain={['auto', 'auto']}
              label={{ value: 'ω (Angular Velocity)', angle: -90, position: 'insideLeft', offset: 10, fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
            />
            <ZAxis type="number" range={[20, 20]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)' }} 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                borderColor: '#334155', 
                borderRadius: '10px', 
                fontSize: '10px',
                color: '#f8fafc',
                backdropFilter: 'blur(10px)'
              }}
              formatter={(value: any, name: string) => [`${parseFloat(value).toFixed(2)}`, name]}
            />
            
            {/* Joint 1 Limit Cycle */}
            <Scatter 
              name="Base Joint (J1)" 
              data={data} 
              fill="#22d3ee" 
              line={{ stroke: '#22d3ee', strokeWidth: 1.5, opacity: 0.8 }}
              shape="circle"
              isAnimationActive={false}
            />

            {/* Joint 2 Limit Cycle */}
            <Scatter 
              name="Elbow Joint (J2)" 
              data={data.map(d => ({ ...d, rom: d.joint2_rom, velocity: d.velocity2 }))} 
              fill="#d946ef" 
              line={{ stroke: '#d946ef', strokeWidth: 1.5, opacity: 0.8 }}
              shape="circle"
              isAnimationActive={false}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 px-2 border-t border-slate-800/50 pt-4">
        <div className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter leading-relaxed">
          The phase portrait represents the system's state trajectory. Closed loops indicate stable periodic motion (Limit Cycles).
        </div>
        <div className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter text-right flex items-center justify-end gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Stability Index: Optimal (λ &lt; 0)
        </div>
      </div>
    </div>
  );
};

export default PhasePortraitChart;
