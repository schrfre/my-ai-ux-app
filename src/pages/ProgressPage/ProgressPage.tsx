import React from 'react';
import styles from './ProgressPage.module.css';
import { useLearning } from '../../context/LearningContext';

const ProgressPage: React.FC = () => {
  const { learningPlans, updateLearningPlan } = useLearning();

  const handleChapterComplete = (planId: string, chapterIndex: number) => {
    const plan = learningPlans.find(p => p.id === planId);
    if (plan) {
      const updatedChapters = [...plan.chapters];
      updatedChapters[chapterIndex].isCompleted = !updatedChapters[chapterIndex].isCompleted;
      
      const completedCount = updatedChapters.filter(ch => ch.isCompleted).length;
      
      updateLearningPlan(planId, {
        chapters: updatedChapters,
        completedChapters: completedCount
      });
    }
  };

  const handleFeedback = (planId: string, type: 'difficulty' | 'relevance', value: number) => {
    updateLearningPlan(planId, {
      [type]: value
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Lernfortschritt & Anpassung</h1>
        <p>Verfolgen Sie Ihren Lernfortschritt und passen Sie Ihre Lernpläne an Ihre Bedürfnisse an</p>
      </div>

      <div className={styles.mainSection}>
        <div className={styles.content}>
          {learningPlans.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>📚</div>
              <h2>Keine Lernpläne vorhanden</h2>
              <p>Sie haben noch keine Lernpläne erstellt.</p>
              <button 
                className={styles.createButton}
                onClick={() => window.location.href = '/'}
              >
                <span>+</span> Ersten Lernplan erstellen
              </button>
            </div>
          ) : (
            learningPlans.map(plan => (
              <div key={plan.id} className={styles.progressCard}>
                <div className={styles.progressHeader}>
                  <h2>{plan.topic}</h2>
                  <span className={styles.lastUpdated}>
                    Zuletzt aktualisiert: {plan.lastUpdated.toLocaleDateString()}
                  </span>
                </div>

                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${(plan.completedChapters / plan.totalChapters) * 100}%` }}
                  />
                  <span className={styles.progressText}>
                    {plan.completedChapters} von {plan.totalChapters} Kapiteln abgeschlossen
                  </span>
                </div>

                <div className={styles.chapters}>
                  {plan.chapters.map((chapter, index) => (
                    <div key={index} className={styles.chapter}>
                      <div className={styles.chapterHeader}>
                        <h3>{chapter.title}</h3>
                        <button
                          className={`${styles.completeButton} ${chapter.isCompleted ? styles.completed : ''}`}
                          onClick={() => handleChapterComplete(plan.id, index)}
                        >
                          {chapter.isCompleted ? '✓' : 'Abschließen'}
                        </button>
                      </div>
                      <div className={styles.chapterContent}>
                        <p>{chapter.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.feedbackSection}>
                  <div className={styles.feedbackItem}>
                    <label>Schwierigkeit</label>
                    <div className={styles.ratingButtons}>
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          className={`${styles.ratingButton} ${plan.difficulty === rating ? styles.active : ''}`}
                          onClick={() => handleFeedback(plan.id, 'difficulty', rating)}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.feedbackItem}>
                    <label>Relevanz</label>
                    <div className={styles.ratingButtons}>
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          className={`${styles.ratingButton} ${plan.relevance === rating ? styles.active : ''}`}
                          onClick={() => handleFeedback(plan.id, 'relevance', rating)}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button className={styles.adjustButton}>
                    Plan anpassen
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage; 