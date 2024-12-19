import React, { useState } from 'react';
import styles from './AIExplanation.module.css';

// Optionaler Import mit Fallback
let RechartsComponents: any;
try {
  RechartsComponents = require('recharts');
} catch {
  RechartsComponents = null;
}

interface AIExplanationProps {
  topic: string;
  settings: any;
  confidenceScores: {
    relevance: number;
    complexity: number;
    completeness: number;
    structure: number;
    customization: number;
  };
  keywordAnalysis: {
    keyword: string;
    weight: number;
    explanation: string;
  }[];
  reasoningSteps: {
    step: number;
    description: string;
    impact: string;
  }[];
}

const AIExplanation: React.FC<AIExplanationProps> = ({
  topic,
  settings,
  confidenceScores,
  keywordAnalysis,
  reasoningSteps
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'process'>('overview');

  const radarData = [
    { subject: 'Relevanz', value: confidenceScores.relevance },
    { subject: 'Komplexität', value: confidenceScores.complexity },
    { subject: 'Vollständigkeit', value: confidenceScores.completeness },
    { subject: 'Struktur', value: confidenceScores.structure },
    { subject: 'Anpassung', value: confidenceScores.customization },
  ];

  // Fallback Visualization wenn recharts nicht verfügbar ist
  const FallbackVisualization = () => (
    <div className={styles.fallbackChart}>
      {radarData.map((item, index) => (
        <div key={index} className={styles.fallbackMetric}>
          <div className={styles.fallbackLabel}>{item.subject}</div>
          <div className={styles.fallbackBar}>
            <div 
              className={styles.fallbackProgress} 
              style={{ width: `${item.value}%` }}
            >
              {item.value}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const RadarVisualization = () => {
    if (!RechartsComponents) return <FallbackVisualization />;
    
    const { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } = RechartsComponents;
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid />
          <PolarAngleAxis 
            dataKey="subject"
            tick={{ fill: '#2c3e50', fontSize: 14 }}
          />
          <Radar
            name="Konfidenz"
            dataKey="value"
            stroke="#00c6fb"
            fill="#00c6fb"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Übersicht
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'details' ? styles.active : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'process' ? styles.active : ''}`}
          onClick={() => setActiveTab('process')}
        >
          Prozess
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className={styles.overview}>
          <div className={styles.radarChart}>
            <h3>KI-Konfidenz-Analyse</h3>
            <RadarVisualization />
          </div>

          <div className={styles.summaryCards}>
            <div className={styles.summaryCard}>
              <h4>Themenanalyse</h4>
              <p>Hauptthema: <strong>{topic}</strong></p>
              <p>Schwierigkeitsgrad: <strong>{settings.difficulty}</strong></p>
              <p>Zielgruppe: <strong>{settings.targetAudience}</strong></p>
            </div>

            <div className={styles.summaryCard}>
              <h4>KI-Anpassungen</h4>
              <div className={styles.adaptations}>
                {settings.stylePreferences.formal && (
                  <span className={styles.adaptation}>Formaler Stil</span>
                )}
                {settings.stylePreferences.technical && (
                  <span className={styles.adaptation}>Technisch</span>
                )}
                {settings.stylePreferences.examples && (
                  <span className={styles.adaptation}>Mit Beispielen</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'details' && (
        <div className={styles.details}>
          <div className={styles.keywordAnalysis}>
            <h3>Schlüsselwort-Analyse</h3>
            <div className={styles.keywords}>
              {keywordAnalysis.map((keyword, index) => (
                <div key={index} className={styles.keywordCard}>
                  <div className={styles.keywordHeader}>
                    <span className={styles.keyword}>{keyword.keyword}</span>
                    <span className={styles.weight} style={{
                      background: `linear-gradient(90deg, #00c6fb ${keyword.weight}%, transparent ${keyword.weight}%)`
                    }}>{keyword.weight}%</span>
                  </div>
                  <p>{keyword.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.contextualFactors}>
            <h3>Kontextuelle Faktoren</h3>
            <div className={styles.factorGrid}>
              <div className={styles.factor}>
                <span className={styles.factorIcon}>🎯</span>
                <h4>Lernziel-Ausrichtung</h4>
                <p>Anpassung an {settings.targetAudience}-spezifische Anforderungen</p>
              </div>
              <div className={styles.factor}>
                <span className={styles.factorIcon}>📊</span>
                <h4>Komplexitätssteuerung</h4>
                <p>Basierend auf {settings.difficulty} Niveau</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'process' && (
        <div className={styles.process}>
          <div className={styles.timeline}>
            {reasoningSteps.map((step, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineNumber}>{step.step}</div>
                <div className={styles.timelineContent}>
                  <h4>{step.description}</h4>
                  <p>{step.impact}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.aiThoughts}>
            <h3>KI-Gedankengang</h3>
            <div className={styles.thoughtProcess}>
              <div className={styles.thoughtStep}>
                <span className={styles.stepIcon}>🔍</span>
                <h4>Analyse</h4>
                <p>Thema und Kontext werden analysiert</p>
              </div>
              <div className={styles.thoughtStep}>
                <span className={styles.stepIcon}>🎯</span>
                <h4>Zielbestimmung</h4>
                <p>Lernziele werden definiert</p>
              </div>
              <div className={styles.thoughtStep}>
                <span className={styles.stepIcon}>📝</span>
                <h4>Strukturierung</h4>
                <p>Inhalte werden organisiert</p>
              </div>
              <div className={styles.thoughtStep}>
                <span className={styles.stepIcon}>⚡</span>
                <h4>Generierung</h4>
                <p>Lernplan wird erstellt</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIExplanation; 