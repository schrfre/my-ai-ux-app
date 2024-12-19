import React, { useEffect, useState } from 'react';
import styles from './ContentCard.module.css';

interface ContentCardProps {
  content: string;
  confidenceScore: number;
  topic: string;
  settings?: {
    format?: string;
    style?: string;
    depth?: string;
  };
}

const ContentCard: React.FC<ContentCardProps> = ({
  content,
  confidenceScore,
  topic,
  settings: propSettings
}) => {
  const [formattedContent, setFormattedContent] = useState('');

  const settings = propSettings || {
    format: 'structured',
    style: 'detailed',
    depth: 'intermediate'
  };

  useEffect(() => {
    const formatted = content
      .split('\n')
      .map(line => {
        if (line.startsWith('# ')) {
          return `<h1>${line.slice(2)}</h1>`;
        }
        if (line.startsWith('## ')) {
          return `<h2>${line.slice(3)}</h2>`;
        }
        if (line.startsWith('- ')) {
          return `<li>${line.slice(2)}</li>`;
        }
        if (line.trim() === '') {
          return '<br>';
        }
        return `<p>${line}</p>`;
      })
      .join('');
    setFormattedContent(formatted);
  }, [content]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>{topic}</h2>
        <div className={styles.confidenceScore}>
          <span>KI-Konfidenz: {confidenceScore}%</span>
        </div>
      </div>
      <div 
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
      <div className={styles.footer}>
        <div className={styles.settings}>
          <span>Format: {settings.format || 'Standard'}</span>
          <span>Stil: {settings.style || 'Normal'}</span>
          <span>Tiefe: {settings.depth || 'Mittel'}</span>
        </div>
      </div>
    </div>
  );
};

export default ContentCard; 