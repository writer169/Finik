import React from 'react';
import { CalendarEvent } from '../types';
import { Home, Star, Gift, Heart, Syringe } from 'lucide-react';

interface TimelineProps {
  events: CalendarEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  // Sort by date
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getIcon = (type: CalendarEvent['type']) => {
    switch(type) {
      case 'life': return <Home size={16} />;
      case 'birthday': return <Gift size={16} />;
      case 'vaccine': return <Syringe size={16} />;
      case 'medical': return <Heart size={16} />;
      default: return <Star size={16} />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-cat-100">
      <h3 className="text-lg font-bold text-cat-800 mb-4">Life Journey</h3>
      <div className="relative border-l-2 border-cat-100 ml-3 space-y-8">
        {sortedEvents.map((event) => (
          <div key={event.id} className="relative pl-8">
            <div className="absolute -left-[9px] top-0 bg-cat-500 text-white p-1 rounded-full">
              {getIcon(event.type)}
            </div>
            <div>
              <span className="text-xs font-bold text-cat-400 uppercase tracking-wide">
                {new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <h4 className="text-md font-semibold text-cat-900">{event.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;