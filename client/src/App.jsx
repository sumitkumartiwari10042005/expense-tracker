import { useEffect, useState } from "react";
import { getExpenses, addExpense, deleteExpense, updateExpense, apiFetch } from "./api";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Summary from "./components/Summary";
import CategoryChart from "./components/CategoryChart";
import Auth from "./Auth";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [activeMonth, setActiveMonth] = useState(null);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sessionMsg, setSessionMsg] = useState('');

  useEffect(() => {
    const checkAuth = async () => { 
      const flag = localStorage.getItem('isLoggedIn');
      if (!flag) { setCheckingAuth(false); return; }

      const data = await apiFetch('/auth/me');
      if (data?.user) {
        setUser(data.user);
      } else {
        const refreshed = await apiFetch('/auth/refresh', { method: 'POST' });
        if (refreshed?.success) {
          const retry = await apiFetch('/auth/me');
          if (retry?.user) setUser(retry.user);
          else localStorage.removeItem('isLoggedIn');
        } else {
          localStorage.removeItem('isLoggedIn');
        }
      }
      setCheckingAuth(false);
    };

    checkAuth(); 
  }, []);

  useEffect(() => { if (user) loadExpenses(); }, [user]);

  useEffect(() => {
    const handler = () => {
      setUser(null);
      setExpenses([]);
      setSessionMsg('Session expired, please login again');
    };
    window.addEventListener('force-logout', handler);
    return () => window.removeEventListener('force-logout', handler);
  }, []);

  async function loadExpenses() {
    const data = await getExpenses();
    setExpenses(data || []);
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

  async function handleLogout() {
    await apiFetch('/auth/logout', { method: 'POST' });
    localStorage.removeItem('isLoggedIn');
    setUser(null);
    setExpenses([]);
  }

  const total = (expenses || []).reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const filteredExpenses = (activeMonth
    ? expenses.filter((e) => {
      const d = new Date(e.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      return key === activeMonth;
    })
    : expenses
  ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  if (checkingAuth) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      color: 'rgba(255,255,255,0.5)',
      fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
      letterSpacing: '0.1em'
    }}>
      ⏳ Loading...
    </div>
  );

  if (!user) return <Auth onLogin={setUser} message={sessionMsg} />;

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Sora, sans-serif' }}>

      {/* TOP NAVBAR */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 56,
        background: 'rgba(6,8,15,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>💸</span>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#fff', letterSpacing: '-0.5px' }}>
            Expense <span style={{ color: '#7c6af7' }}>Lite</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, padding: '5px 14px',
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c6af7, #34d399)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, color: '#fff',
            }}>
              {user.email[0].toUpperCase()}
            </div>
            <span style={{
              fontSize: 12, color: 'rgba(255,255,255,0.6)',
              fontFamily: 'JetBrains Mono, monospace',
              maxWidth: 180, overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user.email}
            </span>
          </div>

          <button onClick={handleLogout} style={{
            padding: '6px 16px',
            background: 'rgba(239,68,68,0.12)',
            color: '#f87171',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 8, cursor: 'pointer',
            fontSize: 12, fontWeight: 600,
            fontFamily: 'Sora, sans-serif',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.25)'}
            onMouseLeave={e => e.target.style.background = 'rgba(239,68,68,0.12)'}
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="page" style={{ paddingTop: 56 }}>

        <div className="left">
          <CategoryChart expenses={expenses} />
        </div>

        <div className="container">
          <ExpenseForm onAdd={handleAdd} editingExpense={editingExpense} />
          <ExpenseList
            expenses={filteredExpenses}
            onDelete={handleDelete}
            onEdit={setEditingExpense}
          />
          <div className="total">
            Total: ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="sidebar">
          <Summary
            expenses={expenses}
            activeMonth={activeMonth}
            onMonthSelect={setActiveMonth}
          />
        </div>
      </div>
    </div>
  );
}