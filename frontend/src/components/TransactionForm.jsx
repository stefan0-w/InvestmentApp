import { useEffect, useState } from "react";
import api from "../api";
import AssetSearchInput from "./AssetSearchInput";

function TransactionForm() {
  const [asset, setAsset] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("BUY"); // domyślnie BUY
  const [loading, setLoading] = useState(false);

  // pobieranie ceny po zmianie asset
  useEffect(() => {
    if (!asset) return;

    const fetchPrice = async () => {
      try {
        const res = await api.get(`/api/assets/quote/?symbol=${asset}`);
        setPrice(parseFloat(res.data.price).toFixed(2));
      } catch (err) {
        console.error("Błąd pobierania ceny:", err);
      }
    };

    fetchPrice();
  }, [asset]); // <-- uruchamia się tylko gdy zmieni się asset

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
        asset_data: asset,      // symbol aktywa
        quantity,
        price,
        transaction_type: type,
        transaction_date : date
      });
      alert("Transakcja dodana!");
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
    <form onSubmit={handleSubmit}>
      <h2>Add new transaction</h2>

      <label>Asset</label>
      <AssetSearchInput onSelect={setAsset} />
      {asset && <p>Wybrane: {asset}</p>}

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
        readOnly // użytkownik nie może zmienić
      />

      <label>Type</label>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="BUY">BUY</option>
        <option value="SELL">SELL</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Dodawanie..." : "Dodaj transakcję"}
      </button>
    </form>
  );
}

export default TransactionForm;
