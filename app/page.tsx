'use client';
import { useState } from 'react';

export default function UserDashboard() {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, review })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setResponse(data.message);
      setRating(0);
      setReview('');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Share Your Feedback</h1>
        <p className="subtitle">We value your opinion and would love to hear from you!</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">How would you rate your experience?</label>
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="star-button"
                >
                  {star <= rating ? '⭐' : '☆'}
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="rating-text">
                You selected {rating} star{rating !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="label">Tell us more (optional)</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts, suggestions, or experience..."
              className="textarea"
              rows={4}
              maxLength={1000}
            />
            <p className="char-count">{review.length}/1000 characters</p>
          </div>

          <button
            type="submit"
            disabled={loading || rating === 0}
            className="submit-button"
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Processing...
              </>
            ) : (
              'Submit Feedback'
            )}
          </button>
        </form>

        {response && (
          <div className="alert alert-success">
            <div className="alert-icon">✓</div>
            <div>
              <h3 className="alert-title">Thank you for your feedback!</h3>
              <p className="alert-message">{response}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <div className="alert-icon">⚠</div>
            <div>
              <h3 className="alert-title">Error</h3>
              <p className="alert-message">{error}</p>
            </div>
          </div>
        )}
      </div>

      <div className="link">
        <a href="/admin">Admin Dashboard →</a>
      </div>
    </div>
  );
}