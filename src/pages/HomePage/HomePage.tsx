import React, { useState, useRef } from 'react';
import styles from './HomePage.module.css';
import ContentCard from '../../components/ContentCard/ContentCard';
import { useSettings } from '../../context/SettingsContext';
import { generateContent } from '../../services/llmService';
import { useLearning } from '../../context/LearningContext';
import { calculateWeeks, calculateChapters } from '../../utils/dateCalculations';

const HomePage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [editableContent, setEditableContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [learningGoal, setLearningGoal] = useState('');
  const [timePerDay, setTimePerDay] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState('5');
  const [targetDate, setTargetDate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const settings = useSettings();
  const abortControllerRef = useRef<AbortController | null>(null);
  const { addLearningPlan } = useLearning();

  const handleGenerate = async () => {
    if (!topic) return;
    setIsLoading(true);
    setError(null);

    const weeks = calculateWeeks(targetDate);
    const totalChapters = calculateChapters(weeks, daysPerWeek, timePerDay);

    abortControllerRef.current = new AbortController();

    try {
      const content = await generateContent({ 
        topic,
        learningGoal,
        timePerDay,
        daysPerWeek,
        targetDate,
        ...settings,
        signal: abortControllerRef.current.signal
      });
      
      addLearningPlan({
        topic,
        content,
        totalChapters,
        confidenceScore: 85
      });

      setGeneratedContent(content);
      setEditableContent(content);
      setConfidenceScore(85);
      setIsEditing(true);
    } catch (err) {
      if ((err as Error).message === 'ABORTED') {
        setError('Generierung wurde abgebrochen');
      } else {
        setError('Fehler bei der Generierung des Lernplans');
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleSaveEdit = () => {
    setGeneratedContent(editableContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditableContent(generatedContent);
    setIsEditing(false);
  };

  const handleAbort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const validateTargetDate = (date: string) => {
    const selectedDate = new Date(date);
    const today = new Date();
    
    if (selectedDate <= today) {
      setError('Das Zieldatum muss in der Zukunft liegen');
      return false;
    }
    return true;
  };

  const handleTargetDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (validateTargetDate(newDate)) {
      setTargetDate(newDate);
      setError(null);
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
              {isLoading ? (
                <button 
                  className={styles.abortButton}
                  onClick={handleAbort}
                >
                  <span className={styles.buttonIcon}>⚫</span>
                  Abbrechen
                </button>
              ) : (
                <button 
                  className={styles.generateButton}
                  onClick={handleGenerate}
                  disabled={!topic || isLoading}
                >
                  <span className={styles.buttonIcon}>🤖</span>
                  Lernplan erstellen
                </button>
              )}
            </div>
          </div>

          <button 
            className={styles.advancedToggle}
            onClick={() => setShowAdvanced(!showAdvanced)}
            type="button"
          >
            {showAdvanced ? '− ' : '+ '}
            Erweiterte Einstellungen
          </button>

          {showAdvanced && (
            <div className={styles.advancedInputs}>
              <div className={styles.inputGroup}>
                <label>Lernziel</label>
                <input
                  type="text"
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  placeholder="z.B. 'Prüfung bestehen' oder 'Grundlagen verstehen'"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Lernzeit pro Tag</label>
                <input
                  type="number"
                  value={timePerDay}
                  onChange={(e) => setTimePerDay(e.target.value)}
                  placeholder="Stunden, z.B. 2"
                  min="0.5"
                  max="12"
                  step="0.5"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Lerntage pro Woche</label>
                <input
                  type="number"
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(e.target.value)}
                  min="1"
                  max="7"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Zieldatum</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={handleTargetDateChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={styles.input}
                />
                {targetDate && (
                  <span className={styles.dateInfo}>
                    {calculateWeeks(targetDate)} Wochen bis zum Ziel
                  </span>
                )}
              </div>
            </div>
          )}

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

        {generatedContent && !isEditing && (
          <div className={styles.resultSection}>
            <div className={styles.resultActions}>
              <button 
                className={styles.editButton}
                onClick={() => setIsEditing(true)}
              >
                <span className={styles.buttonIcon}>✏️</span>
                Lernplan bearbeiten
              </button>
            </div>
            <ContentCard
              content={generatedContent}
              confidenceScore={confidenceScore}
              topic={topic}
            />
          </div>
        )}

        {isEditing && (
          <div className={styles.editSection}>
            <h3>Lernplan überprüfen und anpassen</h3>
            <div className={styles.editContainer}>
              <textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                className={styles.editTextarea}
                rows={15}
              />
              <div className={styles.editInfo}>
                <p>
                  <span className={styles.infoIcon}>💡</span>
                  Sie können den KI-generierten Inhalt hier anpassen. 
                  Ihre Änderungen werden erst nach dem Speichern übernommen.
                </p>
              </div>
              <div className={styles.editActions}>
                <button 
                  className={styles.saveButton}
                  onClick={handleSaveEdit}
                >
                  Änderungen speichern
                </button>
                <button 
                  className={styles.cancelButton}
                  onClick={handleCancelEdit}
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage; 