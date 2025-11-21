import { CalendarEvent, Note } from '../types';

const getAuthParam = (key: string) => `?key=${key}`;

export const dataService = {
  async getEvents(key: string): Promise<CalendarEvent[]> {
    const res = await fetch(`/api/events${getAuthParam(key)}`);
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
  },

  async createEvent(key: string, event: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const res = await fetch(`/api/events${getAuthParam(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    return res.json();
  },

  async updateEvent(key: string, event: CalendarEvent): Promise<void> {
    await fetch(`/api/events${getAuthParam(key)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  },

  async deleteEvent(key: string, id: string): Promise<void> {
    await fetch(`/api/events${getAuthParam(key)}&id=${id}`, {
      method: 'DELETE',
    });
  },

  async getNotes(key: string): Promise<Note[]> {
    const res = await fetch(`/api/notes${getAuthParam(key)}`);
    if (!res.ok) throw new Error('Failed to fetch notes');
    return res.json();
  },

  async createNote(key: string, note: Partial<Note>): Promise<Note> {
    const res = await fetch(`/api/notes${getAuthParam(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    return res.json();
  },

  async updateNote(key: string, note: Note): Promise<void> {
    await fetch(`/api/notes${getAuthParam(key)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
  },

  async deleteNote(key: string, id: string): Promise<void> {
    await fetch(`/api/notes${getAuthParam(key)}&id=${id}`, {
      method: 'DELETE',
    });
  },
};