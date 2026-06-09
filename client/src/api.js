const BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

export async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (res.status === 401){
       localStorage.removeItem('isLoggedIn');
       window.dispatchEvent(new Event('force-logout')); 
       return null;
    }

    return res.json();
  } catch {
    return null;
  }
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