const BASE_URL = "http://localhost:8080/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handle = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Something went wrong" }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
};

// Auth
export const authService = {
  register: (data) =>
    fetch(`${BASE_URL}/auth/register`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }).then(handle),
  login: (data) =>
    fetch(`${BASE_URL}/auth/login`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }).then(handle),
};

// Candidate
export const candidateService = {
  createProfile: (data) =>
    fetch(`${BASE_URL}/candidates/profile`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }).then(handle),
  getProfile: () =>
    fetch(`${BASE_URL}/candidates/profile`, { headers: getHeaders() }).then(handle),
  updateProfile: (data) =>
    fetch(`${BASE_URL}/candidates/profile`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }).then(handle),
};

// Interviews
export const interviewService = {
  create: (data) =>
    fetch(`${BASE_URL}/interviews`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }).then(handle),
  getMy: () =>
    fetch(`${BASE_URL}/interviews/my`, { headers: getHeaders() }).then(handle),
  getAll: () =>
    fetch(`${BASE_URL}/interviews/admin`, { headers: getHeaders() }).then(handle),
  getDashboard: () =>
    fetch(`${BASE_URL}/interviews/admin/dashboard`, { headers: getHeaders() }).then(handle),
  search: (keyword) =>
    fetch(`${BASE_URL}/interviews/search?keyword=${encodeURIComponent(keyword)}`, { headers: getHeaders() }).then(handle),
  filterByStatus: (status) =>
    fetch(`${BASE_URL}/interviews/filter/status?status=${status}`, { headers: getHeaders() }).then(handle),
  filterByResult: (result) =>
    fetch(`${BASE_URL}/interviews/filter/result?result=${result}`, { headers: getHeaders() }).then(handle),
  update: (id, data) =>
    fetch(`${BASE_URL}/interviews/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }).then(handle),
  delete: (id) =>
    fetch(`${BASE_URL}/interviews/${id}`, { method: "DELETE", headers: getHeaders() }).then(handle),
};
