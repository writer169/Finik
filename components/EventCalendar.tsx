import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '../types';
import { CalendarCheck, Syringe, Heart, Star, Gift, Plus, Trash2, Edit2 } from 'lucide-react';

interface EventCalendarProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events, onAddEvent, onUpdateEvent, onDeleteEvent }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState<Partial<CalendarEvent>>({
    title: '',
    date: today,
    type: 'medical',
    description: ''
  });

  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const startEditing = (event: CalendarEvent) => {
    setFormData({
      title: event.title,
      date: event.date,
      type: event.type,
      description: event.description || ''
    });
    setEditingId(event.id);
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setFormData({ title: '', date: today, type: 'medical', description: '' });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.date && formData.type) {
      const eventData = {
        title: formData.title,
        date: formData.date,
        type: formData.type,
        description: formData.description,
        isCompleted: new Date(formData.date) < new Date()
      };

      if (editingId) {
        onUpdateEvent({ ...eventData, id: editingId } as CalendarEvent);
      } else {
        onAddEvent({ ...eventData, id: Date.now().toString() } as CalendarEvent); // ID will be replaced by DB
      }
      resetForm();
    }
  };

  const getIcon = (type: CalendarEvent['type']) => {
    switch(type) {
      case 'vaccine': return <Syringe size={18} />;
      case 'medical': return <Heart size={18} />;
      case 'birthday': return <Gift size={18} />;
      case 'life': return <Star size={18} />;
      default: return <CalendarCheck size={18} />;
    }
  };

  const getStatusColor = (type: CalendarEvent['type'], isPast: boolean) => {
    if (type === 'vaccine') return isPast ? 'bg-blue-100 text-blue-600' : 'bg-blue-50 text-blue-400 border-blue-200';
    if (type === 'birthday') return 'bg-pink-100 text-pink-600';
    if (type === 'medical') return isPast ? 'bg-red-100 text-red-600' : 'bg-red-50 text-red-400 border-red-200';
    return 'bg-amber-100 text-amber-600';
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-cat-100 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-cat-800">Календарь событий</h3>
        {!isFormOpen && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-cat-500 hover:bg-cat-600 text-white text-sm px-3 py-1.5 rounded-xl flex items-center transition-colors"
          >
            <Plus size={16} className="mr-1" /> Добавить
          </button>
        )}
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-6 bg-cat-50 p-4 rounded-xl border border-cat-200 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-bold text-cat-800">{editingId ? 'Редактировать событие' : 'Новое событие'}</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Название события"
              className="px-3 py-2 rounded-lg border border-cat-200 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-cat-300 outline-none"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
            />
            <input
              type="date"
              className="px-3 py-2 rounded-lg border border-cat-200 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-cat-300 outline-none"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
              required
            />
            <select 
              className="px-3 py-2 rounded-lg border border-cat-200 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-cat-300 outline-none"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as any})}
            >
              <option value="medical">Визит к врачу</option>
              <option value="vaccine">Вакцинация</option>
              <option value="birthday">День рождения</option>
              <option value="life">Событие жизни</option>
              <option value="other">Другое</option>
            </select>
            <input
              type="text"
              placeholder="Описание (опционально)"
              className="px-3 py-2 rounded-lg border border-cat-200 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-cat-300 outline-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={resetForm} className="text-xs text-gray-500 px-3 py-1 hover:bg-gray-100 rounded-lg">Отмена</button>
            <button type="submit" className="bg-cat-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-cat-600">
              {editingId ? 'Обновить' : 'Сохранить'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {sortedEvents.map((event) => {
          const isPast = event.isCompleted || new Date(event.date) < new Date();
          const isFuture = !isPast;
          
          return (
            <div key={event.id} className={`flex items-start space-x-4 p-3 rounded-xl transition-colors group ${isFuture ? 'bg-white border border-cat-100 shadow-sm' : 'bg-gray-50/50'}`}>
              <div className={`p-2 rounded-full shrink-0 ${getStatusColor(event.type, isPast)}`}>
                {getIcon(event.type)}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`font-semibold ${isPast ? 'text-gray-600' : 'text-cat-900'}`}>{event.title}</span>
                    {isFuture && <span className="ml-2 text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">Скоро</span>}
                  </div>
                  <span className="text-xs text-gray-400">{new Date(event.date).toLocaleDateString('ru-RU')}</span>
                </div>
                {event.description && <p className="text-sm text-gray-500 mt-1">{event.description}</p>}
              </div>
              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEditing(event)} className="text-cat-300 hover:text-cat-500 p-1">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => onDeleteEvent(event.id)} className="text-gray-300 hover:text-red-400 p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
        {sortedEvents.length === 0 && (
          <div className="text-center text-gray-400 py-8">Нет событий</div>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;