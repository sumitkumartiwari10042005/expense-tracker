const BASE = '/api';

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

    if (res.status === 401) {
      const data = await res.json();

      const isLoginOrRegister = path === '/auth/login' || path === '/auth/register';


      if (!isLoginOrRegister && (
        data?.error === 'User not found, please login again' ||
        data?.error === 'Invalid or expired access token' ||
        data?.error === 'Access token missing'
      )) {
        localStorage.removeItem('isLoggedIn');
        window.dispatchEvent(new Event('force-logout'));
      }

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