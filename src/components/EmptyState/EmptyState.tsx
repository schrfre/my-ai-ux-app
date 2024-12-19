import React from 'react';
import styles from './EmptyState.module.css';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  buttonText?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📚',
  title,
  description,
  buttonText = 'Ersten Lernplan erstellen'
}) => {
  const navigate = useNavigate();

  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateIcon}>{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
      <button 
        className={styles.createButton}
        onClick={() => navigate('/')}
      >
        <span>+</span> {buttonText}
      </button>
    </div>
  );
};

export default EmptyState; 