import React, { useState, useEffect } from 'react';
import styles from './ExplainabilityPage.module.css';
import { LearningPlan } from '../../types/LearningPlan';

interface Explanation {
  reasoning: string;
  structureExplanation: string;
  contentDecisions: {
    title: string;
    explanation: string;
  }[];
  aiParameters: {
    parameter: string;
    value: string;
    impact: string;
  }[];
}

const ExplainabilityPage: React.FC = () => {
  const [learningPlans, setLearningPlans] = useState<LearningPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<LearningPlan | null>(null);
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadPlans = () => {
      const savedPlans = localStorage.getItem('learningPlans');
      if (savedPlans) {
        const plans: LearningPlan[] = JSON.parse(savedPlans, (key, value) => {
          if (key === 'createdAt') return new Date(value);
          return value;
        });
        setLearningPlans(plans);
      }
    };
    loadPlans();
  }, []);

  const generateExplanation = async (plan: LearningPlan) => {
    setIsLoading(true);
    // Hier später: Echte API-Anfrage an das LLM
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Beispiel-Erklärung
    const explanation: Explanation = {
      reasoning: `Der Lernplan wurde basierend auf dem Thema "${plan.topic}" und dem Schwierigkeitsgrad "${plan.settings.difficulty}" erstellt. Die Zielgruppe "${plan.settings.targetAudience}" wurde besonders berücksichtigt.`,
      structureExplanation: "Der Plan folgt einem progressiven Aufbau, beginnend mit Grundlagen und schrittweiser Steigerung der Komplexität.",
      contentDecisions: [
        {
          title: "Auswahl der Themengebiete",
          explanation: "Die Hauptthemen wurden nach Relevanz und logischer Reihenfolge ausgewählt."
        },
        {
          title: "Detailtiefe",
          explanation: `Basierend auf dem Automatisierungsgrad von ${plan.settings.automationLevel}% wurde die Detailtiefe angepasst.`
        },
        {
          title: "Beispiele und Übungen",
          explanation: "Praktische Beispiele wurden entsprechend der Zielgruppe ausgewählt."
        }
      ],
      aiParameters: [
        {
          parameter: "Schwierigkeitsgrad",
          value: plan.settings.difficulty,
          impact: "Beeinflusst die Komplexität der Erklärungen und Beispiele"
        },
        {
          parameter: "Zielgruppe",
          value: plan.settings.targetAudience,
          impact: "Bestimmt die Art der Beispiele und den Kontext"
        },
        {
          parameter: "Sprache",
          value: plan.settings.language,
          impact: "Legt die Fachsprache und Terminologie fest"
        }
      ]
    };
    
    setExplanation(explanation);
    setIsLoading(false);
  };

  const handlePlanSelect = (plan: LearningPlan) => {
    setSelectedPlan(plan);
    generateExplanation(plan);
  };

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
              <p>Noch keine Lernpläne erstellt</p>
              <p>Erstellen Sie zuerst einen Lernplan auf der Startseite</p>
            </div>
          ) : (
            <div className={styles.planList}>
              {learningPlans.map(plan => (
                <button
                  key={plan.id}
                  className={`${styles.planButton} ${selectedPlan?.id === plan.id ? styles.active : ''}`}
                  onClick={() => handlePlanSelect(plan)}
                >
                  <div className={styles.planInfo}>
                    <h3>{plan.topic}</h3>
                    <span className={styles.planMeta}>
                      Erstellt am: {plan.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <span className={styles.arrow}>→</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedPlan && (
          <div className={styles.explanationSection}>
            {isLoading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Analysiere Lernplan...</p>
              </div>
            ) : explanation ? (
              <>
                <div className={styles.explanationCard}>
                  <h2>KI-Gedankengang</h2>
                  <p>{explanation.reasoning}</p>
                  <div className={styles.divider}></div>
                  <h3>Struktureller Aufbau</h3>
                  <p>{explanation.structureExplanation}</p>
                </div>

                <div className={styles.explanationGrid}>
                  <div className={styles.gridCard}>
                    <h3>Entscheidungsprozess</h3>
                    {explanation.contentDecisions.map((decision, index) => (
                      <div key={index} className={styles.decision}>
                        <h4>{decision.title}</h4>
                        <p>{decision.explanation}</p>
                      </div>
                    ))}
                  </div>

                  <div className={styles.gridCard}>
                    <h3>Einfluss der Parameter</h3>
                    {explanation.aiParameters.map((param, index) => (
                      <div key={index} className={styles.parameter}>
                        <div className={styles.parameterHeader}>
                          <h4>{param.parameter}</h4>
                          <span className={styles.parameterValue}>{param.value}</span>
                        </div>
                        <p>{param.impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplainabilityPage; 