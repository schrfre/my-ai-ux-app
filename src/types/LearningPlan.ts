export interface LearningPlan {
  id: string;
  topic: string;
  content: string;
  confidenceScore: number;
  createdAt: Date;
  settings: {
    difficulty: string;
    targetAudience: string;
    automationLevel: number;
    language: string;
  };
} 