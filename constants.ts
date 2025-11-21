import { CalendarEvent, Note, WeightRecord } from './types';

// Using 2025 as requested.
export const BIRTH_DATE = '2025-07-31'; 

export const WEIGHT_DATA: WeightRecord[] = [
  { date: '2025-10-23', weight: 1100 },
  { date: '2025-10-29', weight: 1370 },
  { date: '2025-11-07', weight: 1460 },
  { date: '2025-11-10', weight: 1625 },
  { date: '2025-11-15', weight: 1765 },
  { date: '2025-11-20', weight: 2120 },
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'birth',
    date: '2025-07-31',
    title: 'День рождения Финика',
    type: 'birthday',
    isCompleted: true,
  },
  {
    id: 'home',
    date: '2025-10-14',
    title: 'Забрали домой',
    description: 'Первый день в новом доме',
    type: 'life',
    isCompleted: true,
  },
  {
    id: 'med-1',
    date: '2025-10-24',
    title: 'Дегельминтизация',
    description: 'Пол таблетки Милпразон',
    type: 'medical',
    isCompleted: true,
  },
  {
    id: 'vaccine-1',
    date: '2025-12-15',
    title: 'Плановая вакцинация',
    description: 'Первая комплексная прививка',
    type: 'vaccine',
    isCompleted: false,
  }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: '1',
    date: '2025-10-15',
    content: 'Очень игривый, любит гоняться за лазерной указкой. Спит в ногах.',
    tags: ['характер'],
  },
  {
    id: '2',
    date: '2025-11-01',
    content: 'Любимая игрушка - меховая мышка. Носит её в зубах как собака.',
    tags: ['игрушки'],
  }
];