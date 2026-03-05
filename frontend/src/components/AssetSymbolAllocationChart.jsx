// src/components/AssetSymbolAllocationChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import '../styles/AssetAllocationChart.css';

// Nowoczesna pastelowo-finansowa paleta kolorów
const COLORS = [
  '#4E79A7', // niebieski
  '#59A14F', // zielony
  '#F28E2B', // pomarańczowy
  '#E15759', // czerwony
  '#76B7B2', // morski
  '#EDC948', // żółty
  '#B07AA1', // fioletowy
  '#FF9DA7', // różowy
  '#9C755F', // brązowy
];

// Custom label (możesz włączyć, jak chcesz)
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function AssetSymbolAllocationChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="chart-card">Brak danych do wyświetlenia alokacji według aktywów.</div>;
  }

  const customTooltipFormatter = (value, name, props) => {
    return [`$${value.toFixed(2)} (${props.payload.percentage.toFixed(1)}%)`, name];
  };

  return (
    <div className="chart-card">
      <h3>Allocation by Asset</h3>
      <p>Portfolio distribution by individual symbols</p>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            labelLine={false}
            // label={renderCustomizedLabel}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip formatter={customTooltipFormatter} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AssetSymbolAllocationChart;
