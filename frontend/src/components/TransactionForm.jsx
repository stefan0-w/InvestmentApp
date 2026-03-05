import { useEffect, useState } from "react";
import api from "../api";
import AssetSearchInput from "./AssetSearchInput";
import '../styles/TransactionForm.css'

function TransactionForm({onSuccess}) {
  const [asset, setAsset] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("BUY"); // domyślnie BUY
  const [loading, setLoading] = useState(false);
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split("T")[0]);

  //#####ZOSTAWIŁEM TO, NA WYPADEK GDYBYM SIĘ ZDECYDOWAŁ NA TO ŻE USER CHCĘ KUPIĆ PO AKUTALNEJ CENIE A NIE WPISYWAĆ SAMEMU
  // pobieranie ceny po zmianie asset
  // useEffect(() => {
  //   if (!asset) return;

  //   const fetchPrice = async () => {
  //     try {
  //       const res = await api.get(`/api/assets/quote/?symbol=${asset.symbol}`);
  //       setPrice(parseFloat(res.data.c).toFixed(2));
  //     } catch (err) {
  //       console.error("Błąd pobierania ceny:", err);
  //     }
  //   };

  //   fetchPrice();
  // }, [asset]); // <-- uruchamia się tylko gdy zmieni się asset

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!asset || !quantity || !price || !transactionDate) {
      alert("Wszystkie pola są wymagane!");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/transactions/", {
        asset_data: {
          "symbol" : asset.symbol,
          "name" : asset.description,
          "type" : asset.type
        }, 
        quantity,
        price,
        transaction_type: type,
        transaction_date : transactionDate
      });
      alert("Transakcja dodana!");

      if (onSuccess) {
        onSuccess();
      }
      // czyścimy formularz
      setAsset("");
      setQuantity("");
      setPrice("");
      setType("BUY");
    } catch (err) {
      console.error(err);
      alert("Błąd podczas dodawania transakcji");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modalFormContent">
      <h3>Add new asset</h3>

      <div className="form-group">
          <label htmlFor="asset-search">Asset</label>
          {/* Twoje pole wyszukiwania */}
          <AssetSearchInput onSelect={setAsset} />
          {asset && <p className="asset-selected-info">Wybrane: {asset.symbol} ({asset.description})</p>}
      </div>

      <div className="form-group">
          <label htmlFor="quantity">Volume</label>
          <input
              id="quantity"
              type="number"
              step="0.01"
              placeholder="eg. 10"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
          />
      </div>

      <div className="form-group">
          <label htmlFor="price">Price per unit</label>
          <input
              id="price"
              type="number"
              step="0.01"
              placeholder="eg. 102.84"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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

      <button type="submit" disabled={loading} className="btn-submit btn-buy">
        {loading ? "Processing..." : "Add"}
      </button>
    </form>
  );
}

export default TransactionForm;
