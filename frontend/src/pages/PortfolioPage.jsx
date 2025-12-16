import React, { useEffect, useState, useCallback } from 'react';
import api from '../api';
import PortfolioItem from '../components/PortfolioItem';
import '../styles/Portfolio.css'
import TransactionModal from '../components/TransactionModal';
import XtbImporter from '../components/XtbImporter';

function Portfolio() {
  const [loading, setLoading] = useState(true); 
  const [portfolio, setPortfolio] = useState(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/portfolio/');
      setPortfolio(res.data);
    } catch (err) {
      console.error("Błąd podczas pobierania portfela:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
    setLoading(false);
  }, [fetchPortfolio]);

  const handleBuySuccess = async () => {
    await fetchPortfolio(); 
    setIsBuyModalOpen(false); 
  };

  if (loading) {
    return <div>Loading your portfolio...</div>;
  }

  if (!portfolio) {
    return <div>Could not load portfolio data. Please try again later.</div>;
  }

  return (
    <div>
      <TransactionModal 
        isOpen={isBuyModalOpen} 
        onClose={() => setIsBuyModalOpen(false)} 
        onSuccess={handleBuySuccess}
      />
      {/* <h1 className='portfolio-name'>{portfolio.name}</h1> */}
      <div className='portfolio-details'>
        <h1 className='portfolio-header'>Total portfolio value: ${portfolio.total_value.toFixed(2)}</h1>
        <button onClick={() => setIsBuyModalOpen(true)} className='add-asset-fab'>
          +
        </button>
        
      </div>
      
      
      
      <h3>Your Assets:</h3>
      {portfolio.assets_summary.length > 0 ? (
        <table className='portfolioTable'>
          <thead>
            <tr>
              <th>ASSET</th>
              <th>SYMBOL</th>
              <th>TYPE</th>
              <th>SHARES</th>
              <th>CURRENT VALUE</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.assets_summary.map((asset) => (
              <PortfolioItem key={asset.symbol} asset={asset} onDataRefresh={fetchPortfolio}></PortfolioItem>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You don't have any assets in this portfolio yet.</p>
      )}
      <XtbImporter/>
    </div>
  );
}

export default Portfolio;