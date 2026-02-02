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
  console.log("ACTIVE MONTH:", activeMonth);

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

  function groupByMonth(expenses) {
    const map = {};

    expenses.forEach((e) => {
      const d = new Date(e.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;

      if (!map[key]) {
        map[key] = {
          year: d.getFullYear(),
          month: d.toLocaleString("en-IN", { month: "long" }),
          total: 0,
        };
      }

      map[key].total += e.amount;
    });

    return Object.values(map).sort(
      (a, b) => b.year - a.year
    );
  }

  function yearTotals(expenses) {
    const map = {};

    expenses.forEach((e) => {
      const year = new Date(e.created_at).getFullYear();
      map[year] = (map[year] || 0) + e.amount;
    });

    return map;
  }

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
        <h1>Expense Lite</h1>

        <ExpenseForm
          onAdd={handleAdd}
          editingExpense={editingExpense}
        />

        <ExpenseList
          expenses={filteredExpenses}
          onDelete={handleDelete}
          onEdit={setEditingExpense}
        />

        <div className="total">Total: ₹{total}</div>
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
