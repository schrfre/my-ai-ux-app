export const calculateWeeks = (targetDate: string): number => {
  if (!targetDate) return 0;
  
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = Math.abs(target.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.ceil(diffDays / 7);
};

export const calculateChapters = (
  weeks: number, 
  daysPerWeek: string, 
  timePerDay: string
): number => {
  if (!weeks || !daysPerWeek || !timePerDay) return 5; // Default-Wert
  
  const totalDays = weeks * parseInt(daysPerWeek);
  const hoursPerDay = parseFloat(timePerDay);
  const totalHours = totalDays * hoursPerDay;
  
  // Ungefähre Kapitelanzahl basierend auf der verfügbaren Zeit
  // Annahme: Pro Kapitel werden ca. 2-3 Stunden benötigt
  return Math.max(3, Math.round(totalHours / 2.5));
}; 