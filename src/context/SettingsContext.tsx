import React, { createContext, useContext, useState } from 'react';

export interface StylePreference {
  formal: boolean;
  technical: boolean;
  examples: boolean;
  detailed: boolean;
}

interface SettingsContextType {
  difficulty: string;
  setDifficulty: (value: string) => void;
  targetAudience: string;
  setTargetAudience: (value: string) => void;
  stylePreferences: StylePreference;
  setStylePreferences: (value: StylePreference | ((prev: StylePreference) => StylePreference)) => void;
  language: string;
  setLanguage: (value: string) => void;
  automationLevel: number;
  setAutomationLevel: (value: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Lade gespeicherte Einstellungen beim Start
  const loadSavedSettings = () => {
    const savedSettings = localStorage.getItem('aiuxSettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return null;
  };

  const savedSettings = loadSavedSettings();

  const [difficulty, setDifficulty] = useState(savedSettings?.difficulty || 'medium');
  const [targetAudience, setTargetAudience] = useState(savedSettings?.targetAudience || '');
  const [stylePreferences, setStylePreferences] = useState<StylePreference>(
    savedSettings?.stylePreferences || {
      formal: true,
      technical: true,
      examples: true,
      detailed: false
    }
  );
  const [language, setLanguage] = useState(savedSettings?.language || 'deutsch');
  const [automationLevel, setAutomationLevel] = useState(savedSettings?.automationLevel || 50);

  return (
    <SettingsContext.Provider value={{
      difficulty,
      setDifficulty,
      targetAudience,
      setTargetAudience,
      stylePreferences,
      setStylePreferences,
      language,
      setLanguage,
      automationLevel,
      setAutomationLevel
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}; 