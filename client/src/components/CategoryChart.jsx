import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const COLORS = ["#7c6aff", "#34d399", "#fbbf24", "#f87171", "#06b6d4", "#a78bfa"];

const FINANCE_TIPS = [
  { icon: "💡", tip: "50/30/20 rule: 50% needs, 30% wants, 20% savings" },
  { icon: "📈", tip: "Start investing early — compound interest is magic" },
  { icon: "🎯", tip: "Set a monthly budget before spending starts" },
  { icon: "🚨", tip: "Build 3-6 months emergency fund first" },
  { icon: "💳", tip: "Pay credit card full — never carry balance" },
  { icon: "🛒", tip: "Wait 24hrs before any big unplanned purchase" },
  { icon: "📊", tip: "Track every rupee — awareness changes habits" },
  { icon: "🏦", tip: "Automate your savings on salary day" },
  { icon: "🔄", tip: "Review subscriptions monthly — cancel unused ones" },
  { icon: "🌱", tip: "SIP ₹500/month in index fund beats most FDs" },
  { icon: "🧾", tip: "Save receipts — helps during tax filing season" },
  { icon: "⚡", tip: "Cut one luxury/week — saves ₹5000+ per month" },
];

export default function CategoryChart({ expenses }) {
  const [tipIndex, setTipIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setTipIndex(i => (i + 1) % FINANCE_TIPS.length);
        setFade(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const totals = expenses.reduce((acc, e) => {
    const cat = e.category || "Other";
    acc[cat] = (acc[cat] || 0) + parseFloat(e.amount);
    return acc;
  }, {});

  const labels = Object.keys(totals);
  const values = Object.values(totals);

  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: COLORS,
      borderWidth: 0,
      hoverOffset: 4,
    }],
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

  const tip = FINANCE_TIPS[tipIndex];

  return (
    <div>
      {/* Chart */}
      <h3>Categories</h3>
      {labels.length === 0 ? (
        <div style={{ fontSize: "12px", color: "#555d78", textAlign: "center", paddingTop: "12px", paddingBottom: "12px" }}>
          No data yet
        </div>
      ) : (
        <Pie data={data} options={options} />
      )}

      {/* Divider */}
      <div style={{
        margin: "18px 0 14px",
        height: 1,
        background: "rgba(255,255,255,0.06)",
      }} />

      {/* Finance Tip */}
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 9,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "rgba(124,106,255,0.5)",
        marginBottom: 10,
      }}>
        💰 Finance Tip
      </div>

      <div
        style={{
          opacity: fade ? 1 : 0,
          transition: "all 0.45s ease",

          background:
            "linear-gradient(135deg, rgba(124,106,255,0.14), rgba(52,211,153,0.08))",

          border: "1px solid rgba(124,106,255,0.22)",

          boxShadow: fade
            ? "0 0 22px rgba(124,106,255,0.10)"
            : "0 0 0px rgba(124,106,255,0)",

          borderRadius: 16,
          padding: "14px 16px",
          minHeight: 82,

          display: "flex",
          alignItems: "center",
          gap: 12,

          position: "relative",
          overflow: "hidden",

          transform: fade
            ? "translateY(0px)"
            : "translateY(4px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#7c6aff",
            boxShadow: "0 0 10px #7c6aff",
          }}
        />

        <span style={{ fontSize: 22, flexShrink: 0, filter: "drop-shadow(0 0 8px rgba(124,106,255,0.45))" }}>{tip.icon}</span>
        <span style={{
          fontSize: 12,
          color: "#f1f3f9",
          lineHeight: 1.7,
          fontFamily: "'Sora', sans-serif",
          fontWeight: 500,
          letterSpacing: "0.01em",
        }}>
          {tip.tip}
        </span>
      </div>

      {/* Tip dots indicator */}
      <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 10 }}>
        {FINANCE_TIPS.map((_, i) => (
          <div key={i} style={{
            width: i === tipIndex ? 16 : 4,
            height: 4,
            borderRadius: 4,
            background: i === tipIndex ? "#7c6aff" : "rgba(255,255,255,0.1)",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
            onClick={() => setTipIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}