import React, { useState, useEffect } from 'react';
import styles from './ContentCard.module.css';
import { marked } from 'marked';
import { LearningPlan } from '../../types/LearningPlan';
import { useSettings } from '../../context/SettingsContext';

interface ContentCardProps {
  content: string;
  confidenceScore: number;
  topic: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, confidenceScore, topic }) => {
  const [htmlContent, setHtmlContent] = useState('');

  const {
    difficulty,
    targetAudience,
    automationLevel,
    language
  } = useSettings();

  useEffect(() => {
    const parseMarkdown = async () => {
      const parsed = await marked(content);
      setHtmlContent(parsed);
    };
    parseMarkdown();
  }, [content]);

  const handleSave = () => {
    const newPlan: LearningPlan = {
      id: Date.now().toString(),
      topic,
      content,
      confidenceScore,
      createdAt: new Date(),
      settings: {
        difficulty,
        targetAudience,
        automationLevel,
        language
      }
    };

    const savedPlans = localStorage.getItem('learningPlans');
    const plans: LearningPlan[] = savedPlans ? JSON.parse(savedPlans) : [];
    plans.push(newPlan);
    localStorage.setItem('learningPlans', JSON.stringify(plans));

    alert('Lernplan erfolgreich gespeichert!');
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2>{topic}</h2>
          <div className={styles.confidenceScore}>
            <span>Confidence Score:</span>
            <div className={styles.scoreBar}>
              <div 
                className={styles.scoreIndicator} 
                style={{ width: `${confidenceScore}%` }}
              />
            </div>
            <span>{confidenceScore}%</span>
          </div>
        </div>
      </div>

      <div 
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      <div className={styles.actions}>
        <button 
          className={styles.actionButton}
          onClick={() => navigator.clipboard.writeText(content)}
        >
          <span className={styles.icon}>📋</span>
          Kopieren
        </button>
        <button 
          className={styles.actionButton}
          onClick={handleSave}
        >
          <span className={styles.icon}>💾</span>
          Speichern
        </button>
        <button 
          className={styles.actionButton}
          onClick={() => window.print()}
        >
          <span className={styles.icon}>🖨️</span>
          Drucken
        </button>
      </div>
    </div>
  );
};

export default ContentCard; 