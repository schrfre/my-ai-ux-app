import { Chapter } from '../types/learning';

interface PartialChapter {
  title: string;
  content?: string;
}

export const extractChapters = (content: string): Chapter[] => {
  const chapters: Chapter[] = [];
  let currentChapter: PartialChapter | null = null;
  let chapterContent: string[] = [];
  let objectives: string[] = [];
  let isCollectingObjectives = false;

  const createChapter = (title: string, content: string, objectives: string[]): Chapter => ({
    id: crypto.randomUUID(),
    title,
    content,
    isCompleted: false,
    duration: extractDuration(content) || '2-3 Stunden',
    difficulty: extractDifficulty(content) || 'Mittel',
    objectives,
    nextRepetition: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  });

  const processCurrentChapter = () => {
    if (currentChapter !== null) {
      chapters.push(
        createChapter(
          currentChapter.title,
          chapterContent.join('\n').trim(),
          objectives
        )
      );
    }
  };

  const lines = content.split('\n');
  
  lines.forEach((line) => {
    // Erkennt Kapitelüberschriften (### 📑 Kapitel X: ...)
    if (line.match(/^###\s*📑.*Kapitel/i)) {
      processCurrentChapter();
      
      currentChapter = {
        title: line.replace(/^###\s*📑\s*/, '').trim()
      };
      chapterContent = [];
      objectives = [];
      isCollectingObjectives = false;
    }
    // Erkennt Lernziele
    else if (line.includes('Lernziele des Kapitels:')) {
      isCollectingObjectives = true;
    }
    // Sammelt Lernziele
    else if (isCollectingObjectives && line.trim().startsWith('-')) {
      objectives.push(line.replace(/^-\s*/, '').trim());
    }
    // Beendet das Sammeln von Lernzielen bei einer Leerzeile
    else if (isCollectingObjectives && line.trim() === '') {
      isCollectingObjectives = false;
    }
    // Sammelt den restlichen Inhalt
    else if (currentChapter !== null) {
      chapterContent.push(line);
    }
  });

  // Fügt das letzte Kapitel hinzu
  processCurrentChapter();

  // Erstelle ein Standard-Kapitel, wenn keine gefunden wurden
  if (chapters.length === 0) {
    chapters.push(
      createChapter(
        'Kapitel 1: Einführung',
        content.trim(),
        ['Grundlegendes Verständnis entwickeln']
      )
    );
  }

  return chapters;
};

// Hilfsfunktionen zum Extrahieren von Metadaten
const extractDuration = (content: string): string | null => {
  const durationMatch = content.match(/\*\*Lernzeit\*\*:\s*([^\n]+)/);
  return durationMatch ? durationMatch[1].trim() : null;
};

const extractDifficulty = (content: string): string | null => {
  const difficultyMatch = content.match(/\*\*Schwierigkeitsgrad\*\*:\s*([^\n]+)/);
  return difficultyMatch ? difficultyMatch[1].trim() : null;
}; 