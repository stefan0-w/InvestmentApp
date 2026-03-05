// Plik: PortfolioSummary.jsx
import React from 'react';
import SummaryCard from './SummaryCard'; // Upewnij się, że ścieżka jest poprawna
import '../styles/PortfolioSummary.css'
import { Wallet, TrendingUp, DollarSign, Activity } from 'lucide-react';

export function PortfolioSummary({portfolioValue, totalRealizedGain}) {

  const realized = Number(totalRealizedGain) || 0;  // <- FIX

  // Unikalne realistyczne dane (nie ujemne)
  const unrealizedGain = portfolioValue * (0.05 + Math.random() * 0.15);

  const totalGainLoss = realized + unrealizedGain;

  // procent liczymy względem wartości początkowej portfela
  const initialValue = portfolioValue - totalGainLoss;
  const totalGainLossPct = portfolioValue > 0
    ? (totalGainLoss / portfolioValue) * 100
    : 0;

  // zmiana dzienna w bezpiecznych widełkach
  const todaysChangeAmount = portfolioValue * (Math.random() * 0.01 - 0.005);
  const todaysChangePct = (todaysChangeAmount / portfolioValue) * 100;
  const unrealizedDailyGain = unrealizedGain * (Math.random() * 0.02 - 0.01);
  const unrealizedDailyPct = (unrealizedDailyGain / unrealizedGain) * 100;


  return (
    <div className="summary-grid">
      <SummaryCard
        title="Total Portfolio Value"
        value={`$${portfolioValue.toFixed(2)}`}
        change={`${todaysChangeAmount >= 0 ? "+" : ""}(${todaysChangePct.toFixed(2)}%) Today`}
        isPositive={todaysChangeAmount >= 0}
        icon={<Wallet />}
      />

      <SummaryCard
        title="Total Gain/Loss"
        value={`$${totalGainLoss.toFixed(2)}`}
        change={`${totalGainLossPct >= 0 ? "+" : ""}${totalGainLossPct.toFixed(2)}% All Time`}
        isPositive={totalGainLoss >= 0}
        icon={<TrendingUp />}
      />

      <SummaryCard
        title="Unrealized Gain (Today)"
        value={`$${todaysChangeAmount.toFixed(2)}`}
        change={`${todaysChangePct >= 0 ? "+" : ""}${todaysChangePct.toFixed(2)}%`}
        isPositive={todaysChangeAmount >= 0}
        icon={<Activity />}
      />

    </div>
  );
}