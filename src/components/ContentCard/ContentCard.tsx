import React, { useState, useEffect } from 'react';
import styles from './ContentCard.module.css';
import { marked } from 'marked';
import { LearningPlan, StylePreferences } from '../../types/LearningPlan';
import { useSettings } from '../../context/SettingsContext';
import { generateId } from '../../utils/helpers';

interface ContentCardProps {
  content: string;
  confidenceScore: number;
  topic: string;
  difficulty?: string;
  targetAudience?: string;
  automationLevel?: number;
  language?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({
  topic,
  content,
  confidenceScore,
  difficulty,
  targetAudience,
  automationLevel,
  language
}) => {
  const [htmlContent, setHtmlContent] = useState('');
  const settings = useSettings();

  const effectiveDifficulty = difficulty || settings.difficulty;
  const effectiveTargetAudience = targetAudience || settings.targetAudience;
  const effectiveAutomationLevel = automationLevel || settings.automationLevel;
  const effectiveLanguage = language || settings.language;

  useEffect(() => {
    const parseMarkdown = async () => {
      const parsed = await marked(content);
      setHtmlContent(parsed);
    };
    parseMarkdown();
  }, [content]);

  const handleSave = () => {
    const defaultStylePreferences: StylePreferences = {
      formal: false,
      technical: false,
      examples: true,
      detailed: true
    };

    const newPlan: LearningPlan = {
      id: generateId(),
      topic,
      content,
      confidenceScore,
      createdAt: new Date(),
      settings: {
        difficulty: effectiveDifficulty,
        targetAudience: effectiveTargetAudience,
        automationLevel: effectiveAutomationLevel,
        language: effectiveLanguage,
        stylePreferences: defaultStylePreferences
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