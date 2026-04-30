const API_BASE = "https://api.keyval.org";

async function set(key, value) {
  const response = await fetch(`${API_BASE}/set`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, val: value })
  });
  return response.json();
}

async function get(key) {
  const response = await fetch(`${API_BASE}/get`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key })
  });
  return response.json();
}

export default { set, get };