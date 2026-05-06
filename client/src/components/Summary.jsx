import { useState, useEffect } from "react";

function fmt(amount) {
  return parseFloat(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function downloadCSV(expenses) {
  if (!expenses.length) return;
  const header = ["Amount", "Description", "Category", "Date", "Time"];
  const rows = expenses.map((e) => {
    const d = new Date(e.created_at);
    return [
      parseFloat(e.amount),
      `"${(e.description || "").replace(/"/g, '""')}"`,
      e.category || "",
      `="${d.toLocaleDateString("en-IN")}"`,
      `="${d.toLocaleTimeString("en-IN")}"`,
    ];
  });
  const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const NEWS_FEED = [
  {
    icon: "📈",
    title: "Sensex up 1.2%",
    sub: "FII buying drives rally",
    color: "#34d399",
    link: "https://economictimes.indiatimes.com/markets/stocks/news"
  },
  {
    icon: "🏦",
    title: "RBI holds rates",
    sub: "Repo steady at 6.5%",
    color: "#7c6aff",
    link: "https://www.rbi.org.in/"
  },
  {
    icon: "🪙",
    title: "Gold ₹ price/10g",
    sub: "Up 0.8% this week",
    color: "#fbbf24",
    link: "https://www.goodreturns.in/gold-rates/"
  },
  {
    icon: "💹",
    title: "Nifty IT gains 2.4%",
    sub: "Tech stocks lead momentum",
    color: "#60a5fa",
    link: "https://www.moneycontrol.com/stocksmarketsindia/"
  },
  {
    icon: "🚀",
    title: "Startup funding rises",
    sub: "AI sector attracts investors",
    color: "#f87171",
    link: "https://inc42.com/"
  },
  {
    icon: "💳",
    title: "UPI hits new high",
    sub: "Digital payments surge",
    color: "#a78bfa",
    link: "https://www.npci.org.in/what-we-do/upi/product-statistics"
  },
  {
    icon: "🏠",
    title: "Real estate demand jumps",
    sub: "Tier-2 cities dominate sales",
    color: "#fb923c",
    link: "https://housing.com/news/"
  },
  {
    icon: "⚡",
    title: "EV market expands fast",
    sub: "Battery demand climbs sharply",
    color: "#22c55e",
    link: "https://auto.economictimes.indiatimes.com/"
  },
];

const s = {
  btn: (active) => ({
    background: "transparent", border: "none",
    color: active ? "#7c6aff" : "#555d78",
    cursor: "pointer", fontSize: "11px", fontWeight: 600,
    fontFamily: "'Sora', sans-serif", padding: 0,
  }),
  monthRow: (isActive, isOpen) => ({
    display: "flex", alignItems: "center",
    padding: "10px 12px", borderRadius: "8px",
    background: isActive ? "rgba(124,106,255,0.15)" : isOpen ? "rgba(124,106,255,0.07)" : "transparent",
    border: isActive ? "1px solid rgba(124,106,255,0.3)" : "1px solid transparent",
    cursor: "default", transition: "background 0.15s", marginBottom: "4px",
  }),
  yearRow: (isOpen) => ({
    display: "flex", alignItems: "center",
    padding: "8px 12px", borderRadius: "8px",
    background: isOpen ? "rgba(52,211,153,0.07)" : "transparent",
    border: "1px solid transparent", marginBottom: "4px",
  }),
  label: { fontSize: "12px", color: "#8b91a7", fontWeight: 500 },
  amount: {
    fontSize: "12px", color: "#f1f3f9",
    fontFamily: "'JetBrains Mono', monospace", fontWeight: 500,
  },
  subItem: {
    fontSize: "11px", color: "#555d78",
    padding: "3px 0 3px 12px",
    borderLeft: "1px solid rgba(255,255,255,0.06)",
    marginLeft: "4px", marginBottom: "2px",
  },
  catRow: {
    display: "flex", justifyContent: "space-between",
    fontSize: "12px", marginBottom: "6px",
    padding: "6px 10px", borderRadius: "6px",
    background: "rgba(255,255,255,0.03)",
  },
};

const catColors = {
  Food: "#fbbf24", Transport: "#34d399",
  Bills: "#f87171", Other: "#8b91a7",
};

export default function Summary({ expenses, activeMonth, onMonthSelect }) {
  const [openMonthKey, setOpenMonthKey] = useState(null);
  const [openYear, setOpenYear] = useState(null);
  const [activeNews, setActiveNews] = useState(0);

  // Auto scroll news
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNews(i => (i + 1) % NEWS_FEED.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  /* Group by month */
  const monthMap = {};
  expenses.forEach((e) => {
    const d = new Date(e.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!monthMap[key]) {
      monthMap[key] = {
        label: `${d.toLocaleString("en-IN", { month: "short" })} ${d.getFullYear()}`,
        total: 0, items: [],
      };
    }
    monthMap[key].total += parseFloat(e.amount);
    monthMap[key].items.push(e);
  });
  const months = Object.entries(monthMap);

  /* Group by year */
  const yearMap = {};
  expenses.forEach((e) => {
    const y = new Date(e.created_at).getFullYear();
    if (!yearMap[y]) yearMap[y] = { total: 0, items: [] };
    yearMap[y].total += parseFloat(e.amount);
    yearMap[y].items.push(e);
  });
  const years = Object.entries(yearMap);

  /* Category totals */
  const categoryTotals = expenses.reduce((acc, e) => {
    const cat = e.category || "Other";
    acc[cat] = (acc[cat] || 0) + parseFloat(e.amount);
    return acc;
  }, {});

  return (
    <div>
      {/* Export CSV */}
      <button
        onClick={() => downloadCSV(expenses)}
        style={{
          width: "100%", marginBottom: "16px", padding: "9px",
          borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.04)", color: "#8b91a7",
          cursor: "pointer", fontSize: "11px", fontWeight: 600,
          fontFamily: "'Sora', sans-serif", letterSpacing: "0.05em",
          textTransform: "uppercase", transition: "background 0.15s, color 0.15s",
        }}
        onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#f1f3f9"; }}
        onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#8b91a7"; }}
      >
        ↓ Export CSV
      </button>

      {/* Monthly */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <h3 style={{ margin: 0 }}>Monthly</h3>
        {activeMonth ? (
          <button onClick={() => onMonthSelect(null)} style={s.btn(true)}>Clear ✕</button>
        ) : (
          <button onClick={() => onMonthSelect(months[0]?.[0] ?? null)} style={s.btn(false)}>Filter</button>
        )}
      </div>

      {months.map(([key, m]) => (
        <div key={key}>
          <div style={s.monthRow(activeMonth === key, openMonthKey === key)}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
              <span style={s.label}>{m.label}</span>
              <span style={s.amount}>₹{fmt(m.total)}</span>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
              <button onClick={() => onMonthSelect(activeMonth === key ? null : key)} style={s.btn(activeMonth === key)}>
                {activeMonth === key ? "On" : "Filter"}
              </button>
              <button onClick={() => setOpenMonthKey(openMonthKey === key ? null : key)} style={s.btn(openMonthKey === key)}>
                {openMonthKey === key ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {openMonthKey === key && (
            <div style={{ marginBottom: "6px" }}>
              {m.items.map((e) => (
                <div key={e.id} style={s.subItem}>
                  ₹{fmt(e.amount)} — {e.description || "no description"}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Yearly */}
      <h3 style={{ marginTop: "16px" }}>Yearly</h3>
      {years.map(([year, y]) => (
        <div key={year}>
          <div style={s.yearRow(openYear === year)}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
              <span style={s.label}>{year}</span>
              <span style={s.amount}>₹{fmt(y.total)}</span>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <button onClick={() => setOpenYear(openYear === year ? null : year)} style={s.btn(openYear === year)}>
                {openYear === year ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {openYear === year && (
            <div style={{ marginBottom: "6px" }}>
              {y.items.map((e) => (
                <div key={e.id} style={s.subItem}>
                  ₹{fmt(e.amount)} — {e.description || "no description"}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* By Category */}
      <h3 style={{ marginTop: "16px" }}>By Category</h3>
      {Object.entries(categoryTotals).map(([cat, total]) => (
        <div key={cat} style={s.catRow}>
          <span style={{ color: catColors[cat] || "#8b91a7", fontWeight: 500 }}>{cat}</span>
          <span style={{ ...s.amount, fontSize: "11px" }}>₹{fmt(total)}</span>
        </div>
      ))}

      {/* ── FINANCE NEWS FEED ── */}
      <div style={{
        marginTop: 20,
        height: 1,
        background: "rgba(255,255,255,0.06)",
        marginBottom: 16,
      }} />

      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 9, letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "rgba(124,106,255,0.5)",
        marginBottom: 10,
      }}>
        📡 Market & Tips
      </div>

      {/* News cards */}
      {/* ── ACTIVE NEWS CARD ── */}

      <div
        onClick={() => {
          const current = NEWS_FEED[activeNews];

          if (current.link) {
            window.open(current.link, "_blank");
          }
        }}
        style={{
          padding: "14px",
          borderRadius: 14,
          cursor: "pointer",
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${NEWS_FEED[activeNews].color}40`,
          transition: "all 0.4s ease",
          display: "flex",
          alignItems: "center",
          gap: 12,
          minHeight: 72,
          overflow: "hidden",
        }}
      >
        {/* icon */}
        <div
          style={{
            fontSize: 24,
            flexShrink: 0,
            filter: `drop-shadow(0 0 8px ${NEWS_FEED[activeNews].color})`,
          }}
        >
          {NEWS_FEED[activeNews].icon}
        </div>

        {/* text */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              color: NEWS_FEED[activeNews].color,
              fontWeight: 700,
              fontSize: 13,
              fontFamily: "'Sora', sans-serif",
              marginBottom: 4,
              transition: "all 0.3s ease",
            }}
          >
            {NEWS_FEED[activeNews].title}
          </div>

          <div
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {NEWS_FEED[activeNews].sub}
          </div>
        </div>

        {/* live dot */}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: NEWS_FEED[activeNews].color,
            boxShadow: `0 0 12px ${NEWS_FEED[activeNews].color}`,
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  );
}