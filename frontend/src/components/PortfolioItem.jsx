import React, { useState } from 'react'
import '../styles/PortfolioItem.css'
import SellModal from './SellModal'

function PortfolioItem({asset, onDataRefresh}) {
  const [isSellModalOpen, setIsSellModalOpen] = useState(false)

  const handleSellSuccess = () => {
    onDataRefresh();          // Odśwież dane (wywołaj funkcję z PortfolioPage)
    setIsSellModalOpen(false); // Zamknij modal SPRZEDAŻY
  };

  return (  
      <tr className="portfolioRow">
        <td className="assetName">{asset.name}</td>
        <td className="assetSymbol">({asset.symbol})</td>
        <td className="assetType">{asset.type}</td>
        <td className="numericData">{asset.quantity}</td>
        <td className="numericData">${asset.current_value.toFixed(2)}</td>
        <td>{asset.unrealized_gain}</td>
        <td>
          <button onClick={() => setIsSellModalOpen(true)}>
          Sell
        </button>
        <SellModal 
          assetToSell={asset}
          onSuccess={() => handleSellSuccess()} 
          isOpen={isSellModalOpen} 
          onClose={() => setIsSellModalOpen(false)}
          />
        </td>
        
      </tr>
  )
}

export default PortfolioItem