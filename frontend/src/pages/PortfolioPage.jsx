import React, { useEffect, useState, useCallback } from 'react';
import api from '../api';
import PortfolioItem from '../components/PortfolioItem';
import '../styles/Portfolio.css'
import TransactionModal from '../components/TransactionModal';

function Portfolio() {
  // Dobra praktyka: nazwy stanów z małej litery
  const [loading, setLoading] = useState(true); 
  const [portfolio, setPortfolio] = useState(null); // Zmieniono na null dla jasności
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  const fetchPortfolio = useCallback(async () => {
    // Możesz chcieć ustawić jakiś mniejszy wskaźnik ładowania,
    // ale na razie pobierzmy dane.
    try {
      setLoading(true); // Opcjonalnie
      const res = await api.get('/api/portfolio/');
      setPortfolio(res.data);
    } catch (err) {
      console.error("Błąd podczas pobierania portfela:", err);
    } finally {
      setLoading(false); // Opcjonalnie
    }
  }, []); // Pusta tablica, funkcja stworzy się raz

  // Użyj fetchPortfolio przy pierwszym ładowaniu
  useEffect(() => {
    fetchPortfolio();
    setLoading(false); // Główne ładowanie strony
  }, [fetchPortfolio]); // Zależność od 'fetchPortfolio'

  // KROK 2: Stwórz funkcję-handlera, którą przekażesz "w dół"
  const handleBuySuccess = async () => {
    await fetchPortfolio(); // 1. ODŚWIEŻ DANE
    setIsBuyModalOpen(false);  // 2. ZAMKNIJ MODAL
  };

  // Obsługa stanu ładowania
  if (loading) {
    return <div>Loading your portfolio...</div>;
  }

  // Obsługa błędu lub braku danych
  if (!portfolio) {
    return <div>Could not load portfolio data. Please try again later.</div>;
  }

  // KROK 2: WYŚWIETL KONKRETNE DANE Z OBIEKTU
  return (
    <div>
      
      {/* Modal jest renderowany tutaj, ale jest niewidoczny
        dopóki 'isModalOpen' nie jest 'true'
      */}
      <TransactionModal 
        isOpen={isBuyModalOpen} 
        onClose={() => setIsBuyModalOpen(false)} 
        onSuccess={handleBuySuccess}
      />
      <h1 className='portfolio-name'>{portfolio.name}</h1>
      <div className='portfolio-details'>
        <h2>Total Value: ${portfolio.total_value.toFixed(2)}</h2>
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
    </div>
  );
}

export default Portfolio;