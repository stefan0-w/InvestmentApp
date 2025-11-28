// Plik: SummaryCard.jsx
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Dodałem 'showChangeIcon' aby kontrolować ikonę strzałki (góra/dół)
function SummaryCard({ title, value, change, isPositive, icon, showChangeIcon = true }) {
  return (
    <div className="summary-card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <div className="icon-wrapper">{icon}</div>
      </div>
      
      <div className="card-content">
        <div className="card-value">{value}</div>
        <div className={`card-change ${isPositive ? 'text-positive' : 'text-negative'}`}>
          {/* Pokazuj ikonę tylko jeśli showChangeIcon jest true */}
          {showChangeIcon && (
            isPositive ? <TrendingUp /> : <TrendingDown />
          )}
          <span>{change}</span>
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;