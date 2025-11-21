import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WeightRecord } from '../types';

interface WeightChartProps {
  data: WeightRecord[];
}

const WeightChart: React.FC<WeightChartProps> = ({ data }) => {
  const formattedData = data.map(d => ({
    ...d,
    displayDate: new Date(d.date).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }),
  }));

  const totalGain = data[data.length-1].weight - data[0].weight;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-cat-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-cat-800">Динамика веса</h3>
        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
          +{totalGain}г всего
        </span>
      </div>
      
      <div className="flex-grow min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a18072" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#a18072" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="displayDate" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              domain={['dataMin - 100', 'dataMax + 100']}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              cursor={{ stroke: '#a18072', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area 
              type="monotone" 
              dataKey="weight" 
              stroke="#a18072" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorWeight)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeightChart;