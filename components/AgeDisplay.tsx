import React, { useMemo } from 'react';
import { AgeParts } from '../types';

interface AgeDisplayProps {
  birthDate: string;
}

// Helper for Russian pluralization
const getNoun = (number: number, one: string, two: string, five: string) => {
  let n = Math.abs(number);
  n %= 100;
  if (n >= 5 && n <= 20) {
    return five;
  }
  n %= 10;
  if (n === 1) {
    return one;
  }
  if (n >= 2 && n <= 4) {
    return two;
  }
  return five;
};

const AgeDisplay: React.FC<AgeDisplayProps> = ({ birthDate }) => {
  const age = useMemo((): AgeParts => {
    const birth = new Date(birthDate);
    // If system date is before birth (e.g. viewing in 2024 for a 2025 birth), 
    // simulate "now" as Dec 1, 2025 to show correct relative age for the demo data.
    const systemNow = new Date();
    const now = systemNow < birth ? new Date('2025-12-01') : systemNow;
    
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }

    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;

    return { years, months, weeks, days: remainingDays };
  }, [birthDate]);

  const isOverOneYear = age.years >= 1;

  return (
    <div className="bg-gradient-to-br from-cat-500 to-cat-600 rounded-3xl p-6 text-white shadow-lg flex flex-col items-center justify-center h-full relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
      
      <h2 className="text-cat-100 text-sm font-medium uppercase tracking-wider mb-2 relative z-10">Возраст</h2>
      
      <div className="flex items-baseline space-x-2 relative z-10">
        {isOverOneYear ? (
          <>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold">{age.years}</span>
              <span className="text-xs opacity-80">{getNoun(age.years, 'Год', 'Года', 'Лет')}</span>
            </div>
            <span className="text-3xl font-light opacity-60">&</span>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold">{age.months}</span>
              <span className="text-xs opacity-80">{getNoun(age.months, 'Месяц', 'Месяца', 'Месяцев')}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center">
              <span className="text-6xl font-bold">{age.months}</span>
              <span className="text-xs opacity-80">{getNoun(age.months, 'Месяц', 'Месяца', 'Месяцев')}</span>
            </div>
            {age.weeks > 0 && (
              <>
                 <span className="text-2xl font-light opacity-60 pb-4">&</span>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold">{age.weeks}</span>
                  <span className="text-xs opacity-80">{getNoun(age.weeks, 'Неделя', 'Недели', 'Недель')}</span>
                </div>
              </>
            )}
          </>
        )}
      </div>
      <div className="mt-4 text-cat-200 text-sm font-medium relative z-10">
        Родился {new Date(birthDate).toLocaleDateString('ru-RU', { month: 'long', day: 'numeric', year: 'numeric' })}
      </div>
    </div>
  );
};

export default AgeDisplay;