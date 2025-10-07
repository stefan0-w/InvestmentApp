import { useState, useEffect } from "react";
import api from "../api";

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
        setResults(cache[query]); // użyj cache
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(`/api/assets/search/?q=${query}&exchange=US`);
        setResults(res.data);
        setCache((prev) => ({ ...prev, [query]: res.data }));
      } catch (err) {
        console.error("Błąd pobierania aktywów:", err);
      } finally {
        setLoading(false);
      }
    }, 500); // debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        placeholder="Szukaj aktywa..."
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <p>Ładowanie...</p>}
      {results.length > 0 && (
        <ul >
          {results.map((r) => (
            <li key={r.symbol} onClick={() => onSelect(r.symbol)}>
              {r.symbol} - {r.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AssetSearchInput;
