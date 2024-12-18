import React, { useState } from 'react';
import styles from './HomePage.module.css';
import ContentCard from '../../components/ContentCard/ContentCard';
import { useSettings } from '../../context/SettingsContext';
import { generateContent } from '../../services/llmService';

const HomePage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [editableContent, setEditableContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const settings = useSettings();

  const handleGenerate = async () => {
    if (!topic) return;
    setIsLoading(true);
    setError(null);

    try {
      const content = await generateContent({ topic, ...settings });
      setGeneratedContent(content);
      setEditableContent(content);
      setConfidenceScore(85);
      setIsEditing(true); // Automatisch in den Review-Modus wechseln
    } catch (err) {
      setError('Fehler bei der Generierung des Lernplans');
    } finally {
      setIsLoading(false);
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