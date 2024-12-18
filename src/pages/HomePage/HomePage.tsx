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
      <div className={styles.hero}>
        <h1>KI-gestützte Lernplan-Generierung</h1>
        <p>Erstellen Sie personalisierte Lernpläne mit Hilfe künstlicher Intelligenz</p>
      </div>

      <div className={styles.mainSection}>
        <div className={styles.inputSection}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Geben Sie ein Thema ein, z.B. 'React Hooks' oder 'Machine Learning Grundlagen'"
              className={styles.topicInput}
            />
            <div className={styles.buttonContainer}>
              <button 
                className={styles.generateButton}
                onClick={handleGenerate}
                disabled={!topic || isLoading}
              >
                {isLoading ? (
                  <div className={styles.loadingSpinner}>
                    <div className={styles.spinner}></div>
                    <span>Generiere...</span>
                  </div>
                ) : (
                  <>
                    <span className={styles.buttonIcon}>🤖</span>
                    Lernplan erstellen
                  </>
                )}
              </button>
              {isLoading && (
                <button 
                  className={styles.abortButton}
                  onClick={handleAbort}
                  title="Generation abbrechen"
                >
                  <span className={styles.buttonIcon}>⏹</span>
                  <span>Abbrechen</span>
                </button>
              )}
            </div>
          </div>

          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🎯</span>
              <p>Personalisierte Lernziele</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📚</span>
              <p>Strukturierte Inhalte</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>⚡</span>
              <p>Effizientes Lernen</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🔄</span>
              <p>Anpassbare Pläne</p>
            </div>
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            <span className={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        {generatedContent && (
          <div className={styles.resultSection}>
            <ContentCard
              content={generatedContent}
              confidenceScore={confidenceScore}
              topic={topic}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage; 