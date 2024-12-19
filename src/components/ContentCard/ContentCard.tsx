import React from 'react';
import styles from './ContentCard.module.css';
import MarkdownRenderer from '../MarkdownRenderer/MarkdownRenderer';

interface ContentCardProps {
  topic: string;
  content: string;
  confidenceScore: number;
  settings: {
    format: string;
    style: string;
    depth: string;
  };
}

const ContentCard: React.FC<ContentCardProps> = ({
  topic,
  content,
  confidenceScore,
  settings
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>{topic}</h2>
        <div className={styles.confidenceScore}>
          <span className={styles.scoreLabel}>KI-Konfidenz:</span>
          <div className={styles.scoreBar}>
            <div 
              className={styles.scoreFill}
              style={{ width: `${confidenceScore}%` }}
            />
          </div>
          <span className={styles.scoreValue}>{confidenceScore}%</span>
        </div>
      </div>
      <div className={styles.content}>
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
};

export default ContentCard; 