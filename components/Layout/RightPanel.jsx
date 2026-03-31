import React from 'react';
import { Info } from 'lucide-react';

const RightPanel = () => {
  return (
    <div className="right-panel">
      <div className="card news-card">
        <div className="header">
          <h3>LinkedIn News</h3>
          <Info size={16} />
        </div>
        <ul className="news-list">
          <li>
            <h4>Tech hiring on the rise</h4>
            <p>Top news • 10,934 readers</p>
          </li>
          <li>
            <h4>AI transforming workplaces</h4>
            <p>12h ago • 5,432 readers</p>
          </li>
          <li>
            <h4>The evolving remote work era</h4>
            <p>1d ago • 8,920 readers</p>
          </li>
        </ul>
      </div>

      <style jsx>{`
        .right-panel { position: sticky; top: calc(var(--nav-height) + 24px); }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .header h3 { font-size: 16px; }
        .news-list { display: flex; flex-direction: column; gap: 16px; }
        .news-list li { cursor: pointer; }
        .news-list h4 { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
        .news-list p { font-size: 12px; color: var(--text-secondary); }
        .news-list li:hover h4 { color: var(--accent-blue); text-decoration: underline; }
      `}</style>
    </div>
  );
};

export default RightPanel;
