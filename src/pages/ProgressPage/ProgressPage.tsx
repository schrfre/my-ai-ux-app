import React, { useState } from 'react';
import styles from './ProgressPage.module.css';
import { useLearning } from '../../context/LearningContext';
import EmptyState from '../../components/EmptyState/EmptyState';

const ProgressPage: React.FC = () => {
  const { learningPlans, updateLearningPlan } = useLearning();
  const [activeChapterIndex, setActiveChapterIndex] = useState<{ [planId: string]: number }>({});
  const [expandedChapters, setExpandedChapters] = useState<{ [key: string]: boolean }>({});

  // Funktion zum Umschalten der Kapitelansicht
  const toggleChapter = (planId: string, chapterIndex: number) => {
    const key = `${planId}-${chapterIndex}`;
    setExpandedChapters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

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

      if (updatedChapters[chapterIndex].isCompleted && chapterIndex < plan.chapters.length - 1) {
        setActiveChapterIndex(prev => ({
          ...prev,
          [planId]: chapterIndex + 1
        }));
        
        // Expandiere das nächste Kapitel automatisch
        const nextKey = `${planId}-${chapterIndex + 1}`;
        setExpandedChapters(prev => ({
          ...prev,
          [nextKey]: true
        }));

        setTimeout(() => {
          const nextChapter = document.getElementById(`chapter-${planId}-${chapterIndex + 1}`);
          if (nextChapter) {
            nextChapter.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Lernfortschritt</h1>
        <p>Verfolgen Sie Ihren Lernfortschritt und passen Sie Ihre Lernpläne an</p>
      </div>

      <div className={styles.mainSection}>
        {learningPlans.length === 0 ? (
          <EmptyState
            title="Keine Lernpläne vorhanden"
            description="Sie haben noch keine Lernpläne erstellt."
          />
        ) : (
          <div className={styles.content}>
            {learningPlans.map(plan => (
              <div key={plan.id} className={styles.progressCard}>
                <div className={styles.progressHeader}>
                  <h2>{plan.topic}</h2>
                  <div className={styles.progressInfo}>
                    <span className={styles.lastUpdated}>
                      Zuletzt aktualisiert: {new Date(plan.lastUpdated).toLocaleDateString()}
                    </span>
                    <div className={styles.chapterCount}>
                      <span className={styles.completedCount}>
                        {plan.completedChapters}/{plan.totalChapters}
                      </span>
                      Kapitel abgeschlossen
                    </div>
                  </div>
                </div>

                <div className={styles.chaptersOverview}>
                  <div className={styles.chaptersList}>
                    {plan.chapters.map((chapter, index) => (
                      <div 
                        key={index}
                        id={`chapter-${plan.id}-${index}`}
                        className={`
                          ${styles.chapter} 
                          ${chapter.isCompleted ? styles.completed : ''} 
                          ${activeChapterIndex[plan.id] === index ? styles.active : ''}
                          ${expandedChapters[`${plan.id}-${index}`] ? styles.expanded : ''}
                        `}
                      >
                        <div 
                          className={styles.chapterHeader}
                          onClick={() => toggleChapter(plan.id, index)}
                        >
                          <div className={styles.chapterTitle}>
                            <span className={styles.chapterNumber}>
                              {chapter.isCompleted ? '✓' : `${index + 1}`}
                            </span>
                            <h3>{chapter.title}</h3>
                            <span className={styles.duration}>{chapter.duration}</span>
                          </div>
                          <button
                            className={styles.expandButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleChapter(plan.id, index);
                            }}
                          >
                            {expandedChapters[`${plan.id}-${index}`] ? '▼' : '▶'}
                          </button>
                        </div>

                        {expandedChapters[`${plan.id}-${index}`] && (
                          <div className={styles.chapterContent}>
                            <div className={styles.objectives}>
                              <h4>🎯 Lernziele:</h4>
                              <ul>
                                {chapter.objectives?.map((objective, i) => (
                                  <li key={i}>{objective}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className={styles.chapterDetails}>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Schwierigkeit:</span>
                                <span className={styles.detailValue}>{chapter.difficulty}</span>
                              </div>
                              {chapter.nextRepetition && (
                                <div className={styles.detailItem}>
                                  <span className={styles.detailLabel}>Nächste Wiederholung:</span>
                                  <span className={styles.detailValue}>
                                    {new Date(chapter.nextRepetition).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>

                            <button
                              className={styles.completeButton}
                              onClick={() => handleChapterComplete(plan.id, index)}
                            >
                              {chapter.isCompleted ? 'Als unerledigt markieren' : 'Kapitel abschließen'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage; 