import { useState, useEffect } from "react";
import api from "../api";

// Style (bez zmian)
const containerStyle = {
  position: "relative",
  width: "300px",
};
const inputStyle = {
  width: "100%",
  padding: "8px",
  boxSizing: "border-box",
};
const resultsListStyle = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  border: "1px solid #ccc",
  backgroundColor: "white",
  listStyle: "none",
  margin: 0,
  padding: 0,
  zIndex: 100,
  maxHeight: "300px",
  overflowY: "auto",
};
const resultsItemStyle = {
  padding: "8px 12px",
  cursor: "pointer",
};
// --- Koniec stylów ---

function AssetSearchInput({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState({});

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      if (cache[query]) {
        setResults(cache[query]);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(`/api/assets/search/?q=${query}&exchange=US`);
        const searchResults = (res.data && Array.isArray(res.data.result)) 
                              ? res.data.result 
                              : [];
        setResults(searchResults);
        setCache((prev) => ({ ...prev, [query]: res.data }));
      } catch (err) {
        console.error("Błąd pobierania aktywów:", err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
    
    // ===============================================
    // TUTAJ JEST POPRAWKA
    // Zależność ma być TYLKO od 'query', tak jak miałeś w oryginale.
    // ===============================================
  }, [query]); 

  const handleSelect = (resultObject) => {
    onSelect(resultObject);
    setQuery("");
    setResults([]);
  };

  return (
    <div style={containerStyle}>
      <input
        type="text"
        value={query}
        placeholder="Szukaj aktywa..."
        onChange={(e) => setQuery(e.target.value)}
        style={inputStyle}
      />
      {loading && <p>Ładowanie...</p>}
      
      {results.length > 0 && (
        <ul style={resultsListStyle}>
          {results.map((r) => (
            <li
              key={r.symbol}
              onClick={() => handleSelect(r)}
              style={resultsItemStyle}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
            >
              {r.symbol} - {r.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AssetSearchInput;