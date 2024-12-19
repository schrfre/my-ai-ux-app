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
  settings?: {
    format: string;
    style: string;
    depth: string;
  };
}

interface LearningContextType {
  learningPlans: LearningPlan[];
  addLearningPlan: (plan: Omit<LearningPlan, 'id' | 'completedChapters' | 'difficulty' | 'relevance' | 'lastUpdated' | 'chapters' | 'settings'>) => void;
  updateLearningPlan: (id: string, updates: Partial<LearningPlan>) => void;
  deleteLearningPlan: (id: string) => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [learningPlans, setLearningPlans] = useState<LearningPlan[]>(() => {
    const savedPlans = localStorage.getItem('learningPlans');
    if (savedPlans) {
      try {
        const parsed = JSON.parse(savedPlans);
        return parsed.map((plan: any) => ({
          id: plan.id || Date.now().toString(),
          topic: plan.topic || '',
          content: plan.content || '',
          chapters: plan.chapters || [],
          totalChapters: plan.totalChapters || 0,
          completedChapters: plan.completedChapters || 0,
          difficulty: plan.difficulty || 3,
          relevance: plan.relevance || 3,
          lastUpdated: new Date(plan.lastUpdated || Date.now()),
          confidenceScore: plan.confidenceScore || 0,
          settings: {
            format: 'structured',
            style: 'detailed',
            depth: 'intermediate'
          }
        }));
      } catch (error) {
        console.error('Fehler beim Laden der Lernpläne:', error);
        return [];
      }
    }
    return [];
  });

  // Speichere Änderungen im localStorage
  useEffect(() => {
    localStorage.setItem('learningPlans', JSON.stringify(learningPlans));
  }, [learningPlans]);

  const addLearningPlan = (plan: Omit<LearningPlan, 'id' | 'completedChapters' | 'difficulty' | 'relevance' | 'lastUpdated' | 'chapters' | 'settings'>) => {
    const chapters = extractChapters(plan.content);
    const newPlan: LearningPlan = {
      ...plan,
      id: Date.now().toString(),
      chapters,
      completedChapters: 0,
      difficulty: 3,
      relevance: 3,
      lastUpdated: new Date(),
      totalChapters: chapters.length,
      settings: {
        format: 'structured',
        style: 'detailed',
        depth: 'intermediate'
      }
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