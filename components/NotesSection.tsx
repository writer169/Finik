import React, { useState } from 'react';
import { Note } from '../types';
import { Plus, Trash2, Tag, PenTool, Edit2 } from 'lucide-react';

interface NotesSectionProps {
  notes: Note[];
  onAddNote: (note: Note) => void;
  onUpdateNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({ notes, onAddNote, onUpdateNote, onDeleteNote }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  const startEditing = (note: Note) => {
    setNewContent(note.content);
    setNewTags(note.tags ? note.tags.join(', ') : '');
    setEditingId(note.id);
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setNewContent('');
    setNewTags('');
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContent.trim()) {
      const noteData = {
        content: newContent,
        tags: newTags ? newTags.split(',').map(t => t.trim()) : [],
        date: new Date().toISOString(), // Update date on edit? Or keep original? Let's update date for last modified or keep it simple. Let's keep original date if editing, but usually notes sort by creation. Let's just update content.
      };

      if (editingId) {
        // Find original note to keep date if we wanted, but simplified:
        const original = notes.find(n => n.id === editingId);
        onUpdateNote({
          ...original,
          ...noteData,
          date: original?.date || new Date().toISOString(),
          id: editingId
        } as Note);
      } else {
        onAddNote({
          ...noteData,
          date: new Date().toISOString(),
          id: Date.now().toString()
        } as Note);
      }
      
      resetForm();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-cat-900">Заметки о Финике</h2>
        {!isFormOpen && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-cat-500 hover:bg-cat-600 text-white px-4 py-2 rounded-xl flex items-center shadow-md transition-all"
          >
            <Plus size={18} className="mr-2" /> Новая заметка
          </button>
        )}
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl shadow-md border border-cat-100 animate-fade-in">
           <div className="mb-2 text-sm font-bold text-cat-800">
             {editingId ? 'Редактировать заметку' : 'Новая заметка'}
           </div>
          <textarea
            className="w-full p-3 rounded-xl border border-cat-200 focus:ring-2 focus:ring-cat-300 outline-none mb-3 text-sm bg-white text-gray-900"
            rows={3}
            placeholder="Что интересного произошло сегодня? Особенности характера, игрушки..."
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            autoFocus
          />
          <div className="flex items-center gap-3 mb-3">
            <Tag size={16} className="text-cat-400" />
            <input 
              type="text"
              placeholder="Теги (через запятую)"
              className="flex-grow bg-white border-b border-cat-200 py-1 text-sm text-gray-900 focus:outline-none focus:border-cat-400"
              value={newTags}
              onChange={e => setNewTags(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={resetForm} className="text-gray-500 px-4 py-2 text-sm hover:bg-gray-50 rounded-lg">Отмена</button>
            <button type="submit" className="bg-cat-500 hover:bg-cat-600 text-white px-6 py-2 rounded-xl text-sm font-bold transition-colors">
              {editingId ? 'Обновить' : 'Сохранить'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-yellow-50 rounded-2xl p-5 shadow-sm border border-yellow-100 relative hover:-translate-y-1 transition-transform duration-200 group">
            <div className="absolute top-4 right-4 text-yellow-300">
              <PenTool size={16} />
            </div>
            <p className="text-cat-900 mb-4 whitespace-pre-wrap font-medium leading-relaxed">{note.content}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {note.tags?.map((tag, idx) => (
                <span key={idx} className="bg-white/60 text-cat-600 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wide">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-end mt-auto pt-2 border-t border-yellow-100/50">
              <span className="text-xs text-cat-400">
                {new Date(note.date).toLocaleDateString('ru-RU')}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                  onClick={() => startEditing(note)}
                  className="text-cat-300 hover:text-cat-600 transition-colors p-1"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => onDeleteNote(note.id)}
                  className="text-cat-300 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {notes.length === 0 && !isFormOpen && (
           <div className="col-span-full text-center py-12 text-cat-300 border-2 border-dashed border-cat-100 rounded-3xl">
             Пока нет заметок. Запишите что-нибудь интересное о Финике!
           </div>
        )}
      </div>
    </div>
  );
};

export default NotesSection;