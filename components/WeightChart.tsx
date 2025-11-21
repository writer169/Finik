import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WeightRecord } from '../types';
import { Plus, X, Save } from 'lucide-react';

interface WeightChartProps {
  data: WeightRecord[];
  onAddWeight?: (record: Partial<WeightRecord>) => void;
}

const WeightChart: React.FC<WeightChartProps> = ({ data, onAddWeight }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

  const formattedData = data.map(d => ({
    ...d,
    displayDate: new Date(d.date).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }),
  }));

  const totalGain = data.length > 0 ? data[data.length-1].weight - data[0].weight : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddWeight && newWeight && newDate) {
      onAddWeight({
        weight: parseInt(newWeight),
        date: newDate
      });
      setNewWeight('');
      setIsFormOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-cat-100 h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-cat-800">Динамика веса</h3>
        <div className="flex items-center gap-2">
          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
            +{totalGain}г всего
          </span>
          {onAddWeight && !isFormOpen && (
             <button onClick={() => setIsFormOpen(true)} className="text-cat-400 hover:text-cat-600 p-1">
                <Plus size={20} />
             </button>
          )}
        </div>
      </div>
      
      {isFormOpen && (
        <form onSubmit={handleAdd} className="absolute top-16 right-6 bg-white p-4 rounded-2xl shadow-xl border border-cat-100 z-10 animate-fade-in w-64">
          <div className="flex justify-between items-center mb-3">
             <h4 className="text-sm font-bold text-cat-800">Записать вес</h4>
             <button type="button" onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600">
               <X size={16} />
             </button>
          </div>
          <div className="space-y-3">
             <div className="flex items-center border border-cat-200 rounded-lg overflow-hidden">
               <input 
                 type="number" 
                 value={newWeight}
                 onChange={e => setNewWeight(e.target.value)}
                 placeholder="1200"
                 className="w-full p-2 text-sm bg-white text-gray-900 outline-none"
                 autoFocus
               />
               <span className="bg-cat-50 text-cat-400 px-3 text-xs font-bold border-l border-cat-200 py-2">грамм</span>
             </div>
             <input 
               type="date" 
               value={newDate}
               onChange={e => setNewDate(e.target.value)}
               className="w-full p-2 text-sm border border-cat-200 rounded-lg bg-white text-gray-900 outline-none"
             />
             <button type="submit" className="w-full bg-cat-500 hover:bg-cat-600 text-white text-xs font-bold py-2 rounded-lg flex justify-center items-center gap-2">
               <Save size={14} /> Сохранить
             </button>
          </div>
        </form>
      )}

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
              labelFormatter={(label) => label}
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