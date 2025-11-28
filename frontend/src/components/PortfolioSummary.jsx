// Plik: PortfolioSummary.jsx
import React from 'react';
import SummaryCard from './SummaryCard'; // Upewnij się, że ścieżka jest poprawna
import '../styles/PortfolioSummary.css'
import { Wallet, TrendingUp, DollarSign, Activity } from 'lucide-react';

export function PortfolioSummary({portfolioValue}) {
  return (
    // Zwykła siatka (grid) CSS zamiast klas Tailwind
    <div className="summary-grid">
      <SummaryCard
        title="Total Portfolio Value"
        value={portfolioValue.toFixed(2)}
        change="+$4,231.50 (3.52%)"
        isPositive={true}
        icon={<Wallet />}
      />
      <SummaryCard
        title="Total Gain/Loss"
        value="$18,420.15"
        change="+17.35% All Time"
        isPositive={true}
        icon={<TrendingUp />}
      />
      {/* <SummaryCard
        title="Cash Balance"
        value="$12,450.00"
        change="Available to invest"
        isPositive={true}
        icon={<DollarSign />}
        showChangeIcon={false} // Ustawione na false, aby pasowało do obrazka
      /> */}
      <SummaryCard
        title="Today's Change"
        value="$892.34"
        change="+0.72%"
        isPositive={true}
        icon={<Activity />}
      />
    </div>
  );
}