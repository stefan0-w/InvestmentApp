import { useEffect, useState, useCallback } from "react";
import TransactionForm from "../components/TransactionForm";
import api from "../api";
import { PortfolioSummary } from "../components/PortfolioSummary";
import AssetAllocationChart from "../components/AssetAllocationChart";
import AssetSymbolAllocationChart from "../components/AssetSymbolAllocationChart";
import '../styles/Home.css'
import {Link} from 'react-router-dom'

function Home() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPortfolioSummary = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/portfolio/');
      setPortfolioData(res.data);
      } catch (err) {
        console.error("Błąd pobierania podsumowania portfela:", err);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchPortfolioSummary();
    }, [fetchPortfolioSummary]);

  if (loading) { return <div>Loading Dashboard...</div>; }
  if (!portfolioData) { return <div>Error loading data.</div>; }
  
  console.log("Dane dla wykresu:", portfolioData.type_allocation);
  console.log("Dane dla wykresu:", portfolioData.symbol_allocation);
  return (
    <div>
      <PortfolioSummary portfolioValue={portfolioData?.total_value} totalRealizedGain={portfolioData?.total_realized_gain}></PortfolioSummary>
      <div className="charts-row">
        <AssetAllocationChart data={portfolioData?.type_allocation} />
        <AssetSymbolAllocationChart data={portfolioData?.symbol_allocation}/>
      </div>
    </div>
  );
}

export default Home;