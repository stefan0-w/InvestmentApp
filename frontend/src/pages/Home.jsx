import { useEffect, useState, useCallback } from "react";
import TransactionForm from "../components/TransactionForm";
import api from "../api";
import { PortfolioSummary } from "../components/PortfolioSummary";
import AssetAllocationChart from "../components/AssetAllocationChart";
import {Link} from 'react-router-dom'

function Home() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPortfolioSummary = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/portfolio/'); // Ten sam endpoint co w PortfolioPage
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

  return (
    <div>
      <PortfolioSummary portfolioValue={portfolioData.total_value}></PortfolioSummary>

      <AssetAllocationChart data={portfolioData?.type_allocation} />
    </div>
  );
}

export default Home;