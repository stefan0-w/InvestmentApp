import React, { useState } from 'react'
import api from '../api';

function SellForm({assetToSell, onSuccess}) {
  const [sellPrice, setSellPrice] = useState("");
  const [quantitySold, setQuantitySold] = useState("");

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!quantitySold || !sellPrice) {
        alert("Wszystkie pola są wymagane!");
        return;
      }

      const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      
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
          transaction_date : date
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
    <form onSubmit={handleSubmit} className="formContainer">
      <h3>Selling: {assetToSell.symbol}</h3>

      <label>Quantity</label>
      <input
        type="number"
        step="0.01"
        value={quantitySold}
        onChange={(e) => setQuantitySold(e.target.value)}
        placeholder="e.g., 0.5" 
        required
      />

      <label>Price</label>
      <input
        type="number"
        step="0.01"
        value={sellPrice}
        onChange={(e) => setSellPrice(e.target.value)}
        placeholder="e.g., 160.50"
        required 
      />

      <button type="submit" className="submitFormBtn">
        Sell
      </button>
    </form>
  );
}

export default SellForm