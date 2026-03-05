import React, { useState, useEffect } from 'react';
import api from '../api'; 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label, format }) => {
  if (!active || !payload || !payload.length) return null;

  const { value, name } = payload[0];
  const color = value >= 0 ? "#16a34a" : "#dc2626";

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        padding: "8px 12px",
        borderRadius: "6px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
      }}
    >
      {/* data (X-axis) */}
      <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: 4 }}>
        {label}
      </div>

      {/* NAZWA SERII */}
      <div style={{ fontSize: "12px", color: "#374151" }}>
        {name}
      </div>

      {/* WARTOŚĆ */}
      <div style={{ fontSize: "15px", fontWeight: 600, color }}>
        {format(value)}
      </div>
    </div>
  );
};


// --- NOWOŚĆ: Formater dla osi Y (aby dodawał "%") ---
const percentFormatter = (value) => `${value.toFixed(2)}%`;

function PortfolioHistoryChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/api/portfolio/history/');
                
                // === NOWA LOGIKA: Przetwarzanie danych ===
                const processedData = res.data.map(item => {
                    // Konwertujemy stringi na liczby (na wszelki wypadek)
                    const value = parseFloat(item.value);
                    const profit_loss = parseFloat(item.profit_loss);

                    // Obliczamy koszt: Koszt = Wartość - Zysk
                    const totalCost = value - profit_loss;

                    // Obliczamy stopę zwrotu w %
                    // Musimy zabezpieczyć się przed dzieleniem przez zero
                    let rateOfReturn = 0;
                    if (totalCost !== 0) {
                        rateOfReturn = (profit_loss / totalCost) * 100;
                    }

                    // Zwracamy oryginalny obiekt + nasze nowe, obliczone pole
                    return {
                        ...item,
                        value: value, // Upewniamy się, że to liczba
                        profit_loss: profit_loss, // Upewniamy się, że to liczba
                        rateOfReturn: rateOfReturn // Nasze nowe pole
                    };
                });

                setData(processedData); // Zapisujemy przetworzone dane
            } catch (err) {
                console.error("Błąd podczas pobierania historii portfela:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); 

    if (loading) {
        return <div>Ładowanie wykresów...</div>;
    }

    if (data.length === 0) {
        return <div>Brak danych historycznych do wyświetlenia.</div>;
    }

    return (
        <div className="charts-container" style={{ width: '100%', marginTop: '30px' }}>
            
            {/* === WYKRES 1: WARTOŚĆ PORTFELA (Bez zmian) === */}
            <h3>Portfolio value over time</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" name="Portfolio value $" dot={false} />
                </LineChart>
            </ResponsiveContainer>

            {/* === WYKRES 2: ZYSK/STRATA (Bez zmian) === */}
            <h3 style={{ marginTop: '30px' }}>Profit/Loss over time</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                    content={
                        <CustomTooltip
                        format={(v) =>
                            `$${v.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                        }
                        />
                    }
                    />

                    <Legend />
                    <Line type="monotone" dataKey={() => 0} stroke="#ccc" name="Zero" dot={false} />
                    <Line type="monotone" dataKey="profit_loss" stroke="#82ca9d" name="Profit/Loss $" dot={false} />
                </LineChart>
            </ResponsiveContainer>

            {/* === NOWY WYKRES 3: STOPA ZWROTU W % === */}
            <h3 style={{ marginTop: '30px' }}>Rate of return %</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    {/* Używamy formatera, aby dodać "%" do osi Y */}
                    <YAxis tickFormatter={percentFormatter} /> 
                    {/* Tooltip też formatujemy, aby pokazywał "%" */}
                    <Tooltip
                    content={
                        <CustomTooltip
                        format={(v) => `${v.toFixed(2)}%`}
                        />
                    }
                    />

                    <Legend />
                    <Line type="monotone" dataKey={() => 0} stroke="#ccc" name="Zero" dot={false} />
                    <Line 
                        type="monotone" 
                        dataKey="rateOfReturn" // Używamy naszego nowego, obliczonego pola
                        stroke="#ffc658" // Żółty kolor
                        name="Return rate (%)" 
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>

        </div>
    );
}

export default PortfolioHistoryChart;