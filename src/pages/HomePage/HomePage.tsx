import React, { useState, useRef } from 'react';
import styles from './HomePage.module.css';
import ContentCard from '../../components/ContentCard/ContentCard';
import { useSettings } from '../../context/SettingsContext';
import { generateContent } from '../../services/llmService';

const HomePage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    difficulty,
    targetAudience,
    stylePreferences,
    language,
    automationLevel
  } = useSettings();

  const handleGenerate = async () => {
    if (!topic) return;

    setIsLoading(true);
    setError(null);

    // Neuen AbortController erstellen
    abortControllerRef.current = new AbortController();

    try {
      const content = await generateContent({
        topic,
        difficulty,
        targetAudience,
        stylePreferences,
        language,
        automationLevel,
        signal: abortControllerRef.current.signal
      });

      setGeneratedContent(content);
      setConfidenceScore(85);
    } catch (err) {
      if ((err as Error).message === 'ABORTED') {
        setError('Generierung abgebrochen');
      } else {
        setError('Fehler bei der Generierung des Lernplans');
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleAbort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className={styles.container}>
      <h1>Willkommen</h1>
      
      <div className={styles.inputSection}>
        <div className={styles.inputGroup}>
          <label htmlFor="topic">Thema:</label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="z.B. React Hooks, TypeScript Basics..."
          />
        </div>

        <div className={styles.buttonGroup}>
          <button 
            className={styles.generateButton}
            onClick={handleGenerate}
            disabled={!topic || isLoading}
          >
            {isLoading ? 'Generiere...' : 'Inhalt generieren'}
          </button>

          {isLoading && (
            <button 
              className={styles.abortButton}
              onClick={handleAbort}
            >
              Abbrechen
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {generatedContent && (
        <ContentCard
          content={generatedContent}
          confidenceScore={confidenceScore}
          topic={topic}
        />
      )}
    </div>
  );
};

export default HomePage; 