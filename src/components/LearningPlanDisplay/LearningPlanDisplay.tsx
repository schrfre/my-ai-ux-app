import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './LearningPlanDisplay.module.css';

interface LearningPlanDisplayProps {
  content: string;
}

export const LearningPlanDisplay: React.FC<LearningPlanDisplayProps> = ({ content }) => {
  return (
    <div className={styles.container}>
      <ReactMarkdown className={styles.markdown}>{content}</ReactMarkdown>
    </div>
  );
}; 