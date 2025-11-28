import React, { useState, useEffect } from 'react';
import api from '../api'; 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
            <h3>Wartość portfela w czasie</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" name="Wartość portfela $" dot={false} />
                </LineChart>
            </ResponsiveContainer>

            {/* === WYKRES 2: ZYSK/STRATA (Bez zmian) === */}
            <h3 style={{ marginTop: '30px' }}>Zysk/Strata w czasie</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey={() => 0} stroke="#ccc" name="Zero" dot={false} />
                    <Line type="monotone" dataKey="profit_loss" stroke="#82ca9d" name="Zysk/Strata $" dot={false} />
                </LineChart>
            </ResponsiveContainer>

            {/* === NOWY WYKRES 3: STOPA ZWROTU W % === */}
            <h3 style={{ marginTop: '30px' }}>Stopa zwrotu %</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    {/* Używamy formatera, aby dodać "%" do osi Y */}
                    <YAxis tickFormatter={percentFormatter} /> 
                    {/* Tooltip też formatujemy, aby pokazywał "%" */}
                    <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                    <Legend />
                    <Line type="monotone" dataKey={() => 0} stroke="#ccc" name="Zero" dot={false} />
                    <Line 
                        type="monotone" 
                        dataKey="rateOfReturn" // Używamy naszego nowego, obliczonego pola
                        stroke="#ffc658" // Żółty kolor
                        name="Stopa zwrotu (%)" 
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>

        </div>
    );
}

export default PortfolioHistoryChart;