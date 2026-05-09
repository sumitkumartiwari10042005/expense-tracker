const BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return res.json();
}

export async function getExpenses() {
  return apiFetch('/expenses');
}

export async function addExpense(expense) {
  return apiFetch('/expenses', {
    method: 'POST',
    body: JSON.stringify(expense),
  });
}

export async function updateExpense(id, expense) {
  return apiFetch(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(expense),
  });
}

export async function deleteExpense(id) {
  return apiFetch(`/expenses/${id}`, {
    method: 'DELETE',
  });
}