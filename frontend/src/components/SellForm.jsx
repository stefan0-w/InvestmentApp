import React, { useState } from 'react'
import api from '../api';

function SellForm({assetToSell, onSuccess}) {
  const [sellPrice, setSellPrice] = useState("");
  const [quantitySold, setQuantitySold] = useState("");
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split("T")[0])
  const [error, setError] = useState("");
  const availableQuantity = parseFloat(assetToSell.quantity);

  const handleQuantityChange = (e) => {
    const val = e.target.value;
    setQuantitySold(val);

    // Walidacja w czasie rzeczywistym
    if (parseFloat(val) > availableQuantity) {
      setError(`You have only ${availableQuantity} shares`);
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!quantitySold || !sellPrice || !transactionDate) {
        alert("All fields are required!");
        return;
      }

      
      try {
        const res = await api.post("/api/transactions/", {
          asset_data: {
            "symbol" : assetToSell.symbol,
            "name" : assetToSell.name,
            "type" : assetToSell.type
          }, 
          quantity: quantitySold,
          price: sellPrice,
          transaction_type: "SELL",
          transaction_date : transactionDate
        });
        alert("You've just sold " + quantitySold+ " of " +assetToSell.symbol);

        if (onSuccess) {
          onSuccess();
        }
    
      } catch (err) {
        console.error(err);
        alert("Błąd podczas dodawania transakcji");
      } 
    };

  return (
      <form onSubmit={handleSubmit} className="modalFormContent">
        <h3>Selling: {assetToSell.symbol}</h3>
        <div className='form-group'>
          <label htmlFor="volume">Volume</label>
          <input
              id="volume"
              type="number"
              step="any"
              value={quantitySold}
              onChange={handleQuantityChange}
              placeholder="e.g., 0.5" 
              required
              style={{flex: 1, borderColor: error ? 'red' : '#ccc'}}
            />
        </div>
        {error && <span style={{color: 'red', fontSize: '0.85rem'}}>{error}</span>}
        <div className='form-group'>
          <label htmlForor="price">Price</label>
          <input
            id='price'
            type="number"
            step="0.01"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            placeholder="e.g., 160.50"
            required 
          />
        </div>
        <div className="form-group">
            <label htmlFor="transaction-date">Transaction Date</label>
            <input
                type="date"
                id="transaction-date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                required
            />
        </div>
        

        <button type="submit" className="btn-submit btn-sell" disabled={!!error}>
          Sell
        </button>
      </form>
  );
}

export default SellForm