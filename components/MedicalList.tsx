import React from 'react';
import { MedicalRecord } from '../types';
import { Pill, CalendarCheck, Syringe, Stethoscope } from 'lucide-react';

interface MedicalListProps {
  records: MedicalRecord[];
}

const getIcon = (type: MedicalRecord['type']) => {
  switch(type) {
    case 'medication': return <Pill size={18} />;
    case 'vaccine': return <Syringe size={18} />;
    case 'checkup': return <Stethoscope size={18} />;
    default: return <CalendarCheck size={18} />;
  }
};

const MedicalList: React.FC<MedicalListProps> = ({ records }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-cat-100 h-full">
      <h3 className="text-lg font-bold text-cat-800 mb-4">Medical History</h3>
      <div className="space-y-4">
        {records.map((record) => (
          <div key={record.id} className="flex items-start space-x-4 p-3 rounded-xl hover:bg-cat-50 transition-colors">
            <div className={`p-2 rounded-full shrink-0 ${record.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
              {getIcon(record.type)}
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-cat-900">{record.title}</span>
                <span className="text-xs text-gray-400">{new Date(record.date).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{record.description}</p>
            </div>
          </div>
        ))}
        {records.length === 0 && (
          <div className="text-center text-gray-400 py-8">No records yet.</div>
        )}
      </div>
    </div>
  );
};

export default MedicalList;