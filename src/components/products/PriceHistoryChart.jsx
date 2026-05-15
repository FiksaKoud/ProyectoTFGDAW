"use client";

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export function PriceHistoryChart({ points, supermarketName }) {
  if (points.length === 0) {
    return (
      <p className="text-sm text-emerald-700">
        No hay histórico de precios para esta tienda todavía.
      </p>
    );
  }

  const data = {
    labels: points.map((p) =>
      new Date(p.date).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
      }),
    ),
    datasets: [
      {
        label: `Precio en ${supermarketName}`,
        data: points.map((p) => p.price),
        borderColor: "#059669",
        backgroundColor: "rgba(5, 150, 105, 0.1)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `${value} €`,
        },
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Line data={data} options={options} />
    </div>
  );
}
