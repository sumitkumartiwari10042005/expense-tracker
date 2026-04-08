import { useState } from "react";

function downloadCSV(expenses) {
  if (!expenses.length) return;

  const header = ["Amount", "Note", "Date", "Time"];
  const rows = expenses.map((e) => {
    const d = new Date(e.created_at);
    return [
      e.amount,
      `"${(e.note || "").replace(/"/g, '""')}"`,
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

const s = {
  btn: (active) => ({
    background: "transparent",
    border: "none",
    color: active ? "#7c6aff" : "#555d78",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 600,
    fontFamily: "'Sora', sans-serif",
    padding: 0,
  }),
  monthRow: (isActive, isOpen) => ({
    display: "flex",
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: "8px",
    background: isActive
      ? "rgba(124, 106, 255, 0.15)"
      : isOpen
      ? "rgba(124, 106, 255, 0.07)"
      : "transparent",
    border: isActive
      ? "1px solid rgba(124, 106, 255, 0.3)"
      : "1px solid transparent",
    cursor: "default",
    transition: "background 0.15s",
    marginBottom: "4px",
  }),
  yearRow: (isOpen) => ({
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    borderRadius: "8px",
    background: isOpen ? "rgba(52, 211, 153, 0.07)" : "transparent",
    border: "1px solid transparent",
    marginBottom: "4px",
  }),
  label: {
    fontSize: "12px",
    color: "#8b91a7",
    fontWeight: 500,
  },
  amount: {
    fontSize: "12px",
    color: "#f1f3f9",
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 500,
  },
  subItem: {
    fontSize: "11px",
    color: "#555d78",
    padding: "3px 0 3px 12px",
    borderLeft: "1px solid rgba(255,255,255,0.06)",
    marginLeft: "4px",
    marginBottom: "2px",
  },
  catRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    marginBottom: "6px",
    padding: "6px 10px",
    borderRadius: "6px",
    background: "rgba(255,255,255,0.03)",
  },
};

export default function Summary({ expenses, activeMonth, onMonthSelect }) {
  const [openMonthKey, setOpenMonthKey] = useState(null);
  const [openYear, setOpenYear] = useState(null);

  /* Group by month */
  const monthMap = {};
  expenses.forEach((e) => {
    const d = new Date(e.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!monthMap[key]) {
      monthMap[key] = {
        label: `${d.toLocaleString("en-IN", { month: "short" })} ${d.getFullYear()}`,
        total: 0,
        items: [],
      };
    }
    monthMap[key].total += e.amount;
    monthMap[key].items.push(e);
  });
  const months = Object.entries(monthMap);

  /* Group by year */
  const yearMap = {};
  expenses.forEach((e) => {
    const y = new Date(e.created_at).getFullYear();
    if (!yearMap[y]) yearMap[y] = { total: 0, items: [] };
    yearMap[y].total += e.amount;
    yearMap[y].items.push(e);
  });
  const years = Object.entries(yearMap);

  /* Category totals */
  const categoryTotals = expenses.reduce((acc, e) => {
    const cat = e.category || "Other";
    acc[cat] = (acc[cat] || 0) + e.amount;
    return acc;
  }, {});

  const catColors = {
    Food: "#fbbf24",
    Transport: "#34d399",
    Bills: "#f87171",
    Other: "#8b91a7",
  };

  return (
    <div>
      {/* Download */}
      <button
        onClick={() => downloadCSV(expenses)}
        style={{
          width: "100%",
          marginBottom: "16px",
          padding: "9px",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.04)",
          color: "#8b91a7",
          cursor: "pointer",
          fontSize: "11px",
          fontWeight: 600,
          fontFamily: "'Sora', sans-serif",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          transition: "background 0.15s, color 0.15s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.07)";
          e.currentTarget.style.color = "#f1f3f9";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          e.currentTarget.style.color = "#8b91a7";
        }}
      >
        ↓ Export CSV
      </button>

      {/* Monthly */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <h3 style={{ margin: 0 }}>Monthly</h3>
        {activeMonth ? (
          <button onClick={() => onMonthSelect(null)} style={s.btn(true)}>
            Clear ✕
          </button>
        ) : (
          <button onClick={() => onMonthSelect(months[0]?.[0] ?? null)} style={s.btn(false)}>
            Filter
          </button>
        )}
      </div>

      {months.map(([key, m]) => (
        <div key={key}>
          <div style={s.monthRow(activeMonth === key, openMonthKey === key)}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
              <span style={s.label}>{m.label}</span>
              <span style={s.amount}>₹{m.total.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
              <button
                onClick={() => onMonthSelect(activeMonth === key ? null : key)}
                style={s.btn(activeMonth === key)}
              >
                {activeMonth === key ? "On" : "Filter"}
              </button>
              <button
                onClick={() => setOpenMonthKey(openMonthKey === key ? null : key)}
                style={s.btn(openMonthKey === key)}
              >
                {openMonthKey === key ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {openMonthKey === key && (
            <div style={{ marginBottom: "6px" }}>
              {m.items.map((e) => (
                <div key={e.id} style={s.subItem}>
                  ₹{e.amount.toLocaleString("en-IN")} — {e.note || "no note"}
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
              <span style={s.amount}>₹{y.total.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <button
                onClick={() => setOpenYear(openYear === year ? null : year)}
                style={s.btn(openYear === year)}
              >
                {openYear === year ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {openYear === year && (
            <div style={{ marginBottom: "6px" }}>
              {y.items.map((e) => (
                <div key={e.id} style={s.subItem}>
                  ₹{e.amount.toLocaleString("en-IN")} — {e.note || "no note"}
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
          <span style={{ ...s.amount, fontSize: "11px" }}>₹{total.toLocaleString("en-IN")}</span>
        </div>
      ))}
    </div>
  );
}
