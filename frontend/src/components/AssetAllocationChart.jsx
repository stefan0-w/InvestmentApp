// src/components/AssetAllocationChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import '../styles/AssetAllocationChart.css'

// Możesz zdefiniować zestaw kolorów, aby wykres był spójny
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF00FF', '#00FFFF']; // Więcej kolorów

// Customizowana etykieta do wyświetlania wartości i procentu na wykresie
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function AssetAllocationChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="chart-card">Brak danych do wyświetlenia alokacji aktywów.</div>;
  }

  // Funkcja formatująca wartości Tooltipa
  const customTooltipFormatter = (value, name, props) => {
    return [`$${value.toFixed(2)} (${props.payload.percentage.toFixed(1)}%)`, name];
  };

  return (
    <div className="chart-card"> {/* Możesz nadać stylowanie dla karty */}
      <h3>Asset Allocation</h3>
      <p>Distribution of your portfolio</p>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" // Centralna pozycja X
            cy="50%" // Centralna pozycja Y
            labelLine={false} // Czy mają być linie od etykiet do kawałków
            // label={renderCustomizedLabel} // Opcjonalna niestandardowa etykieta
            outerRadius={100} // Promień zewnętrzny wykresu
            fill="#8884d8"
            dataKey="value" // Klucz z danymi, który reprezentuje wartość kawałka
          >
            {/* Mapowanie na dane, aby przypisać kolory */}
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          {/* Tooltip wyświetlający szczegóły po najechaniu myszką */}
          <Tooltip formatter={customTooltipFormatter} />
          {/* Legenda z kolorami i nazwami */}
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AssetAllocationChart;