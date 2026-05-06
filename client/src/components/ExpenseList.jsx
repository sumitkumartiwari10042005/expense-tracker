const catColors = {
  Food: "#fbbf24",
  Transport: "#34d399",
  Bills: "#f87171",
  Other: "#8b91a7",
};

export default function ExpenseList({ expenses, onDelete, onEdit }) {
  if (expenses.length === 0) {
    return (
      <p style={{
        textAlign: "center", color: "#555d78",
        fontSize: "13px", margin: "28px 0", letterSpacing: "0.02em",
      }}>
        No expenses yet
      </p>
    );
  }

  return (
    <ul className="list">
      {expenses.map((expense) => (
        <li key={expense.id}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1, minWidth: 0 }}>

            {/* Amount + category badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "14px", fontWeight: 500,
                  color: "#34d399", cursor: "pointer",
                }}
                onClick={() => onEdit(expense)}
              >
                ₹{parseFloat(expense.amount).toLocaleString("en-IN")}
              </span>

              {expense.category && (
                <span style={{
                  fontSize: "10px", fontWeight: 600,
                  color: catColors[expense.category] || "#8b91a7",
                  background: `${catColors[expense.category] || "#8b91a7"}18`,
                  padding: "1px 7px", borderRadius: "20px",
                  letterSpacing: "0.04em",
                }}>
                  {expense.category}
                </span>
              )}
            </div>

            {/* Date */}
            <span style={{ fontSize: "11px", color: "#555d78" }}>
              {new Date(expense.created_at).toLocaleString("en-IN", {
                dateStyle: "medium", timeStyle: "short",
              })}
            </span>

            {/* Description — note nahi, description hai ab */}
            {expense.description && (
              <span style={{ fontSize: "12px", color: "#8b91a7" }}>
                {expense.description}
              </span>
            )}
          </div>

          <button onClick={() => onDelete(expense.id)} aria-label="Delete expense">
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}