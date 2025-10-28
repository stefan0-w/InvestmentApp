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
    if (!asset || !quantity || !price) {
      alert("Wszystkie pola są wymagane!");
      return;
    }

    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
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
        transaction_date : date
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
    <form onSubmit={handleSubmit} className="formContainer">
      <label>Transaction Type: {type}</label>

      <label>Asset</label>
      <AssetSearchInput onSelect={setAsset} />
      {asset && <p>Wybrane: {asset.symbol}</p>}
      <label>Quantity</label>
      <input
        type="number"
        step="0.01"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <label>Price</label>
      <input
        type="number"
        step="0.01"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      {/* <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="BUY">BUY</option>
        <option value="SELL">SELL</option>
      </select> */}

      <button type="submit" disabled={loading} className="submitFormBtn">
        {loading ? "Dodawanie..." : "Dodaj transakcję"}
      </button>
    </form>
  );
}

export default TransactionForm;
