const BASE_URL = "";

export async function getExpenses() {
  const res = await fetch(`${BASE_URL}/expenses`);
  return res.json();
}
export async function addExpense(expense) {
  await fetch(`${BASE_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
}
export async function deleteExpense(id) {
  await fetch(`${BASE_URL}/expenses/${id}`, {
    method: "DELETE",
  });
}
export async function updateExpense(id, expense) {
  await fetch(`${BASE_URL}/expenses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
}
