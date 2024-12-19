import React, { createContext, useContext, useState, useEffect } from 'react';

interface ExplainabilitySettings {
  stylePreferences: {
    format: string;
    style: string;
    depth: string;
  };
}

interface Settings {
  targetDate: string;
  daysPerWeek: string;
  timePerDay: string;
  explainability: ExplainabilitySettings;
  automation: string;
  language: string;
  includeExercises: string;
  repetitionInterval: string;
}

const defaultSettings: Settings = {
  targetDate: '',
  daysPerWeek: '3',
  timePerDay: '1',
  explainability: {
    stylePreferences: {
      format: 'structured',
      style: 'detailed',
      depth: 'intermediate'
    }
  },
  automation: 'medium',
  language: 'de',
  includeExercises: 'few',
  repetitionInterval: 'weekly'
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      try {
        return { ...defaultSettings, ...JSON.parse(savedSettings) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
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