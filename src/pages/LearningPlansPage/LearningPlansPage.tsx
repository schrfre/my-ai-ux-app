import React, { useState, useEffect } from 'react';
import styles from './LearningPlansPage.module.css';
import ContentCard from '../../components/ContentCard/ContentCard';
import { LearningPlan } from '../../types/LearningPlan';

const LearningPlansPage: React.FC = () => {
  const [learningPlans, setLearningPlans] = useState<LearningPlan[]>([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'topic'>('date');

  useEffect(() => {
    // Lade gespeicherte Lernpläne aus dem localStorage
    const loadLearningPlans = () => {
      const savedPlans = localStorage.getItem('learningPlans');
      if (savedPlans) {
        const plans: LearningPlan[] = JSON.parse(savedPlans, (key, value) => {
          if (key === 'createdAt') return new Date(value);
          return value;
        });
        setLearningPlans(plans);
      }
    };

    loadLearningPlans();
  }, []);

  const filteredAndSortedPlans = learningPlans
    .filter(plan => 
      plan.topic.toLowerCase().includes(filter.toLowerCase()) ||
      plan.settings.targetAudience.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
      return a.topic.localeCompare(b.topic);
    });

  const handleDelete = (id: string) => {
    const updatedPlans = learningPlans.filter(plan => plan.id !== id);
    setLearningPlans(updatedPlans);
    localStorage.setItem('learningPlans', JSON.stringify(updatedPlans));
  };

  return (
    <div className={styles.container}>
      <h1>Gespeicherte Lernpläne</h1>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Nach Thema oder Zielgruppe suchen..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className={styles.sortBox}>
          <label>Sortieren nach:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'topic')}
          >
            <option value="date">Datum</option>
            <option value="topic">Thema</option>
          </select>
        </div>
      </div>

      {filteredAndSortedPlans.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Keine Lernpläne gefunden</p>
          {filter && <p>Versuchen Sie andere Suchbegriffe</p>}
        </div>
      ) : (
        <div className={styles.plansList}>
          {filteredAndSortedPlans.map(plan => (
            <div key={plan.id} className={styles.planItem}>
              <ContentCard
                topic={plan.topic}
                content={plan.content}
                confidenceScore={plan.confidenceScore}
              />
              <div className={styles.planMeta}>
                <div className={styles.metaInfo}>
                  <span>Erstellt am: {plan.createdAt.toLocaleDateString()}</span>
                  <span>Schwierigkeit: {plan.settings.difficulty}</span>
                  <span>Zielgruppe: {plan.settings.targetAudience}</span>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(plan.id)}
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningPlansPage; 