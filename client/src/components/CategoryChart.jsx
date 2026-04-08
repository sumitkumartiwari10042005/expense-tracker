import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const COLORS = ["#7c6aff", "#34d399", "#fbbf24", "#f87171", "#06b6d4", "#a78bfa"];

export default function CategoryChart({ expenses }) {
  const totals = expenses.reduce((acc, e) => {
    const cat = e.category || "Other";
    acc[cat] = (acc[cat] || 0) + e.amount;
    return acc;
  }, {});

  const labels = Object.keys(totals);
  const values = Object.values(totals);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: COLORS,
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 11, family: "'Sora', sans-serif" },
          color: "#8b91a7",
          padding: 12,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: "#1e2130",
        borderColor: "rgba(255,255,255,0.07)",
        borderWidth: 1,
        titleColor: "#f1f3f9",
        bodyColor: "#8b91a7",
        padding: 10,
        callbacks: {
          label: (ctx) => ` ₹${ctx.parsed.toLocaleString("en-IN")}`,
        },
      },
      datalabels: {
        color: "#fff",
        font: { weight: "600", size: 11, family: "'Sora', sans-serif" },
        formatter: (value, ctx) => {
          const sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const pct = ((value / sum) * 100).toFixed(0);
          return pct > 5 ? `${pct}%` : "";
        },
      },
    },
  };

  if (labels.length === 0) {
    return (
      <div>
        <h3>Categories</h3>
        <div style={{ fontSize: "12px", color: "#555d78", textAlign: "center", paddingTop: "12px" }}>
          No data yet
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3>Categories</h3>
      <Pie data={data} options={options} />
    </div>
  );
}
