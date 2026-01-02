
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Brush, Label 
} from 'recharts';

interface SensorChartProps {
  data: any[];
  title: string;
  dataKey: string;
  color: string;
  unit: string;
}

const SensorChart: React.FC<SensorChartProps> = ({ data, title, dataKey, color, unit }) => {
  return (
    <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 flex flex-col h-[400px] group hover:border-slate-700/50 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">{title}</h3>
        <div className="flex items-center gap-1.5">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
           <span className="text-[8px] font-bold text-emerald-400 uppercase">Live Telemetry</span>
        </div>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.3} />
            <XAxis 
              dataKey="timestamp" 
              stroke="#94a3b8"
              fontSize={10}
              tick={{ fill: '#cbd5e1' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
              minTickGap={40}
            >
              <Label value="Observation Time" offset={-15} position="insideBottom" fill="#94a3b8" fontSize={10} fontWeight="bold" />
            </XAxis>
            <YAxis 
              stroke="#94a3b8" 
              fontSize={10} 
              tickFormatter={(v) => `${v}`}
              domain={['auto', 'auto']}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
              tick={{ fill: '#cbd5e1' }}
            >
              <Label value={`Value (${unit})`} angle={-90} position="insideLeft" offset={0} fill="#94a3b8" fontSize={10} fontWeight="bold" />
            </YAxis>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                borderColor: '#334155', 
                borderRadius: '10px', 
                fontSize: '11px',
                color: '#f8fafc',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
              itemStyle={{ color: color, fontWeight: 'bold' }}
              labelStyle={{ color: '#94a3b8', fontSize: '10px', marginBottom: '4px', borderBottom: '1px solid #1e293b', paddingBottom: '4px' }}
              formatter={(v: number) => [`${v.toFixed(3)} ${unit}`, 'Value']}
              labelFormatter={(label) => `Sample T: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              fillOpacity={1} 
              fill={`url(#gradient-${dataKey})`} 
              strokeWidth={2}
              isAnimationActive={false}
            />
            <Brush 
              dataKey="timestamp" 
              height={30} 
              stroke="#475569" 
              fill="#0f172a" 
              travellerWidth={10}
              isAnimationActive={false}
              tick={{ fill: '#94a3b8', fontSize: 9 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SensorChart;
