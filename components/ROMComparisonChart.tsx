
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Brush, Label
} from 'recharts';

interface ROMComparisonChartProps {
  data: any[];
  title: string;
}

const ROMComparisonChart: React.FC<ROMComparisonChartProps> = ({ data, title }) => {
  return (
    <div className="bg-slate-950/40 p-4 rounded-2xl h-[400px] flex flex-col border border-slate-800/50">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">{title}</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-fuchsia-400" />
            <span className="text-[9px] font-bold text-slate-300 uppercase">Physics</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-[9px] font-bold text-cyan-400 uppercase">ROM Agent</span>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="#94a3b8" 
              fontSize={10} 
              tick={{ fill: '#cbd5e1' }}
              axisLine={{ stroke: '#475569' }}
              tickLine={false}
              minTickGap={40}
            >
              <Label value="Simulation Time (s)" offset={-15} position="insideBottom" fill="#94a3b8" fontSize={10} fontWeight="bold" />
            </XAxis>
            <YAxis 
              stroke="#94a3b8" 
              fontSize={10} 
              domain={['auto', 'auto']} 
              axisLine={{ stroke: '#475569' }}
              tickLine={false}
              tick={{ fill: '#cbd5e1' }}
            >
              <Label value="Angle (°)" angle={-90} position="insideLeft" offset={-10} fill="#94a3b8" fontSize={10} fontWeight="bold" />
            </YAxis>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                borderColor: '#334155', 
                borderRadius: '12px',
                fontSize: '11px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(10px)',
                color: '#f8fafc',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
              labelStyle={{ color: '#22d3ee', marginBottom: '4px', fontWeight: 'bold' }}
              itemStyle={{ padding: '2px 0' }}
              formatter={(value: number) => [`${value.toFixed(2)}°`, '']}
              labelFormatter={(label) => `Sim Time: ${label}s`}
            />
            <Legend 
              verticalAlign="top" 
              align="right"
              iconType="circle"
              formatter={(value) => <span style={{ color: '#e2e8f0', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{value}</span>}
              wrapperStyle={{ paddingBottom: '20px' }}
            />
            <Line 
              type="monotone" 
              dataKey="full" 
              stroke="#f472b6" 
              name="J1 Physics" 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={false}
            />
            <Line 
              type="monotone" 
              dataKey="rom" 
              stroke="#22d3ee" 
              name="J1 ROM" 
              strokeDasharray="4 4" 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={false}
            />
            <Line 
              type="monotone" 
              dataKey="joint2_full" 
              stroke="#a855f7" 
              name="J2 Physics" 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={false}
            />
            <Line 
              type="monotone" 
              dataKey="joint2_rom" 
              stroke="#6366f1" 
              name="J2 ROM" 
              strokeDasharray="4 4" 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={false}
            />
            <Brush 
              dataKey="time" 
              height={30} 
              stroke="#334155" 
              fill="#0f172a" 
              travellerWidth={10}
              gap={5}
              alwaysShowText={false}
            >
              <LineChart>
                <Line dataKey="rom" stroke="#22d3ee" dot={false} isAnimationActive={false} />
              </LineChart>
            </Brush>
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-[8px] text-slate-400 font-bold uppercase text-center tracking-widest opacity-60">
        Interaction: Drag Slider to Zoom • Shift-Drag to Pan
      </div>
    </div>
  );
};

export default ROMComparisonChart;
