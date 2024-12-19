import React, { useState, useRef, useEffect } from 'react';
import styles from './HomePage.module.css';
import ContentCard from '../../components/ContentCard/ContentCard';
import { useSettings } from '../../context/SettingsContext';
import { generateContent, stopGeneration } from '../../services/llmService';
import { useLearning } from '../../context/LearningContext';
import { calculateWeeks, calculateChapters } from '../../utils/dateCalculations';

const HomePage: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [topic, setTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { addLearningPlan } = useLearning();
  const [isStopping, setIsStopping] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  const contentRef = useRef('');
  const updateTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const defaultSettings = {
    format: 'structured',
    style: 'detailed',
    depth: 'intermediate'
  };

  const handleTimeSettingsChange = (field: string, value: string) => {
    updateSettings({
      [field]: value
    });
  };

  const handleStopGeneration = () => {
    setIsStopping(true);
    stopGeneration();
    setTimeout(() => {
      setIsLoading(false);
      setIsStopping(false);
    }, 500);
  };

  const updateContent = (content: string) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    contentRef.current = content;
    updateTimeoutRef.current = setTimeout(() => {
      setStreamedContent(content);
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    contentRef.current = '';

    try {
      const response = await generateContent({
        topic,
        settings: {
          format: settings.explainability?.stylePreferences?.format || defaultSettings.format,
          style: settings.explainability?.stylePreferences?.style || defaultSettings.style,
          depth: settings.explainability?.stylePreferences?.depth || defaultSettings.depth,
          automation: settings.automation,
          language: settings.language,
          includeExercises: settings.includeExercises,
          repetitionInterval: settings.repetitionInterval
        },
        onProgress: (content) => {
          updateContent(content);
        }
      });
      
      setStreamedContent(response.content);
      setGeneratedContent(response.content);
      setConfidenceScore(response.confidenceScore);

      if (response.content) {
        addLearningPlan({
          topic,
          content: response.content,
          confidenceScore: response.confidenceScore,
          totalChapters: calculateChapters(
            calculateWeeks(settings?.targetDate || ''),
            settings?.daysPerWeek || '3',
            settings?.timePerDay || '1'
          )
        });
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'Generierung wurde abgebrochen') {
        setError('Generierung wurde abgebrochen');
      } else {
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      }
      console.error('Fehler bei der Generierung:', err);
    } finally {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      setIsLoading(false);
    }
  };

  // Cleanup beim Unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>KI-gestützter Lernplan-Generator</h1>
        <p>Erstellen Sie personalisierte Lernpläne mit Hilfe künstlicher Intelligenz</p>
      </div>

      <div className={styles.mainSection}>
        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🎯</span>
            <div>
              <h3>Personalisiert</h3>
              <p>Auf Ihre Bedürfnisse zugeschnitten</p>
            </div>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>⚡</span>
            <div>
              <h3>Effizient</h3>
              <p>Optimierte Lernpläne in Sekunden</p>
            </div>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🤖</span>
            <div>
              <h3>KI-gestützt</h3>
              <p>Modernste Technologie</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.inputSection}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Geben Sie Ihr Lernthema ein..."
              className={styles.topicInput}
            />
            <button 
              type="submit" 
              className={`${styles.generateButton} ${isLoading ? styles.stopButton : ''}`}
              onClick={isLoading ? handleStopGeneration : undefined}
              disabled={(!isLoading && !topic.trim()) || isStopping}
            >
              {isLoading ? (
                <>
                  <span className={styles.buttonIcon}>
                    {isStopping ? '⏳' : '⏹️'}
                  </span>
                  {isStopping ? 'Wird gestoppt...' : 'Generierung stoppen'}
                </>
              ) : (
                <>
                  <span className={styles.buttonIcon}>✨</span>
                  Lernplan erstellen
                </>
              )}
            </button>
          </div>

          <button 
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={styles.advancedToggle}
          >
            {showAdvanced ? '▼ Weniger Optionen' : '▶ Erweiterte Optionen'}
          </button>

          {showAdvanced && (
            <div className={styles.advancedInputs}>
              <div className={styles.inputGroup}>
                <label>Zieldatum</label>
                <input
                  type="date"
                  value={settings.targetDate}
                  onChange={(e) => handleTimeSettingsChange('targetDate', e.target.value)}
                  className={styles.input}
                />
                <span className={styles.dateInfo}>
                  Bis wann möchten Sie das Thema beherrschen?
                </span>
              </div>

              <div className={styles.inputGroup}>
                <label>Lerntage pro Woche</label>
                <select
                  value={settings.daysPerWeek}
                  onChange={(e) => handleTimeSettingsChange('daysPerWeek', e.target.value)}
                  className={styles.input}
                >
                  <option value="1">1 Tag</option>
                  <option value="2">2 Tage</option>
                  <option value="3">3 Tage</option>
                  <option value="4">4 Tage</option>
                  <option value="5">5 Tage</option>
                  <option value="6">6 Tage</option>
                  <option value="7">7 Tage</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Lernzeit pro Tag</label>
                <select
                  value={settings.timePerDay}
                  onChange={(e) => handleTimeSettingsChange('timePerDay', e.target.value)}
                  className={styles.input}
                >
                  <option value="0.5">30 Minuten</option>
                  <option value="1">1 Stunde</option>
                  <option value="1.5">1,5 Stunden</option>
                  <option value="2">2 Stunden</option>
                  <option value="3">3 Stunden</option>
                  <option value="4">4 Stunden</option>
                </select>
              </div>
            </div>
          )}
        </form>

        {error && (
          <div className={styles.error}>
            <span className={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        {(streamedContent || generatedContent) && (
          <div className={styles.resultSection}>
            <ContentCard
              topic={topic}
              content={streamedContent || generatedContent}
              confidenceScore={confidenceScore}
              settings={defaultSettings}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage; 