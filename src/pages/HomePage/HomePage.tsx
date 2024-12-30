import React, { useState } from 'react';
import { generateContent, stopGeneration } from '../../services/llmService';
import { StreamingContent } from '../../components/StreamingContent';
import { useSettings } from '../../context/SettingsContext';
import { useLearning } from '../../context/LearningContext';
import { calculateWeeks, calculateChapters } from '../../utils/dateCalculations';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [topic, setTopic] = useState('');
  const [streamContent, setStreamContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { addLearningPlan } = useLearning();
  const [isStopping, setIsStopping] = useState(false);

  const defaultSettings = {
    format: 'structured',
    style: 'detailed',
    depth: 'intermediate'
  };

  const handleStopGeneration = () => {
    setIsStopping(true);
    stopGeneration();
    setTimeout(() => {
      setIsGenerating(false);
      setIsStopping(false);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setError(null);
    setStreamContent(''); // Reset content

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
          setStreamContent(content);
        }
      });

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
    } finally {
      setIsGenerating(false);
    }
  };

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
              <p>Maßgeschneiderte Lernpläne für Ihre individuellen Ziele</p>
            </div>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>⚡</span>
            <div>
              <h3>Effizient</h3>
              <p>Optimierte Lernpläne in Echtzeit generiert</p>
            </div>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🤖</span>
            <div>
              <h3>KI-gestützt</h3>
              <p>Unterstützt durch modernste KI-Technologie</p>
            </div>
          </div>
        </div>

        <div className={styles.inputSection}>
          <form onSubmit={handleSubmit}>
            <div className={styles.searchBar}>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Geben Sie Ihr Lernthema ein..."
                className={styles.searchInput}
                disabled={isGenerating}
              />
              <button 
                type="submit" 
                className={`${styles.generateButton} ${isGenerating ? styles.stopButton : ''}`}
                onClick={isGenerating ? handleStopGeneration : undefined}
                disabled={(!isGenerating && !topic.trim()) || isStopping}
              >
                {isGenerating ? (
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
                    onChange={(e) => updateSettings({ targetDate: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Lerntage pro Woche</label>
                  <select
                    value={settings.daysPerWeek}
                    onChange={(e) => updateSettings({ daysPerWeek: e.target.value })}
                    className={styles.input}
                  >
                    {[1,2,3,4,5,6,7].map(day => (
                      <option key={day} value={day}>{day} {day === 1 ? 'Tag' : 'Tage'}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label>Lernzeit pro Tag</label>
                  <select
                    value={settings.timePerDay}
                    onChange={(e) => updateSettings({ timePerDay: e.target.value })}
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
        </div>

        {error && (
          <div className={styles.error}>
            <span className={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        {streamContent && (
          <div className={styles.resultSection}>
            <StreamingContent content={streamContent} />
          </div>
        )}
      </div>
    </div>
  );
}; 