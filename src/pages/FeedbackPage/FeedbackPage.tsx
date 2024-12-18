import React, { useState } from 'react';
import styles from './FeedbackPage.module.css';

const FeedbackPage: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuliere API-Call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
    setFeedback('');
    setRating(0);
    setCategory('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Feedback</h1>
        <p>Helfen Sie uns, die KI-Lernplan-Generierung zu verbessern</p>
      </div>

      <div className={styles.mainSection}>
        {submitted ? (
          <div className={styles.successCard}>
            <span className={styles.successIcon}>✓</span>
            <h2>Vielen Dank für Ihr Feedback!</h2>
            <p>Ihre Rückmeldung hilft uns, unseren Service zu verbessern.</p>
            <button 
              className={styles.newFeedbackButton}
              onClick={() => setSubmitted(false)}
            >
              Weiteres Feedback geben
            </button>
          </div>
        ) : (
          <form className={styles.feedbackForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Kategorie</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Bitte wählen</option>
                <option value="content">Inhalt der Lernpläne</option>
                <option value="usability">Benutzerfreundlichkeit</option>
                <option value="performance">Performance</option>
                <option value="feature">Feature-Vorschlag</option>
                <option value="bug">Fehlermeldung</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Bewertung</label>
              <div className={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`${styles.starButton} ${star <= rating ? styles.active : ''}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Ihr Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Beschreiben Sie Ihre Erfahrungen oder Vorschläge..."
                required
                rows={5}
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className={styles.loadingSpinner}>
                  <div className={styles.spinner}></div>
                  <span>Wird gesendet...</span>
                </div>
              ) : (
                'Feedback senden'
              )}
            </button>
          </form>
        )}

        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>🎯</span>
            <h3>Direktes Feedback</h3>
            <p>Ihre Rückmeldung geht direkt an unser Entwicklungsteam</p>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>⚡</span>
            <h3>Schnelle Umsetzung</h3>
            <p>Wir arbeiten kontinuierlich an Verbesserungen</p>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>🤝</span>
            <h3>Community-Driven</h3>
            <p>Ihre Meinung gestaltet die Zukunft der App</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage; 