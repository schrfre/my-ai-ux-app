import { Chapter } from '../context/LearningContext';

interface TempChapter {
  title: string;
  content: string;
  isCompleted: boolean;
}

export const extractChapters = (content: string): Chapter[] => {
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed.map(chapter => ({
        ...chapter,
        isCompleted: false
      })) as Chapter[];
    }
  } catch {}

  const chapters: Chapter[] = [];
  const lines = content.split('\n');
  let currentChapter: TempChapter | null = null;
  let chapterContent: string[] = [];

  const createChapter = (title: string, content: string): Chapter => ({
    title,
    content,
    isCompleted: false
  });

  const saveCurrentChapter = () => {
    if (currentChapter && typeof currentChapter.title === 'string') {
      chapters.push(
        createChapter(
          currentChapter.title,
          chapterContent.join('\n').trim()
        )
      );
    }
  };

  lines.forEach(line => {
    const chapterMatch = line.match(/^(Kapitel|Woche)\s*\d+:/i);
    
    if (chapterMatch) {
      saveCurrentChapter();
      
      currentChapter = {
        title: line.trim(),
        content: '',
        isCompleted: false
      };
      chapterContent = [];
    } else if (currentChapter) {
      chapterContent.push(line);
    }
  });

  // Speichere das letzte Kapitel
  saveCurrentChapter();

  // Erstelle ein Standard-Kapitel, wenn keine gefunden wurden
  if (chapters.length === 0) {
    chapters.push(
      createChapter('Kapitel 1', content.trim())
    );
  }

  return chapters;
}; 