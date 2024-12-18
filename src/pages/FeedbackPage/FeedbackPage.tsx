import React, { useState } from 'react';
import styles from './FeedbackPage.module.css';

interface FeedbackItem {
  rating: number;
  comment: string;
  contentId: string;
}

const FeedbackPage: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFeedback: FeedbackItem = {
      rating,
      comment,
      contentId: Date.now().toString(), // Später durch echte IDs ersetzen
    };
    setFeedbackList([...feedbackList, newFeedback]);
    setRating(0);
    setComment('');
  };

  return (
    <div className={styles.container}>
      <h1>Feedback</h1>
      
      <form onSubmit={handleSubmit} className={styles.feedbackForm}>
        <div className={styles.ratingGroup}>
          <label>Bewertung:</label>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`${styles.star} ${star <= rating ? styles.active : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="comment">Kommentar:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ihr Feedback hilft uns, die Inhalte zu verbessern..."
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Feedback senden
        </button>
      </form>

      <div className={styles.feedbackList}>
        <h2>Bisheriges Feedback</h2>
        {feedbackList.map((feedback) => (
          <div key={feedback.contentId} className={styles.feedbackItem}>
            <div className={styles.rating}>
              {'★'.repeat(feedback.rating)}
              {'☆'.repeat(5 - feedback.rating)}
            </div>
            <p>{feedback.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackPage; 