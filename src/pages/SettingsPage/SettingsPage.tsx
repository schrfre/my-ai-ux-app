import React from 'react';
import styles from './SettingsPage.module.css';
import { useSettings } from '../../context/SettingsContext';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const handleFormatChange = (format: string) => {
    updateSettings({
      explainability: {
        ...settings.explainability,
        stylePreferences: {
          ...settings.explainability.stylePreferences,
          format
        }
      }
    });
  };

  const handleStyleChange = (style: string) => {
    updateSettings({
      explainability: {
        ...settings.explainability,
        stylePreferences: {
          ...settings.explainability.stylePreferences,
          style
        }
      }
    });
  };

  const handleDepthChange = (depth: string) => {
    updateSettings({
      explainability: {
        ...settings.explainability,
        stylePreferences: {
          ...settings.explainability.stylePreferences,
          depth
        }
      }
    });
  };

  const handleAutomationChange = (automation: string) => {
    updateSettings({
      automation: automation
    });
  };

  const handleLanguageChange = (language: string) => {
    updateSettings({
      language: language
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Einstellungen</h1>
        <p>Passen Sie Ihren Lernplan an Ihre Bedürfnisse an</p>
      </div>

      <div className={styles.settingsContainer}>
        <div className={styles.settingsGroup}>
          <div className={styles.groupHeader}>
            <span className={styles.icon}>⚙️</span>
            <h2>Lernplan-Format</h2>
          </div>
          <div className={styles.settingsList}>
            <div className={styles.setting}>
              <label>Format</label>
              <select
                value={settings.explainability?.stylePreferences?.format}
                onChange={(e) => handleFormatChange(e.target.value)}
                className={styles.select}
              >
                <option value="structured">Strukturiert</option>
                <option value="narrative">Erzählend</option>
                <option value="bullet">Stichpunkte</option>
              </select>
            </div>
            <div className={styles.setting}>
              <label>Stil</label>
              <select
                value={settings.explainability?.stylePreferences?.style}
                onChange={(e) => handleStyleChange(e.target.value)}
                className={styles.select}
              >
                <option value="detailed">Detailliert</option>
                <option value="concise">Prägnant</option>
                <option value="casual">Locker</option>
              </select>
            </div>
            <div className={styles.setting}>
              <label>Tiefe</label>
              <select
                value={settings.explainability?.stylePreferences?.depth}
                onChange={(e) => handleDepthChange(e.target.value)}
                className={styles.select}
              >
                <option value="beginner">Anfänger</option>
                <option value="intermediate">Fortgeschritten</option>
                <option value="expert">Experte</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.settingsGroup}>
          <div className={styles.groupHeader}>
            <span className={styles.icon}>🤖</span>
            <h2>KI-Anpassung</h2>
          </div>
          <div className={styles.settingsList}>
            <div className={styles.setting}>
              <label>Automatisierungsgrad</label>
              <select
                value={settings.automation}
                onChange={(e) => handleAutomationChange(e.target.value)}
                className={styles.select}
              >
                <option value="low">Minimal (mehr manuelle Kontrolle)</option>
                <option value="medium">Ausgewogen</option>
                <option value="high">Maximal (vollautomatisch)</option>
              </select>
            </div>
            <div className={styles.setting}>
              <label>Sprache der Erklärungen</label>
              <select
                value={settings.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className={styles.select}
              >
                <option value="de">Deutsch</option>
                <option value="en">Englisch</option>
                <option value="simple">Vereinfachtes Deutsch</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.settingsGroup}>
          <div className={styles.groupHeader}>
            <span className={styles.icon}>🎯</span>
            <h2>Lernziele</h2>
          </div>
          <div className={styles.settingsList}>
            <div className={styles.setting}>
              <label>Übungsaufgaben einbinden</label>
              <select
                value={settings.includeExercises}
                onChange={(e) => updateSettings({ includeExercises: e.target.value })}
                className={styles.select}
              >
                <option value="none">Keine</option>
                <option value="few">Wenige (1-2 pro Kapitel)</option>
                <option value="medium">Mittel (3-4 pro Kapitel)</option>
                <option value="many">Viele (5+ pro Kapitel)</option>
              </select>
            </div>
            <div className={styles.setting}>
              <label>Wiederholungsintervalle</label>
              <select
                value={settings.repetitionInterval}
                onChange={(e) => updateSettings({ repetitionInterval: e.target.value })}
                className={styles.select}
              >
                <option value="none">Keine Wiederholungen</option>
                <option value="daily">Täglich</option>
                <option value="weekly">Wöchentlich</option>
                <option value="custom">Benutzerdefiniert</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 