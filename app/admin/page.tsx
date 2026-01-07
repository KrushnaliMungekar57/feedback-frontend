'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/submissions`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch submissions');
      }
      
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredSubmissions = data?.submissions?.filter(
    (s: any) => filter === 'all' || s.rating === parseInt(filter)
  ) || [];

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="header-top">
          <div>
            <h1 className="title">Admin Dashboard</h1>
            <p className="subtitle" style={{marginBottom: 0}}>Real-time feedback monitoring (auto-refreshes every 10s)</p>
          </div>
          <button onClick={fetchData} disabled={loading} className="refresh-button">
            <span style={{display: 'inline-block', animation: loading ? 'spin 0.8s linear infinite' : 'none'}}>🔄</span>
            Refresh
          </button>
        </div>

        {data?.stats && (
          <div className="stats-grid">
            <div className="stat-card blue">
              <div>
                <p className="stat-label">Total Reviews</p>
                <p className="stat-value">{data.stats.total}</p>
              </div>
              <div className="stat-icon">👥</div>
            </div>

            <div className="stat-card green">
              <div>
                <p className="stat-label">Average Rating</p>
                <p className="stat-value">{data.stats.averageRating}</p>
              </div>
              <div className="stat-icon">📊</div>
            </div>

            <div className="stat-card yellow">
              <div>
                <p className="stat-label">5-Star Reviews</p>
                <p className="stat-value">{data.stats.byRating[5]}</p>
              </div>
              <div className="stat-icon">⭐</div>
            </div>

            <div className="stat-card red">
              <div>
                <p className="stat-label">Low Ratings (1-2)</p>
                <p className="stat-value">{data.stats.byRating[1] + data.stats.byRating[2]}</p>
              </div>
              <div className="stat-icon">⚠️</div>
            </div>
          </div>
        )}

        <div className="filters">
          <button
            onClick={() => setFilter('all')}
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          >
            All ({data?.stats?.total || 0})
          </button>
          {[5, 4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => setFilter(rating.toString())}
              className={`filter-button ${filter === rating.toString() ? 'active' : ''}`}
            >
              {rating} ★ ({data?.stats?.byRating[rating] || 0})
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{marginBottom: '24px'}}>
          <div className="alert-icon">⚠</div>
          <p>Error: {error}</p>
        </div>
      )}

      <div className="submissions-list">
        {filteredSubmissions.map((submission: any) => (
          <div key={submission.id} className="submission-card">
            <div className="submission-header">
              <div className="submission-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < submission.rating ? '⭐' : '☆'}</span>
                ))}
              </div>
              <span className="timestamp">
                {new Date(submission.timestamp).toLocaleString()}
              </span>
            </div>

            <div className="submission-content">
              <div className="content-section">
                <h3 className="section-title">Customer Review</h3>
                <p className="section-text">
                  {submission.review || <em>No review text provided</em>}
                </p>
              </div>

              <div className="content-section">
                <h3 className="section-title">AI Summary</h3>
                <p className="section-text">{submission.summary}</p>
              </div>

              <div className="content-section">
                <h3 className="section-title">Recommended Actions</h3>
                <p className="section-text">{submission.recommendedActions}</p>
              </div>
            </div>
          </div>
        ))}

        {filteredSubmissions.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-title">No submissions yet</p>
            <p className="empty-subtitle">Submissions will appear here in real-time</p>
          </div>
        )}
      </div>

      <div className="link">
        <a href="/">← Back to User Dashboard</a>
      </div>
    </div>
  );
}