import React, { useState } from 'react'
import '../styles/PortfolioItem.css'
import SellModal from './SellModal'

function PortfolioItem({asset, onDataRefresh}) {
  const [isSellModalOpen, setIsSellModalOpen] = useState(false)

  const handleSellSuccess = () => {
    onDataRefresh();          
    setIsSellModalOpen(false);
  };

  return (  
      <tr className="portfolioRow">
        <td className="assetName">{asset.name}</td>
        <td className="assetSymbol">({asset.symbol})</td>
        <td className="assetType">{asset.type}</td>
        <td className="numericData">{asset.quantity}</td>
        <td className="numericData">${asset.current_value.toFixed(2)}</td>
        <td className={`numericData ${
          asset.unrealized_gain > 0 ? 'gain-positive' : 
          (asset.unrealized_gain < 0 ? 'gain-negative' : '')
          }`}>
          ${asset.unrealized_gain.toFixed(2)}
        </td>
        <td>
          <button onClick={() => setIsSellModalOpen(true)} className='transaction-button'>
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