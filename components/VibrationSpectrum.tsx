
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, Label 
} from 'recharts';

interface VibrationSpectrumProps {
  vibrationLevel: number;
}

const VibrationSpectrum: React.FC<VibrationSpectrumProps> = ({ vibrationLevel }) => {
  const generateBins = () => {
    const bins = [];
    for (let i = 1; i <= 15; i++) {
      const freq = i * 10;
      let power = (Math.random() * 0.5) + (vibrationLevel / (i * 0.5));
      if (i === 3) power += vibrationLevel * 1.5;
      if (i === 7) power += vibrationLevel * 0.8;
      bins.push({ freq: `${freq}Hz`, power: power });
    }
    return bins;
  };

  const data = generateBins();

  return (
    <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 flex flex-col h-64 shadow-lg group hover:border-slate-700 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">Spectral Density (FFT)</h3>
        <span className="text-[8px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">ISO 10816 Standard</span>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.3} />
            <XAxis dataKey="freq" hide />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={9} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#cbd5e1' }} 
            >
              <Label 
                value="Amplitude (g)" 
                angle={-90} 
                position="insideLeft" 
                offset={0} 
                fill="#94a3b8" 
                fontSize={9} 
                fontWeight="bold" 
              />
            </YAxis>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                borderColor: '#334155', 
                borderRadius: '8px', 
                fontSize: '11px',
                color: '#f8fafc'
              }}
              labelStyle={{ color: '#94a3b8' }}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Bar dataKey="power" radius={[2, 2, 0, 0]} isAnimationActive={false}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.power > 5 ? '#f43f5e' : entry.power > 3 ? '#fbbf24' : '#22d3ee'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1 border-t border-slate-800/50 pt-1">
        Frequency (Hz)
      </div>
    </div>
  );
};

export default VibrationSpectrum;
