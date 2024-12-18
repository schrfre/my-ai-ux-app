import React, { useState, useEffect } from 'react';
import styles from './LearningPlansPage.module.css';
import ContentCard from '../../components/ContentCard/ContentCard';
import { LearningPlan } from '../../types/LearningPlan';

const LearningPlansPage: React.FC = () => {
  const [learningPlans, setLearningPlans] = useState<LearningPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<LearningPlan | null>(null);
  const [filter, setFilter] = useState('');
  const [editingPlan, setEditingPlan] = useState<LearningPlan | null>(null);
  const [editableContent, setEditableContent] = useState('');

  useEffect(() => {
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

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Verhindert das Öffnen des Plans beim Löschen
    const updatedPlans = learningPlans.filter(plan => plan.id !== id);
    setLearningPlans(updatedPlans);
    localStorage.setItem('learningPlans', JSON.stringify(updatedPlans));
    if (selectedPlan?.id === id) {
      setSelectedPlan(null);
    }
  };

  const handlePlanClick = (plan: LearningPlan) => {
    setSelectedPlan(selectedPlan?.id === plan.id ? null : plan);
  };

  const filteredPlans = learningPlans.filter(plan => 
    plan.topic.toLowerCase().includes(filter.toLowerCase())
  );

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      beginner: 'Anfänger',
      intermediate: 'Fortgeschritten',
      expert: 'Experte'
    };
    return labels[difficulty as keyof typeof labels] || difficulty;
  };

  const getAudienceLabel = (audience: string) => {
    const labels = {
      student: 'Student',
      professional: 'Berufstätig',
      hobbyist: 'Hobby'
    };
    return labels[audience as keyof typeof labels] || audience;
  };

  const handleEdit = (plan: LearningPlan, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPlan(plan);
    setEditableContent(plan.content);
  };

  const handleSaveEdit = () => {
    if (!editingPlan) return;

    const updatedPlans = learningPlans.map(plan => 
      plan.id === editingPlan.id 
        ? { ...plan, content: editableContent }
        : plan
    );

    setLearningPlans(updatedPlans);
    localStorage.setItem('learningPlans', JSON.stringify(updatedPlans));
    setEditingPlan(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Gespeicherte Lernpläne</h1>
        <p>Ihre persönliche Sammlung von KI-generierten Lernplänen</p>
      </div>

      <div className={styles.mainSection}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Nach Thema suchen..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        {filteredPlans.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📚</span>
            <p>Keine Lernpläne gefunden</p>
            {filter && <p>Versuchen Sie andere Suchbegriffe</p>}
          </div>
        ) : (
          <div className={styles.plansList}>
            {filteredPlans.map(plan => (
              <div key={plan.id}>
                <div 
                  className={`${styles.planItem} ${selectedPlan?.id === plan.id ? styles.active : ''}`}
                  onClick={() => handlePlanClick(plan)}
                >
                  <div className={styles.planTitle}>
                    {plan.topic}
                  </div>
                  <div className={styles.planMeta}>
                    <span className={styles.date}>
                      {plan.createdAt.toLocaleDateString()}
                    </span>
                    <span className={styles.difficulty}>
                      {getDifficultyLabel(plan.settings.difficulty)}
                    </span>
                    <span className={styles.audience}>
                      {getAudienceLabel(plan.settings.targetAudience)}
                    </span>
                    <div className={styles.planActions}>
                      <button
                        className={styles.editButton}
                        onClick={(e) => handleEdit(plan, e)}
                        title="Lernplan bearbeiten"
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={(e) => handleDelete(plan.id, e)}
                        title="Lernplan löschen"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
                {editingPlan?.id === plan.id ? (
                  <div className={styles.editSection}>
                    <textarea
                      value={editableContent}
                      onChange={(e) => setEditableContent(e.target.value)}
                      className={styles.editTextarea}
                      rows={15}
                    />
                    <div className={styles.editActions}>
                      <button 
                        className={styles.saveButton}
                        onClick={handleSaveEdit}
                      >
                        Änderungen speichern
                      </button>
                      <button 
                        className={styles.cancelButton}
                        onClick={() => setEditingPlan(null)}
                      >
                        Abbrechen
                      </button>
                    </div>
                  </div>
                ) : selectedPlan?.id === plan.id && (
                  <div className={styles.planContent}>
                    <ContentCard
                      topic={plan.topic}
                      content={plan.content}
                      confidenceScore={plan.confidenceScore}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPlansPage; 