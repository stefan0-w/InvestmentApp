import React from 'react'
import '../styles/PortfolioItem.css'

function PortfolioItem({asset}) {
  return (  
      <tr className="portfolioRow">
        <td className="assetName">{asset.name}</td>
        <td className="assetSymbol">({asset.symbol})</td>
        <td className="assetType">{asset.type}</td>
        <td className="numericData">{asset.quantity}</td>
        <td className="numericData">${asset.current_value.toFixed(2)}</td>
      </tr>
  )
}

export default PortfolioItem