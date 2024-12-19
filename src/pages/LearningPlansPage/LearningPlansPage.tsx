import React, { useState } from 'react';
import styles from './LearningPlansPage.module.css';
import { useLearning } from '../../context/LearningContext';

const LearningPlansPage: React.FC = () => {
  const { learningPlans, updateLearningPlan, deleteLearningPlan } = useLearning();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredPlans = learningPlans.filter(plan => 
    plan.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlanClick = (planId: string) => {
    if (editingPlanId !== planId) {
      setSelectedPlanId(selectedPlanId === planId ? null : planId);
    }
  };

  const handleEditClick = (planId: string, content: string) => {
    setEditingPlanId(planId);
    setEditContent(content);
  };

  const handleSaveEdit = (planId: string) => {
    updateLearningPlan(planId, { content: editContent });
    setEditingPlanId(null);
    setEditContent('');
  };

  const handleCancelEdit = () => {
    setEditingPlanId(null);
    setEditContent('');
  };

  const formatContent = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return content;
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, planId: string) => {
    e.stopPropagation();
    setShowDeleteConfirm(planId);
  };

  const handleConfirmDelete = (e: React.MouseEvent, planId: string) => {
    e.stopPropagation();
    deleteLearningPlan(planId);
    setShowDeleteConfirm(null);
    if (selectedPlanId === planId) {
      setSelectedPlanId(null);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Ihre Lernpläne</h1>
        <p>Übersicht und Verwaltung Ihrer erstellten Lernpläne</p>
      </div>

      <div className={styles.mainSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Nach Thema suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.plansGrid}>
          {filteredPlans.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>📚</div>
              <h2>Keine Lernpläne gefunden</h2>
              {searchTerm ? (
                <p>Versuchen Sie andere Suchbegriffe</p>
              ) : (
                <p>Sie haben noch keine Lernpläne erstellt</p>
              )}
            </div>
          ) : (
            filteredPlans.map(plan => (
              <div 
                key={plan.id} 
                className={`${styles.planCard} ${selectedPlanId === plan.id ? styles.expanded : ''}`}
                onClick={() => handlePlanClick(plan.id)}
              >
                <div className={styles.planHeader}>
                  <h2>{plan.topic}</h2>
                  <div className={styles.planMeta}>
                    <span className={styles.lastUpdated}>
                      Zuletzt aktualisiert: {new Date(plan.lastUpdated).toLocaleDateString()}
                    </span>
                    <span className={styles.chaptersInfo}>
                      {plan.completedChapters} von {plan.totalChapters} Kapiteln
                    </span>
                  </div>
                </div>

                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${(plan.completedChapters / plan.totalChapters) * 100}%` }}
                  />
                </div>

                {selectedPlanId === plan.id && (
                  <div className={styles.planDetails}>
                    <div className={styles.detailsGrid}>
                      <div className={styles.statsSection}>
                        <h3>Statistiken</h3>
                        <div className={styles.statsGrid}>
                          <div className={styles.statItem}>
                            <span className={styles.statIcon}>📊</span>
                            <div className={styles.statInfo}>
                              <label>Fortschritt</label>
                              <span>{Math.round((plan.completedChapters / plan.totalChapters) * 100)}%</span>
                            </div>
                          </div>
                          <div className={styles.statItem}>
                            <span className={styles.statIcon}>⭐</span>
                            <div className={styles.statInfo}>
                              <label>Schwierigkeit</label>
                              <span>{plan.difficulty}/5</span>
                            </div>
                          </div>
                          <div className={styles.statItem}>
                            <span className={styles.statIcon}>📅</span>
                            <div className={styles.statInfo}>
                              <label>Erstellt am</label>
                              <span>{new Date(plan.lastUpdated).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className={styles.statItem}>
                            <span className={styles.statIcon}>📚</span>
                            <div className={styles.statInfo}>
                              <label>Kapitel</label>
                              <span>{plan.completedChapters} von {plan.totalChapters}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={styles.contentSection}>
                        <div className={styles.contentHeader}>
                          <h3>Lernplan Details</h3>
                          <div className={styles.contentActions}>
                            {editingPlanId === plan.id ? (
                              <>
                                <button 
                                  className={styles.saveButton}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveEdit(plan.id);
                                  }}
                                >
                                  <span>💾</span> Speichern
                                </button>
                                <button 
                                  className={styles.cancelButton}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelEdit();
                                  }}
                                >
                                  <span>✖️</span> Abbrechen
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  className={styles.editButton}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClick(plan.id, plan.content);
                                  }}
                                >
                                  <span>✏️</span> Bearbeiten
                                </button>
                                <button 
                                  className={styles.deleteButton}
                                  onClick={(e) => handleDeleteClick(e, plan.id)}
                                >
                                  <span>🗑️</span> Löschen
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className={styles.planContent} onClick={(e) => e.stopPropagation()}>
                          {editingPlanId === plan.id ? (
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className={styles.editTextarea}
                            />
                          ) : (
                            <pre>{formatContent(plan.content)}</pre>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {showDeleteConfirm === plan.id && (
                  <div className={styles.deleteConfirm} onClick={(e) => e.stopPropagation()}>
                    <p>Möchten Sie diesen Lernplan wirklich löschen?</p>
                    <div className={styles.deleteActions}>
                      <button 
                        className={styles.confirmDelete}
                        onClick={(e) => handleConfirmDelete(e, plan.id)}
                      >
                        Ja, löschen
                      </button>
                      <button 
                        className={styles.cancelDelete}
                        onClick={handleCancelDelete}
                      >
                        Abbrechen
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPlansPage; 