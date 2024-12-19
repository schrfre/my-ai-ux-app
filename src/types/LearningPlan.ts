export interface StylePreferences {
  formal: boolean;
  technical: boolean;
  examples: boolean;
  detailed: boolean;
}

export interface PlanSettings {
  difficulty: string;
  targetAudience: string;
  automationLevel: number;
  language: string;
  stylePreferences: StylePreferences;
}

export interface LearningPlan {
  version?: number;
  id: string;
  topic: string;
  content: string;
  createdAt: Date;
  confidenceScore: number;
  settings: PlanSettings;
}

export const CURRENT_VERSION = 2;

export const migrateLearningPlan = (plan: LearningPlan): LearningPlan => {
  if (!plan.version || plan.version < 2) {
    return {
      ...plan,
      version: 2,
      settings: {
        ...plan.settings,
        stylePreferences: {
          formal: false,
          technical: false,
          examples: true,
          detailed: true
        }
      }
    };
  }
  return plan;
}; 