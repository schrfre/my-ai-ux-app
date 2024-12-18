import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import styles from './SettingsPage.module.css';

const SettingsPage: React.FC = () => {
  const [newAudience, setNewAudience] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const {
    difficulty,
    setDifficulty,
    targetAudience,
    setTargetAudience,
    stylePreferences,
    setStylePreferences,
    language,
    setLanguage,
    automationLevel,
    setAutomationLevel
  } = useSettings();

  const handleCustomAudienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAudience.trim()) {
      setTargetAudience(newAudience.trim());
      setNewAudience('');
      setShowCustomInput(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Einstellungen</h1>
        <p>Passen Sie die KI-Generierung an Ihre Bedürfnisse an</p>
      </div>

      <div className={styles.mainSection}>
        <div className={styles.settingsGrid}>
          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>📚</span>
              <h2>Lernplan-Einstellungen</h2>
            </div>
            <div className={styles.settingsGroup}>
              <label>Schwierigkeitsgrad</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="beginner">Anfänger</option>
                <option value="intermediate">Fortgeschritten</option>
                <option value="expert">Experte</option>
              </select>
            </div>

            <div className={styles.settingsGroup}>
              <label>Zielgruppe</label>
              {showCustomInput ? (
                <form onSubmit={handleCustomAudienceSubmit} className={styles.customInputForm}>
                  <input
                    type="text"
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value)}
                    placeholder="Neue Zielgruppe eingeben"
                    className={styles.customInput}
                  />
                  <div className={styles.customInputButtons}>
                    <button type="submit" className={styles.saveButton}>
                      Speichern
                    </button>
                    <button 
                      type="button" 
                      className={styles.cancelButton}
                      onClick={() => setShowCustomInput(false)}
                    >
                      Abbrechen
                    </button>
                  </div>
                </form>
              ) : (
                <div className={styles.audienceSelector}>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  >
                    <option value="student">Studenten</option>
                    <option value="professional">Berufstätige</option>
                    <option value="hobbyist">Hobby-Lernende</option>
                    {!['student', 'professional', 'hobbyist'].includes(targetAudience) && (
                      <option value={targetAudience}>{targetAudience}</option>
                    )}
                  </select>
                  <button 
                    className={styles.addCustomButton}
                    onClick={() => setShowCustomInput(true)}
                    title="Neue Zielgruppe hinzufügen"
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            <div className={styles.settingsGroup}>
              <label>Sprache</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="de">Deutsch</option>
                <option value="en">Englisch</option>
              </select>
            </div>
          </div>

          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🎨</span>
              <h2>Stil-Präferenzen</h2>
            </div>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={stylePreferences.formal}
                  onChange={(e) => setStylePreferences({
                    ...stylePreferences,
                    formal: e.target.checked
                  })}
                />
                <span className={styles.checkmark}></span>
                Formaler Stil
              </label>

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={stylePreferences.technical}
                  onChange={(e) => setStylePreferences({
                    ...stylePreferences,
                    technical: e.target.checked
                  })}
                />
                <span className={styles.checkmark}></span>
                Technische Details
              </label>

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={stylePreferences.examples}
                  onChange={(e) => setStylePreferences({
                    ...stylePreferences,
                    examples: e.target.checked
                  })}
                />
                <span className={styles.checkmark}></span>
                Beispiele einbinden
              </label>

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={stylePreferences.detailed}
                  onChange={(e) => setStylePreferences({
                    ...stylePreferences,
                    detailed: e.target.checked
                  })}
                />
                <span className={styles.checkmark}></span>
                Detaillierte Erklärungen
              </label>
            </div>
          </div>

          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🤖</span>
              <h2>KI-Steuerung</h2>
            </div>
            <div className={styles.settingsGroup}>
              <label>
                Automatisierungsgrad: {automationLevel}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={automationLevel}
                onChange={(e) => setAutomationLevel(Number(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.sliderLabels}>
                <span>Mehr Kontrolle</span>
                <span>Mehr Automation</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>💡</span>
            <div>
              <h3>Tipp</h3>
              <p>
                Experimentieren Sie mit verschiedenen Einstellungen, 
                um die optimale Konfiguration für Ihre Lernziele zu finden.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 