import React, { useState, useEffect } from 'react';
import styles from './ExplainabilityPage.module.css';
import { LearningPlan } from '../../types/LearningPlan';
import AIExplanation from '../../components/AIExplanation/AIExplanation';

const ExplainabilityPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<LearningPlan | null>(null);
  const [learningPlans, setLearningPlans] = useState<LearningPlan[]>([]);

  const calculateCustomizationScore = (plan: LearningPlan) => {
    let score = 50;
    const stylePreferences = plan.settings.stylePreferences || {
      formal: false,
      technical: false,
      examples: false,
      detailed: false
    };
    
    if (stylePreferences.formal) score += 10;
    if (stylePreferences.technical) score += 10;
    if (stylePreferences.examples) score += 10;
    if (stylePreferences.detailed) score += 10;
    return Math.min(score, 100);
  };

  const migrateLearningPlans = (plans: LearningPlan[]) => {
    return plans.map(plan => ({
      ...plan,
      settings: {
        ...plan.settings,
        stylePreferences: plan.settings.stylePreferences || {
          formal: false,
          technical: false,
          examples: true,
          detailed: true
        }
      }
    }));
  };

  useEffect(() => {
    const loadPlans = () => {
      const savedPlans = localStorage.getItem('learningPlans');
      if (savedPlans) {
        const plans: LearningPlan[] = JSON.parse(savedPlans);
        const migratedPlans = migrateLearningPlans(plans);
        setLearningPlans(migratedPlans);
        localStorage.setItem('learningPlans', JSON.stringify(migratedPlans));
      }
    };
    loadPlans();
  }, []);

  const calculateComplexityScore = (plan: LearningPlan) => {
    const difficultyScores = {
      beginner: 30,
      intermediate: 60,
      expert: 90,
    };
    return difficultyScores[plan.settings.difficulty as keyof typeof difficultyScores] || 50;
  };

  const extractKeywords = (plan: LearningPlan) => {
    return [
      {
        keyword: plan.topic,
        weight: 100,
        explanation: "Hauptthema des Lernplans"
      },
      {
        keyword: plan.settings.difficulty,
        weight: 80,
        explanation: "Bestimmt die Komplexität der Inhalte"
      },
      {
        keyword: plan.settings.targetAudience,
        weight: 75,
        explanation: "Beeinflusst die Präsentationsform"
      },
    ];
  };

  const generateReasoningSteps = (plan: LearningPlan) => [
    {
      step: 1,
      description: "Themenanalyse",
      impact: `Analyse von "${plan.topic}" für optimale Strukturierung`
    },
    {
      step: 2,
      description: "Zielgruppenanpassung",
      impact: `Anpassung für ${plan.settings.targetAudience} mit ${plan.settings.difficulty} Niveau`
    },
    {
      step: 3,
      description: "Inhaltsgenerierung",
      impact: "Erstellung des strukturierten Lernplans"
    },
    {
      step: 4,
      description: "Qualitätsprüfung",
      impact: "Überprüfung auf Vollständigkeit und Konsistenz"
    }
  ];

  // Beispiel für die KI-Analyse-Daten
  const generateExplanationData = (plan: LearningPlan) => ({
    confidenceScores: {
      relevance: 85,
      complexity: calculateComplexityScore(plan),
      completeness: 90,
      structure: 88,
      customization: calculateCustomizationScore(plan),
    },
    keywordAnalysis: extractKeywords(plan),
    reasoningSteps: generateReasoningSteps(plan),
  });

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>KI-Erklärungen</h1>
        <p>Verstehen Sie, wie die KI Ihre Lernpläne erstellt</p>
      </div>

      <div className={styles.mainSection}>
        <div className={styles.planSelector}>
          <h2>Wählen Sie einen Lernplan</h2>
          {learningPlans.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📝</span>
              <p>Keine Lernpläne verfügbar</p>
              <p>Erstellen Sie zuerst einen Lernplan auf der Startseite</p>
            </div>
          ) : (
            <div className={styles.planList}>
              {learningPlans.map(plan => (
                <button
                  key={plan.id}
                  className={`${styles.planButton} ${selectedPlan?.id === plan.id ? styles.active : ''}`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <div className={styles.planInfo}>
                    <h3>{plan.topic}</h3>
                    <span className={styles.planMeta}>
                      Erstellt am {new Date(plan.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={styles.arrow}>→</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.explanationSection}>
          {selectedPlan ? (
            <AIExplanation
              topic={selectedPlan.topic}
              settings={selectedPlan.settings}
              {...generateExplanationData(selectedPlan)}
            />
          ) : (
            <div className={styles.selectPrompt}>
              <span className={styles.promptIcon}>👈</span>
              <p>Wählen Sie einen Lernplan aus, um die KI-Erklärung zu sehen</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplainabilityPage; 