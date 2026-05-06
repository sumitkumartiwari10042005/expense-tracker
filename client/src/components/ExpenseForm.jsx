import { useEffect, useState } from "react";

export default function ExpenseForm({ onAdd, editingExpense }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount);
      setDescription(editingExpense.description || "");
      setCategory(editingExpense.category || "Other");
    }
  }, [editingExpense]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    onAdd({ amount: Number(amount), description, category });
    setAmount("");
    setDescription("");
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        type="number"
        placeholder="Amount (₹)"
        value={amount}
        min="1"
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Note"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>Food</option>
        <option>Transport</option>
        <option>Bills</option>
        <option>Other</option>
      </select>
      <button type="submit">
        {editingExpense ? "Update" : "Add"}
      </button>
    </form>
  );
}