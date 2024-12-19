import React, { createContext, useContext, useState, useEffect } from 'react';
import { extractChapters } from '../utils/contentParser';

export interface Chapter {
  title: string;
  content: string;
  isCompleted: boolean;
}

export interface LearningPlan {
  id: string;
  topic: string;
  content: string;
  chapters: Chapter[];
  totalChapters: number;
  completedChapters: number;
  difficulty: number;
  relevance: number;
  lastUpdated: Date;
  confidenceScore: number;
}

interface LearningContextType {
  learningPlans: LearningPlan[];
  addLearningPlan: (plan: Omit<LearningPlan, 'id' | 'completedChapters' | 'difficulty' | 'relevance' | 'lastUpdated' | 'chapters'>) => void;
  updateLearningPlan: (id: string, updates: Partial<LearningPlan>) => void;
  deleteLearningPlan: (id: string) => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [learningPlans, setLearningPlans] = useState<LearningPlan[]>(() => {
    const savedPlans = localStorage.getItem('learningPlans');
    if (savedPlans) {
      const parsed = JSON.parse(savedPlans);
      return parsed.map((plan: any) => ({
        ...plan,
        lastUpdated: new Date(plan.lastUpdated)
      }));
    }
    return [];
  });

  // Speichere Änderungen im localStorage
  useEffect(() => {
    localStorage.setItem('learningPlans', JSON.stringify(learningPlans));
  }, [learningPlans]);

  const addLearningPlan = (plan: Omit<LearningPlan, 'id' | 'completedChapters' | 'difficulty' | 'relevance' | 'lastUpdated' | 'chapters'>) => {
    const chapters = extractChapters(plan.content);
    const newPlan: LearningPlan = {
      ...plan,
      id: Date.now().toString(),
      chapters,
      completedChapters: 0,
      difficulty: 3,
      relevance: 3,
      lastUpdated: new Date(),
      totalChapters: chapters.length
    };
    setLearningPlans(prev => [...prev, newPlan]);
  };

  const updateLearningPlan = (id: string, updates: Partial<LearningPlan>) => {
    setLearningPlans(plans =>
      plans.map(plan => {
        if (plan.id === id) {
          const updatedPlan = { ...plan, ...updates, lastUpdated: new Date() };
          if (updates.content) {
            updatedPlan.chapters = extractChapters(updates.content);
            updatedPlan.totalChapters = updatedPlan.chapters.length;
          }
          return updatedPlan;
        }
        return plan;
      })
    );
  };

  const deleteLearningPlan = (id: string) => {
    setLearningPlans(plans => plans.filter(plan => plan.id !== id));
  };

  return (
    <LearningContext.Provider value={{ 
      learningPlans, 
      addLearningPlan, 
      updateLearningPlan,
      deleteLearningPlan 
    }}>
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (context === undefined) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
}; 