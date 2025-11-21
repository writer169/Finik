import React, { useState, useEffect } from 'react';
import AgeDisplay from './components/AgeDisplay';
import WeightChart from './components/WeightChart';
import EventCalendar from './components/EventCalendar';
import NotesSection from './components/NotesSection';
import AiAssistant from './components/AiAssistant';
import { BIRTH_DATE, WEIGHT_DATA } from './constants';
import { CalendarEvent, Note } from './types';
import { PawPrint, LayoutDashboard, Calendar, StickyNote, Lock } from 'lucide-react';
import { dataService } from './services/dataService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'notes'>('dashboard');
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [authKey, setAuthKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  // State for dynamic data
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    // Auth Check
    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get('key');
    
    if (key) {
      setAuthKey(key);
      setAuthorized(true);
      fetchData(key);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchData = async (key: string) => {
    setIsLoading(true);
    try {
      const [fetchedEvents, fetchedNotes] = await Promise.all([
        dataService.getEvents(key),
        dataService.getNotes(key)
      ]);
      setEvents(fetchedEvents);
      setNotes(fetchedNotes);
    } catch (err) {
      console.error("Failed to load data", err);
      // Optional: handle error state
    } finally {
      setIsLoading(false);
    }
  };

  const addEvent = async (newEvent: CalendarEvent) => {
    try {
        const created = await dataService.createEvent(authKey, newEvent);
        setEvents([...events, created]);
    } catch (e) { console.error(e); }
  };

  const updateEvent = async (updatedEvent: CalendarEvent) => {
    try {
        await dataService.updateEvent(authKey, updatedEvent);
        setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    } catch (e) { console.error(e); }
  };

  const deleteEvent = async (id: string) => {
    try {
        await dataService.deleteEvent(authKey, id);
        setEvents(events.filter(e => e.id !== id));
    } catch (e) { console.error(e); }
  };

  const addNote = async (newNote: Note) => {
    try {
        const created = await dataService.createNote(authKey, newNote);
        setNotes([created, ...notes]);
    } catch (e) { console.error(e); }
  };

  const updateNote = async (updatedNote: Note) => {
    try {
        await dataService.updateNote(authKey, updatedNote);
        setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
    } catch (e) { console.error(e); }
  };

  const deleteNote = async (id: string) => {
    try {
        await dataService.deleteNote(authKey, id);
        setNotes(notes.filter(n => n.id !== id));
    } catch (e) { console.error(e); }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf8f6] p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-cat-100">
          <div className="w-16 h-16 bg-cat-100 rounded-full flex items-center justify-center mx-auto mb-6 text-cat-500">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-cat-900 mb-2">Доступ ограничен</h1>
          <p className="text-gray-500 mb-6">Пожалуйста, используйте корректную ссылку с ключом доступа для входа в дневник Финика.</p>
          <div className="text-xs text-gray-300">?key=YOUR_KEY</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#fdf8f6]">
             <div className="text-cat-500 animate-pulse font-bold text-xl flex flex-col items-center">
                <PawPrint size={48} className="mb-4 animate-bounce" />
                Загрузка данных Финика...
             </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f6] text-gray-800 font-sans p-4 md:p-8 pb-20">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-cat-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-cat-200 transform rotate-3 hover:rotate-0 transition-transform">
               <PawPrint size={28} fill="currentColor" className="opacity-90" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-cat-900 tracking-tight">Финик</h1>
              <p className="text-cat-400 text-sm font-medium">Дневник роста и счастья</p>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <nav className="bg-white p-1.5 rounded-2xl shadow-sm border border-cat-100 flex">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-cat-100 text-cat-800 shadow-sm' : 'text-gray-400 hover:text-cat-500 hover:bg-cat-50'}`}
            >
              <LayoutDashboard size={16} /> Главная
            </button>
            <button 
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'calendar' ? 'bg-cat-100 text-cat-800 shadow-sm' : 'text-gray-400 hover:text-cat-500 hover:bg-cat-50'}`}
            >
              <Calendar size={16} /> События
            </button>
            <button 
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'notes' ? 'bg-cat-100 text-cat-800 shadow-sm' : 'text-gray-400 hover:text-cat-500 hover:bg-cat-50'}`}
            >
              <StickyNote size={16} /> Заметки
            </button>
          </nav>
        </header>

        {/* Content Area */}
        <div className="animate-fade-in">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column (Stats & Age) */}
              <div className="md:col-span-4 space-y-6">
                  <div className="h-64 md:h-72 transform hover:scale-[1.02] transition-transform duration-500">
                      <AgeDisplay birthDate={BIRTH_DATE} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-cat-50 flex flex-col justify-center items-center text-center">
                        <span className="text-cat-400 text-[10px] font-bold uppercase tracking-wider">Текущий Вес</span>
                        <span className="text-2xl font-bold text-cat-800 mt-1">{WEIGHT_DATA[WEIGHT_DATA.length-1].weight}г</span>
                        <span className="text-green-500 text-[10px] font-medium mt-1">20 Ноя</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-cat-50 flex flex-col justify-center items-center text-center">
                         <span className="text-cat-400 text-[10px] font-bold uppercase tracking-wider">Набор веса</span>
                         <span className="text-2xl font-bold text-cat-800 mt-1">
                             +{(WEIGHT_DATA[WEIGHT_DATA.length-1].weight - WEIGHT_DATA[0].weight)}г
                         </span>
                         <span className="text-gray-400 text-[10px] mt-1">с 23 Окт</span>
                    </div>
                  </div>
              </div>

              {/* Right Column (Chart & AI & Quick Events) */}
              <div className="md:col-span-8 space-y-6">
                  <div className="h-80">
                      <WeightChart data={WEIGHT_DATA} />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Mini Calendar View for Dashboard */}
                      <div className="bg-white rounded-3xl p-6 shadow-sm border border-cat-100 h-full overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                           <h3 className="text-lg font-bold text-cat-800">Ближайшие события</h3>
                           <button onClick={() => setActiveTab('calendar')} className="text-xs text-cat-500 font-bold hover:underline">Все</button>
                        </div>
                        <div className="space-y-3">
                           {events
                             .filter(e => new Date(e.date) >= new Date())
                             .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                             .slice(0, 2)
                             .map(e => (
                               <div key={e.id} className="flex items-center gap-3 p-3 bg-cat-50/50 rounded-xl">
                                  <div className="w-2 h-2 rounded-full bg-cat-400"></div>
                                  <div className="flex-grow">
                                     <div className="text-sm font-bold text-cat-900">{e.title}</div>
                                     <div className="text-xs text-cat-400">{new Date(e.date).toLocaleDateString('ru-RU')}</div>
                                  </div>
                               </div>
                             ))
                           }
                           {events.filter(e => new Date(e.date) >= new Date()).length === 0 && (
                             <div className="text-sm text-gray-400 text-center py-4">Нет предстоящих событий</div>
                           )}
                        </div>
                      </div>

                      <AiAssistant events={events} notes={notes} />
                  </div>
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <EventCalendar 
                    events={events} 
                    onAddEvent={addEvent} 
                    onUpdateEvent={updateEvent} 
                    onDeleteEvent={deleteEvent} 
                />
              </div>
              <div className="md:col-span-1">
                 <AiAssistant events={events} notes={notes} />
                 <div className="mt-6 bg-cat-50 rounded-3xl p-6 text-sm text-cat-800">
                    <h4 className="font-bold mb-2">Совет:</h4>
                    Не забывайте отмечать ежегодные прививки и обработку от паразитов. AI помощник использует эти данные для рекомендаций.
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <NotesSection 
                notes={notes} 
                onAddNote={addNote} 
                onUpdateNote={updateNote} 
                onDeleteNote={deleteNote} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;