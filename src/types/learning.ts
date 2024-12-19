export interface Chapter {
  id: string;
  title: string;
  content: string;
  isCompleted: boolean;
  duration: string;
  difficulty: string;
  objectives: string[];
  nextRepetition?: string;
}

export interface LearningPlan {
  id: string;
  topic: string;
  content: string;
  confidenceScore: number;
  totalChapters: number;
  completedChapters: number;
  chapters: Chapter[];
  lastUpdated: string;
} 