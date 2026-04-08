import { useEffect, useState } from "react";
import { getExpenses, addExpense, deleteExpense, updateExpense } from "./api";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Summary from "./components/Summary";
import CategoryChart from "./components/CategoryChart";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [activeMonth, setActiveMonth] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    const data = await getExpenses();
    setExpenses(data);
  }

  async function handleAdd(expense) {
    if (editingExpense) {
      await updateExpense(editingExpense.id, expense);
      setEditingExpense(null);
    } else {
      await addExpense(expense);
    }
    loadExpenses();
  }

  async function handleDelete(id) {
    await deleteExpense(id);
    loadExpenses();
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const filteredExpenses = activeMonth
    ? expenses.filter((e) => {
        const d = new Date(e.created_at);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        return key === activeMonth;
      })
    : expenses;

  return (
    <div className="page">
      {/* LEFT: CATEGORY GRAPH */}
      <div className="left">
        <CategoryChart expenses={expenses} />
      </div>

      {/* CENTER: MAIN APP */}
      <div className="container">
        <h1>Expense <span>Lite</span></h1>

        <ExpenseForm
          onAdd={handleAdd}
          editingExpense={editingExpense}
        />

        <ExpenseList
          expenses={filteredExpenses}
          onDelete={handleDelete}
          onEdit={setEditingExpense}
        />

        <div className="total">Total: ₹{total.toLocaleString("en-IN")}</div>
      </div>

      {/* RIGHT: SIDEBAR */}
      <div className="sidebar">
        <Summary
          expenses={expenses}
          activeMonth={activeMonth}
          onMonthSelect={setActiveMonth}
        />
      </div>
    </div>
  );
}
