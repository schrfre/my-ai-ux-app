import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SettingsPage.module.css';
import { useSettings } from '../../context/SettingsContext';
import { StylePreference } from '../../context/SettingsContext';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    difficulty, setDifficulty,
    targetAudience, setTargetAudience,
    stylePreferences, setStylePreferences,
    language, setLanguage,
    automationLevel, setAutomationLevel
  } = useSettings();

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Hier später: Backend-Speicherung implementieren
      // Aktuell nur lokale Simulation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Speichere in localStorage für Persistenz
      const settings = {
        difficulty,
        targetAudience,
        stylePreferences,
        language,
        automationLevel
      };
      localStorage.setItem('aiuxSettings', JSON.stringify(settings));
      
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        navigate('/'); // Optional: Zurück zur Homepage
      }, 1500);
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Einstellungen</h1>
      
      <div className={styles.settingsGroup}>
        <h2>Persönliche Präferenzen</h2>
        
        <div className={styles.inputGroup}>
          <label htmlFor="difficulty">Standard-Schwierigkeitsgrad:</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="beginner">Anfänger</option>
            <option value="medium">Fortgeschritten</option>
            <option value="expert">Experte</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="targetAudience">Standard-Zielgruppe:</label>
          <input
            id="targetAudience"
            type="text"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="z.B. Entwickler, Studenten..."
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="language">Bevorzugte Sprache:</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="deutsch">Deutsch</option>
            <option value="english">English</option>
          </select>
        </div>

        <div className={styles.checkboxGroup}>
          <h3>Stilvorlieben</h3>
          <label>
            <input
              type="checkbox"
              checked={stylePreferences.formal}
              onChange={() => setStylePreferences((prev: StylePreference) => ({
                ...prev,
                formal: !prev.formal
              }))}
            />
            Formaler Schreibstil
          </label>
          <label>
            <input
              type="checkbox"
              checked={stylePreferences.technical}
              onChange={() => setStylePreferences((prev: StylePreference) => ({
                ...prev,
                technical: !prev.technical
              }))}
            />
            Technische Details bevorzugt
          </label>
          <label>
            <input
              type="checkbox"
              checked={stylePreferences.examples}
              onChange={() => setStylePreferences((prev: StylePreference) => ({
                ...prev,
                examples: !prev.examples
              }))}
            />
            Mit Codebeispielen
          </label>
          <label>
            <input
              type="checkbox"
              checked={stylePreferences.detailed}
              onChange={() => setStylePreferences((prev: StylePreference) => ({
                ...prev,
                detailed: !prev.detailed
              }))}
            />
            Ausführliche Erklärungen
          </label>
        </div>

        <div className={styles.sliderContainer}>
          <label htmlFor="automation">Automatisierungsgrad: {automationLevel}%</label>
          <input
            id="automation"
            type="range"
            min="0"
            max="100"
            value={automationLevel}
            onChange={(e) => setAutomationLevel(Number(e.target.value))}
            className={styles.slider}
          />
          <div className={styles.sliderLabels}>
            <span>Manuell</span>
            <span>Voll automatisch</span>
          </div>
        </div>

        <div className={styles.saveSection}>
          <button 
            className={styles.saveButton}
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? 'Speichere...' : 'Einstellungen speichern'}
          </button>
          
          {saveSuccess && (
            <div className={styles.successMessage}>
              ✓ Einstellungen erfolgreich gespeichert
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 