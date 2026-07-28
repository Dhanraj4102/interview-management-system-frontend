import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { authService, candidateService, interviewService } from "./services/api";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const G = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #070d1a; color: #e2e8f7; min-height: 100vh; }

:root {
  --navy-950: #070d1a;
  --navy-900: #0c1528;
  --navy-800: #101e36;
  --navy-700: #162847;
  --navy-600: #1e3a5f;
  --navy-500: #274d7e;
  --accent:   #3b82f6;
  --accent-2: #60a5fa;
  --accent-3: #93c5fd;
  --text:     #e2e8f7;
  --text-2:   #94a3b8;
  --text-3:   #64748b;
  --border:   #1e3a5f;
  --border-2: #274d7e;
  --success:  #22c55e;
  --warning:  #f59e0b;
  --danger:   #ef4444;
  --radius:   12px;
  --radius-lg: 16px;
}

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: var(--navy-900); }
::-webkit-scrollbar-thumb { background: var(--navy-600); border-radius: 4px; }

@keyframes fadeIn  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes spin    { to { transform: rotate(360deg); } }
@keyframes pulse   { 0%,100%{opacity:1;} 50%{opacity:.4;} }
@keyframes slideIn { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }

.fade { animation: fadeIn .35s cubic-bezier(.16,1,.3,1) both; }
.fade-1 { animation-delay:.05s; }
.fade-2 { animation-delay:.1s; }
.fade-3 { animation-delay:.15s; }
.fade-4 { animation-delay:.2s; }

/* Layout */
.layout { display:flex; min-height:100vh; }
.sidebar {
  width: 260px; flex-shrink:0;
  background: var(--navy-900);
  border-right: 1px solid var(--border);
  display:flex; flex-direction:column;
  position:sticky; top:0; height:100vh; overflow-y:auto;
}
.main-area { flex:1; min-width:0; overflow-x:hidden; }
.page {
  padding: 2rem;
  max-width: 1100px;
}

/* Sidebar */
.sb-logo {
  padding: 1.5rem 1.25rem 1.25rem;
  border-bottom: 1px solid var(--border);
  font-weight: 800; font-size: 1.1rem; letter-spacing:-.02em;
  display:flex; align-items:center; gap:.6rem;
  color: var(--text);
}
.sb-logo-icon {
  width:34px; height:34px; border-radius:10px;
  background: linear-gradient(135deg,#1d4ed8,#3b82f6);
  display:flex; align-items:center; justify-content:center;
  font-size:.9rem; flex-shrink:0;
}
.sb-section { padding: .75rem 1rem .25rem; font-size:.68rem; font-weight:700; letter-spacing:.1em; color:var(--text-3); text-transform:uppercase; }
.sb-nav { padding: .25rem .75rem; flex:1; }
.sb-item {
  display:flex; align-items:center; gap:.7rem;
  padding:.6rem .75rem; border-radius:var(--radius);
  font-size:.875rem; font-weight:500; color:var(--text-2);
  cursor:pointer; transition:all .18s; margin-bottom:.15rem;
  border:none; background:transparent; width:100%; text-align:left;
}
.sb-item:hover { background:var(--navy-800); color:var(--text); }
.sb-item.active { background:rgba(59,130,246,.15); color:var(--accent-2); border-left:2px solid var(--accent); padding-left:calc(.75rem - 2px); }
.sb-item svg { flex-shrink:0; opacity:.7; }
.sb-item.active svg { opacity:1; }
.sb-bottom { padding:.75rem; border-top:1px solid var(--border); }
.sb-user { display:flex; align-items:center; gap:.6rem; padding:.5rem .75rem; border-radius:var(--radius); margin-bottom:.5rem; }
.sb-avatar { width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#1d4ed8,#3b82f6);display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;flex-shrink:0; }
.sb-user-info { flex:1;min-width:0; }
.sb-username { font-size:.8rem;font-weight:600;color:var(--text); white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
.sb-role { font-size:.68rem;color:var(--text-3); }
.logout-btn { width:100%;display:flex;align-items:center;gap:.6rem;padding:.55rem .75rem;border-radius:var(--radius);font-size:.85rem;font-weight:500;color:var(--text-3);cursor:pointer;transition:all .18s;border:none;background:transparent; }
.logout-btn:hover { background:rgba(239,68,68,.1);color:#ef4444; }

/* Cards */
.card {
  background: var(--navy-800);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}
.card-sm { padding: 1.25rem; }
.card:hover { border-color: var(--border-2); }

/* Page header */
.page-header { margin-bottom: 1.75rem; }
.page-title { font-size:1.5rem;font-weight:800;letter-spacing:-.02em;margin-bottom:.25rem; }
.page-sub { font-size:.875rem;color:var(--text-2); }

/* Stat cards */
.stats-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:1rem;margin-bottom:1.75rem; }
.stat-card {
  background:var(--navy-800); border:1px solid var(--border);
  border-radius:var(--radius-lg); padding:1.25rem;
  transition:all .2s;
}
.stat-card:hover { border-color:var(--border-2); transform:translateY(-2px); }
.stat-icon { width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:.85rem;font-size:1rem; }
.stat-val { font-size:1.75rem;font-weight:800;letter-spacing:-.03em;line-height:1; }
.stat-label { font-size:.78rem;color:var(--text-2);margin-top:.3rem; }

/* Tables */
.table-wrap { overflow-x:auto; border-radius:var(--radius-lg);border:1px solid var(--border); }
table { width:100%;border-collapse:collapse;font-size:.875rem; }
thead tr { background:var(--navy-700); }
th { padding:.85rem 1rem;text-align:left;font-size:.72rem;font-weight:700;letter-spacing:.07em;color:var(--text-2);text-transform:uppercase;white-space:nowrap; }
td { padding:.85rem 1rem;border-top:1px solid var(--border);color:var(--text-2);vertical-align:middle; }
tr:hover td { background:var(--navy-800);color:var(--text); }

/* Badges */
.badge { display:inline-flex;align-items:center;gap:.3rem;padding:.2rem .6rem;border-radius:100px;font-size:.7rem;font-weight:600;letter-spacing:.03em; }
.badge-blue   { background:rgba(59,130,246,.15);color:#93c5fd; }
.badge-green  { background:rgba(34,197,94,.12);color:#86efac; }
.badge-red    { background:rgba(239,68,68,.12);color:#fca5a5; }
.badge-yellow { background:rgba(245,158,11,.12);color:#fcd34d; }
.badge-gray   { background:rgba(100,116,139,.15);color:#94a3b8; }
.badge-purple { background:rgba(168,85,247,.12);color:#d8b4fe; }
.badge-dot { width:5px;height:5px;border-radius:50%;background:currentColor; }

/* Buttons */
.btn { display:inline-flex;align-items:center;gap:.45rem;padding:.55rem 1.1rem;border-radius:var(--radius);font-size:.875rem;font-weight:600;cursor:pointer;border:none;transition:all .18s;font-family:inherit; }
.btn-primary { background:var(--accent);color:#fff; }
.btn-primary:hover { background:#2563eb;transform:translateY(-1px); }
.btn-outline { background:transparent;color:var(--text-2);border:1.5px solid var(--border-2); }
.btn-outline:hover { border-color:var(--accent);color:var(--accent-2); }
.btn-danger  { background:rgba(239,68,68,.12);color:#f87171;border:1.5px solid rgba(239,68,68,.2); }
.btn-danger:hover { background:rgba(239,68,68,.25); }
.btn-sm { padding:.4rem .8rem;font-size:.8rem; }
.btn:disabled { opacity:.5;cursor:not-allowed;transform:none!important; }

/* Forms */
.form-grid { display:grid;grid-template-columns:1fr 1fr;gap:1rem; }
.form-full { grid-column:1/-1; }
.field { display:flex;flex-direction:column;gap:.4rem; }
.field label { font-size:.75rem;font-weight:700;color:var(--text-2);letter-spacing:.05em;text-transform:uppercase; }
.field input,.field select,.field textarea {
  padding:.65rem .9rem;
  background:var(--navy-700);
  border:1.5px solid var(--border);
  border-radius:var(--radius);
  color:var(--text);
  font-size:.9rem;font-family:inherit;
  outline:none;transition:all .18s;width:100%;
}
.field input:focus,.field select:focus,.field textarea:focus { border-color:var(--accent);box-shadow:0 0 0 3px rgba(59,130,246,.12); }
.field input::placeholder,.field textarea::placeholder { color:var(--text-3); }
.field select option { background:var(--navy-800); }
.field textarea { resize:vertical;min-height:90px;line-height:1.6; }
.field-hint { font-size:.75rem;color:var(--text-3); }

/* Auth pages */
.auth-wrap { min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--navy-950);padding:1.5rem; }
.auth-card { width:100%;max-width:440px;background:var(--navy-900);border:1px solid var(--border);border-radius:20px;padding:2.5rem;animation:fadeIn .4s ease both; }
.auth-logo { display:flex;align-items:center;gap:.6rem;margin-bottom:2rem; }
.auth-title { font-size:1.5rem;font-weight:800;letter-spacing:-.02em;margin-bottom:.35rem; }
.auth-sub { font-size:.875rem;color:var(--text-2);margin-bottom:1.75rem; }

/* Alert */
.alert { padding:.75rem 1rem;border-radius:var(--radius);font-size:.85rem;margin-bottom:1rem; }
.alert-error { background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);color:#fca5a5; }
.alert-success { background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.2);color:#86efac; }

/* Toast */
.toast-container { position:fixed;bottom:1.5rem;right:1.5rem;z-index:999;display:flex;flex-direction:column;gap:.5rem; }
.toast { padding:.85rem 1.25rem;border-radius:var(--radius);font-size:.875rem;font-weight:500;display:flex;align-items:center;gap:.65rem;box-shadow:0 8px 32px rgba(0,0,0,.4);animation:slideIn .3s ease both;max-width:340px; }
.toast-success { background:#166534;border:1px solid #22c55e40;color:#bbf7d0; }
.toast-error   { background:#7f1d1d;border:1px solid #ef444440;color:#fecaca; }

/* Modal */
.modal-overlay { 
  position:fixed;
  top:0; left:0; right:0; bottom:0;
  width:100vw; height:100vh;
  background:rgba(7,13,26,.85);
  backdrop-filter:blur(6px);
  z-index:1000;
  display:flex;
  align-items:flex-start;
  justify-content:center;
  padding:2rem 1.5rem;
  overflow-y:auto;
  margin-left:-260px;
}
.modal { 
  background:var(--navy-800);
  border:1px solid var(--border-2);
  border-radius:20px;
  padding:2rem;
  width:100%;
  max-width:600px;
  margin:auto;
  flex-shrink:0;
  animation:fadeIn .25s ease both;
}
.modal-header { 
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:1.5rem;
  position:sticky;
  top:-2rem;
  background:var(--navy-800);
  z-index:10;
  padding:1rem 0;
  border-bottom:1px solid var(--border);
}
.modal-title { font-size:1.15rem;font-weight:700; }
.modal-close { background:none;border:none;color:var(--text-3);cursor:pointer;padding:.35rem;border-radius:8px;transition:all .15s;display:flex; }
.modal-close:hover { background:var(--navy-700);color:var(--text); }

/* Search/filter row */
.toolbar { display:flex;align-items:center;gap:.75rem;margin-bottom:1.25rem;flex-wrap:wrap; }
.search-input-wrap { position:relative;flex:1;min-width:220px; }
.search-icon { position:absolute;left:.8rem;top:50%;transform:translateY(-50%);color:var(--text-3);pointer-events:none; }
.search-input { padding:.6rem .9rem .6rem 2.3rem;background:var(--navy-800);border:1.5px solid var(--border);border-radius:var(--radius);color:var(--text);font-size:.875rem;font-family:inherit;outline:none;transition:all .18s;width:100%; }
.search-input:focus { border-color:var(--accent);box-shadow:0 0 0 3px rgba(59,130,246,.12); }
.search-input::placeholder { color:var(--text-3); }

/* Spinner */
.spinner { width:16px;height:16px;border:2px solid rgba(255,255,255,.25);border-top-color:#fff;border-radius:50%;animation:spin .65s linear infinite;display:inline-block; }
.spinner-lg { width:36px;height:36px;border-width:3px;border-top-color:var(--accent); }
.loading-center { display:flex;align-items:center;justify-content:center;padding:4rem; }

/* Empty state */
.empty { text-align:center;padding:4rem 2rem;color:var(--text-3); }
.empty-icon { font-size:2.5rem;margin-bottom:.75rem;opacity:.5; }
.empty-title { font-size:1rem;font-weight:600;color:var(--text-2);margin-bottom:.35rem; }

/* Profile info grid */
.info-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem; }
.info-item label { font-size:.7rem;font-weight:700;color:var(--text-3);letter-spacing:.07em;text-transform:uppercase;display:block;margin-bottom:.25rem; }
.info-item p { font-size:.9rem;color:var(--text);word-break:break-word; }
.info-item a { color:var(--accent-2);text-decoration:none; }
.info-item a:hover { text-decoration:underline; }

/* Section divider */
.section-row { display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;flex-wrap:wrap;gap:.75rem; }
.section-title { font-size:1rem;font-weight:700; }

/* Divider */
.divider { border:none;border-top:1px solid var(--border);margin:1.25rem 0; }

/* Misc */
.tag { display:inline-block;background:rgba(59,130,246,.12);color:var(--accent-3);border:1px solid rgba(59,130,246,.2);border-radius:6px;padding:.15rem .5rem;font-size:.72rem;font-weight:600;margin:.15rem; }
.mono { font-family:'JetBrains Mono',monospace;font-size:.8rem; }
.text-muted { color:var(--text-2); }
.text-dim   { color:var(--text-3); }
.mt-1 { margin-top:.5rem; }
.mt-2 { margin-top:1rem; }
.mt-3 { margin-top:1.5rem; }
.gap-1 { gap:.5rem; }
.flex { display:flex; }
.items-center { align-items:center; }
.justify-between { justify-content:space-between; }
.flex-wrap { flex-wrap:wrap; }

@media(max-width:768px){
  .sidebar { display:none; }
  .page { padding:1.25rem; }
  .form-grid { grid-template-columns:1fr; }
  .stats-grid { grid-template-columns:repeat(2,1fr); }
}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function statusBadge(status) {
  const map = { SCHEDULED:"badge-blue", COMPLETED:"badge-green", CANCELLED:"badge-red", POSTPONED:"badge-yellow", PENDING:"badge-gray" };
  return <span className={`badge ${map[status] || "badge-gray"}`}><span className="badge-dot"/>{status || "—"}</span>;
}
function resultBadge(result) {
  const map = { SELECTED:"badge-green", REJECTED:"badge-red", PENDING:"badge-yellow", ON_HOLD:"badge-purple", AWAITED:"badge-gray" };
  return <span className={`badge ${map[result] || "badge-gray"}`}>{result || "—"}</span>;
}
function fmtDate(d) { if (!d) return "—"; return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }); }
function fmtTime(t) { if (!t) return "—"; return t.slice(0,5); }

// ─── Toast ────────────────────────────────────────────────────────────────────
let _addToast = () => {};
function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  _addToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === "success" ? "✓" : "✕"} {t.msg}
        </div>
      ))}
    </div>
  );
}
const toast = { success: (m) => _addToast(m, "success"), error: (m) => _addToast(m, "error") };

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  dash:   <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  user:   <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  list:   <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  plus:   <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  search: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  logout: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  edit:   <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  x:      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  filter: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  brief:  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
};

// ─── AUTH PAGES ───────────────────────────────────────────────────────────────
function LoginPage({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const res = await authService.login(form);
      login(res.token, res.role);
      toast.success("Welcome back!");
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="sb-logo-icon">📋</div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>InterviewMS</span>
        </div>
        <div className="auth-title">Sign in to your account</div>
        <div className="auth-sub">Manage interviews efficiently in one place</div>
        {err && <div className="alert alert-error">{err}</div>}
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="field">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: ".5rem", justifyContent: "center", padding: ".75rem" }}>
            {loading ? <><span className="spinner" /> Signing in...</> : "Sign In"}
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: "1.25rem", fontSize: ".875rem", color: "var(--text-2)" }}>
          Don't have an account?{" "}
          <span style={{ color: "var(--accent-2)", cursor: "pointer", fontWeight: 600 }} onClick={onSwitch}>
            Register here
          </span>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ onSwitch }) {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setErr("Passwords do not match"); return; }
    setErr(""); setLoading(true);
    try {
      await authService.register(form);
      setSuccess(true);
      toast.success("Account created! Please log in.");
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  if (success) return (
    <div className="auth-wrap">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
        <div className="auth-title">Registration Successful!</div>
        <p style={{ color: "var(--text-2)", margin: "1rem 0 1.5rem", fontSize: ".9rem" }}>Your account has been created. Sign in to continue.</p>
        <button className="btn btn-primary" onClick={onSwitch} style={{ width: "100%", justifyContent: "center", padding: ".75rem" }}>Go to Sign In</button>
      </div>
    </div>
  );

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="sb-logo-icon">📋</div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>InterviewMS</span>
        </div>
        <div className="auth-title">Create your account</div>
        <div className="auth-sub">Get started as a candidate today</div>
        {err && <div className="alert alert-error">{err}</div>}
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: ".9rem" }}>
          <div className="field">
            <label>Full Name</label>
            <input placeholder="John Doe" value={form.fullName}
              onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} required />
          </div>
          <div className="field">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="field">
            <label>Password <span className="text-dim" style={{ textTransform: "none", fontWeight: 400 }}>(8–20 chars)</span></label>
            <input type="password" placeholder="Min. 8 characters" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input type="password" placeholder="Repeat password" value={form.confirmPassword}
              onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: ".5rem", justifyContent: "center", padding: ".75rem" }}>
            {loading ? <><span className="spinner" /> Creating account...</> : "Create Account"}
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: "1.25rem", fontSize: ".875rem", color: "var(--text-2)" }}>
          Already have an account?{" "}
          <span style={{ color: "var(--accent-2)", cursor: "pointer", fontWeight: 600 }} onClick={onSwitch}>Sign in</span>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, role, userName }) {
  const { logout } = useAuth();
  const candidateNav = [
    { id: "c-dash",    label: "Dashboard",        icon: Icon.dash },
    { id: "c-profile", label: "My Profile",        icon: Icon.user },
    { id: "c-new",     label: "New Interview",     icon: Icon.plus },
    { id: "c-my",      label: "My Interviews",     icon: Icon.list },
  ];
  const adminNav = [
    { id: "a-dash",    label: "Dashboard",         icon: Icon.dash },
    { id: "a-all",     label: "All Interviews",    icon: Icon.list },
    { id: "a-search",  label: "Search & Filter",   icon: Icon.search },
  ];
  const nav = role === "ADMIN" ? adminNav : candidateNav;

  return (
    <div className="sidebar">
      <div className="sb-logo">
        <div className="sb-logo-icon">📋</div>
        InterviewMS
      </div>
      <div className="sb-nav">
        <div className="sb-section">{role === "ADMIN" ? "Admin" : "Candidate"}</div>
        {nav.map(n => (
          <button key={n.id} className={`sb-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
            {n.icon} {n.label}
          </button>
        ))}
      </div>
      <div className="sb-bottom">
        <div className="sb-user">
          <div className="sb-avatar">{(userName || "U")[0].toUpperCase()}</div>
          <div className="sb-user-info">
            <div className="sb-username">{userName || "User"}</div>
            <div className="sb-role">{role === "ADMIN" ? "Administrator" : "Candidate"}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={() => { logout(); toast.success("Logged out successfully"); }}>
          {Icon.logout} Sign Out
        </button>
      </div>
    </div>
  );
}

// ─── CANDIDATE DASHBOARD ──────────────────────────────────────────────────────
function CandidateDash({ setPage }) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interviewService.getMy()
      .then(setInterviews)
      .catch(() => setInterviews([]))
      .finally(() => setLoading(false));
  }, []);

  const total = interviews.length;
  const completed = interviews.filter(i => i.status === "COMPLETED").length;
  const pending = interviews.filter(i => i.status === "SCHEDULED" || i.status === "PENDING").length;
  const selected = interviews.filter(i => i.interviewResult === "SELECTED").length;

  return (
    <div className="page fade">
      <div className="page-header">
        <div className="page-title">Welcome back 👋</div>
        <div className="page-sub">Here's an overview of your interview activity</div>
      </div>
      <div className="stats-grid">
        {[
          { icon: "📋", label: "Total Interviews", val: total, bg: "rgba(59,130,246,.1)", color: "#93c5fd" },
          { icon: "⏳", label: "Upcoming",         val: pending, bg: "rgba(245,158,11,.1)", color: "#fcd34d" },
          { icon: "✅", label: "Completed",        val: completed, bg: "rgba(34,197,94,.1)", color: "#86efac" },
          { icon: "🏆", label: "Selected",         val: selected, bg: "rgba(168,85,247,.1)", color: "#d8b4fe" },
        ].map((s, i) => (
          <div className={`stat-card fade fade-${i+1}`} key={s.label}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="stat-val" style={{ color: s.color }}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="section-row">
        <div className="section-title">Recent Interviews</div>
        <button className="btn btn-outline btn-sm" onClick={() => setPage("c-my")}>View All</button>
      </div>
      {loading ? <div className="loading-center"><span className="spinner-lg spinner" /></div> :
        interviews.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📭</div>
            <div className="empty-title">No interviews yet</div>
            <p style={{ fontSize: ".875rem" }}>Schedule your first interview to get started</p>
            <button className="btn btn-primary" style={{ marginTop: "1rem" }} onClick={() => setPage("c-new")}>
              {Icon.plus} Add Interview
            </button>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>Company</th><th>Round</th><th>Date</th><th>Mode</th><th>Status</th><th>Result</th>
              </tr></thead>
              <tbody>
                {interviews.slice(0, 5).map(i => (
                  <tr key={i.id}>
                    <td style={{ fontWeight: 600, color: "var(--text)" }}>{i.companyName}</td>
                    <td><span className="badge badge-blue">{i.interviewRound}</span></td>
                    <td className="mono">{fmtDate(i.interviewDate)}</td>
                    <td>{i.interviewMode}</td>
                    <td>{statusBadge(i.status)}</td>
                    <td>{resultBadge(i.interviewResult)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}

// ─── CANDIDATE PROFILE ────────────────────────────────────────────────────────
function CandidateProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    candidateService.getProfile()
      .then(p => { setProfile(p); setForm(p); })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (creating) {
        await candidateService.createProfile(form);
        toast.success("Profile created!");
      } else {
        await candidateService.updateProfile(form);
        toast.success("Profile updated!");
      }
      setEditing(false); setCreating(false); load();
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const startCreate = () => {
    setForm({ phone: "", experienceYears: 0, skills: "", employmentStatus: "", currentLocation: "", linkedinUrl: "", resumeUrl: "" });
    setCreating(true); setEditing(true);
  };

  if (loading) return <div className="loading-center"><span className="spinner-lg spinner" /></div>;

  if (!profile && !editing) return (
    <div className="page fade">
      <div className="page-header"><div className="page-title">My Profile</div></div>
      <div className="empty">
        <div className="empty-icon">👤</div>
        <div className="empty-title">No profile found</div>
        <p style={{ fontSize: ".875rem" }}>Create your candidate profile to get started</p>
        <button className="btn btn-primary" style={{ marginTop: "1rem" }} onClick={startCreate}>{Icon.plus} Create Profile</button>
      </div>
    </div>
  );

  if (editing) return (
    <div className="page fade">
      <div className="page-header">
        <div className="page-title">{creating ? "Create Profile" : "Edit Profile"}</div>
        <div className="page-sub">Fill in your details accurately</div>
      </div>
      <div className="card">
        <form onSubmit={save}>
          <div className="form-grid">
            <div className="field">
              <label>Phone Number</label>
              <input placeholder="10-digit number" value={form.phone || ""} maxLength={10}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
            </div>
            <div className="field">
              <label>Experience (Years)</label>
              <input type="number" min={0} value={form.experienceYears || 0}
                onChange={e => setForm(f => ({ ...f, experienceYears: +e.target.value }))} required />
            </div>
            <div className="field form-full">
              <label>Skills</label>
              <input placeholder="e.g. Java, Spring Boot, React, PostgreSQL" value={form.skills || ""}
                onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} required />
              <span className="field-hint">Comma-separated list of your skills</span>
            </div>
            <div className="field">
              <label>Employment Status</label>
              <select value={form.employmentStatus || ""} onChange={e => setForm(f => ({ ...f, employmentStatus: e.target.value }))} required>
                <option value="">Select status</option>
                <option>EMPLOYED</option><option>UNEMPLOYED</option><option>FRESHER</option><option>NOTICE_PERIOD</option>
              </select>
            </div>
            <div className="field">
              <label>Current Location</label>
              <input placeholder="City, State" value={form.currentLocation || ""}
                onChange={e => setForm(f => ({ ...f, currentLocation: e.target.value }))} required />
            </div>
            <div className="field">
              <label>LinkedIn URL <span className="text-dim" style={{ textTransform: "none" }}>(optional)</span></label>
              <input placeholder="https://linkedin.com/in/..." value={form.linkedinUrl || ""}
                onChange={e => setForm(f => ({ ...f, linkedinUrl: e.target.value }))} />
            </div>
            <div className="field">
              <label>Resume URL <span className="text-dim" style={{ textTransform: "none" }}>(optional)</span></label>
              <input placeholder="https://drive.google.com/..." value={form.resumeUrl || ""}
                onChange={e => setForm(f => ({ ...f, resumeUrl: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: "flex", gap: ".75rem", marginTop: "1.25rem" }}>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? <><span className="spinner" /> Saving...</> : "Save Profile"}
            </button>
            <button className="btn btn-outline" type="button" onClick={() => { setEditing(false); setCreating(false); }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="page fade">
      <div className="section-row">
        <div>
          <div className="page-title">My Profile</div>
          <div className="page-sub">Your candidate information</div>
        </div>
        <button className="btn btn-outline" onClick={() => { setForm(profile); setEditing(true); }}>{Icon.edit} Edit Profile</button>
      </div>

      <div className="card fade-1">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", fontWeight: 800 }}>
            {(profile.fullName || "U")[0]}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{profile.fullName}</div>
            <div style={{ color: "var(--text-2)", fontSize: ".875rem" }}>{profile.email}</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <span className="badge badge-blue">{profile.employmentStatus}</span>
          </div>
        </div>
        <hr className="divider" />
        <div className="info-grid">
          <div className="info-item"><label>Phone</label><p>{profile.phone}</p></div>
          <div className="info-item"><label>Experience</label><p>{profile.experienceYears} yr{profile.experienceYears !== 1 ? "s" : ""}</p></div>
          <div className="info-item"><label>Location</label><p>{profile.currentLocation}</p></div>
          <div className="info-item"><label>LinkedIn</label><p>{profile.linkedinUrl ? <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">View Profile ↗</a> : "—"}</p></div>
          <div className="info-item"><label>Resume</label><p>{profile.resumeUrl ? <a href={profile.resumeUrl} target="_blank" rel="noreferrer">View Resume ↗</a> : "—"}</p></div>
          <div className="info-item" style={{ gridColumn: "1/-1" }}>
            <label>Skills</label>
            <div style={{ marginTop: ".4rem" }}>
              {(profile.skills || "").split(",").map(s => s.trim()).filter(Boolean).map(s => <span key={s} className="tag">{s}</span>)}
            </div>
          </div>
        </div>
        <div style={{ marginTop: "1rem", color: "var(--text-3)", fontSize: ".75rem" }}>
          Profile created {fmtDate(profile.createdAt)} · Last updated {fmtDate(profile.updatedAt)}
        </div>
      </div>
    </div>
  );
}

// ─── NEW INTERVIEW ─────────────────────────────────────────────────────────────
function NewInterview({ onDone }) {
  const [form, setForm] = useState({
    companyName: "", hrName: "", hrContactNumber: "", hrEmailId: "",
    interviewDate: "", interviewTime: "", interviewMode: "", interviewRound: ""
  });
  const [loading, setLoading] = useState(false);

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await interviewService.create(form);
      toast.success("Interview request created!");
      onDone();
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="page fade">
      <div className="page-header">
        <div className="page-title">Schedule Interview</div>
        <div className="page-sub">Add details of your upcoming interview</div>
      </div>
      <div className="card" style={{ maxWidth: 700 }}>
        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="field form-full">
              <label>Company Name</label>
              <input placeholder="e.g. Google, Infosys" value={form.companyName} onChange={f("companyName")} required />
            </div>
            <div className="field">
              <label>HR Name</label>
              <input placeholder="Recruiter's name" value={form.hrName} onChange={f("hrName")} required />
            </div>
            <div className="field">
              <label>HR Contact</label>
              <input placeholder="10-digit number" value={form.hrContactNumber} onChange={f("hrContactNumber")} required />
            </div>
            <div className="field form-full">
              <label>HR Email</label>
              <input type="email" placeholder="hr@company.com" value={form.hrEmailId} onChange={f("hrEmailId")} required />
            </div>
            <div className="field">
              <label>Interview Date</label>
              <input type="date" value={form.interviewDate} onChange={f("interviewDate")} required />
            </div>
            <div className="field">
              <label>Interview Time</label>
              <input type="time" value={form.interviewTime} onChange={f("interviewTime")} required />
            </div>
            <div className="field">
              <label>Mode</label>
              <select value={form.interviewMode} onChange={f("interviewMode")} required>
                <option value="">Select mode</option>
                <option>ONLINE</option><option>OFFLINE</option><option>TELEPHONIC</option>
              </select>
            </div>
            <div className="field">
              <label>Round</label>
              <select value={form.interviewRound} onChange={f("interviewRound")} required>
                <option value="">Select round</option>
                <option>APTITUDE</option><option>TECHNICAL_1</option><option>TECHNICAL_2</option>
                <option>HR</option><option>MANAGERIAL</option><option>FINAL</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: "1.25rem" }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? <><span className="spinner" /> Submitting...</> : <>{Icon.plus} Submit Request</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── MY INTERVIEWS ────────────────────────────────────────────────────────────
function MyInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interviewService.getMy()
      .then(setInterviews)
      .catch(() => setInterviews([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><span className="spinner-lg spinner" /></div>;

  return (
    <div className="page fade">
      <div className="section-row">
        <div>
          <div className="page-title">My Interviews</div>
          <div className="page-sub">{interviews.length} interview request{interviews.length !== 1 ? "s" : ""} found</div>
        </div>
      </div>
      {interviews.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <div className="empty-title">No interviews scheduled</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {interviews.map((iv, i) => (
            <div className={`card fade fade-${Math.min(i + 1, 4)}`} key={iv.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: ".75rem" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: ".3rem" }}>{iv.companyName}</div>
                  <div style={{ color: "var(--text-2)", fontSize: ".85rem" }}>HR: {iv.hrName} · {iv.hrEmailId}</div>
                </div>
                <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                  <span className="badge badge-blue">{iv.interviewRound}</span>
                  {statusBadge(iv.status)}
                  {resultBadge(iv.interviewResult)}
                </div>
              </div>
              <hr className="divider" />
              <div className="info-grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))" }}>
                <div className="info-item"><label>Date</label><p className="mono">{fmtDate(iv.interviewDate)}</p></div>
                <div className="info-item"><label>Time</label><p className="mono">{fmtTime(iv.interviewTime)}</p></div>
                <div className="info-item"><label>Mode</label><p>{iv.interviewMode}</p></div>
                <div className="info-item"><label>HR Contact</label><p>{iv.hrContactNumber}</p></div>
              </div>
              {iv.notes && <div style={{ marginTop: ".75rem", padding: ".75rem", background: "var(--navy-700)", borderRadius: "8px", fontSize: ".85rem", color: "var(--text-2)" }}>
                📝 {iv.notes}
              </div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDash() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interviewService.getDashboard()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><span className="spinner-lg spinner" /></div>;

  const cards = stats ? [
    { icon: "👥", label: "Total Candidates",    val: stats.totalCandidates,    bg: "rgba(59,130,246,.1)", color: "#93c5fd" },
    { icon: "📋", label: "Total Interviews",    val: stats.totalInterviews,    bg: "rgba(99,102,241,.1)", color: "#a5b4fc" },
    { icon: "⏳", label: "Pending Interviews",  val: stats.pendingInterviews,  bg: "rgba(245,158,11,.1)", color: "#fcd34d" },
    { icon: "✅", label: "Completed",           val: stats.completedInterviews,bg: "rgba(34,197,94,.1)",  color: "#86efac" },
    { icon: "🏆", label: "Selected",            val: stats.selectedCandidates, bg: "rgba(168,85,247,.1)", color: "#d8b4fe" },
    { icon: "❌", label: "Rejected",            val: stats.rejectedCandidates, bg: "rgba(239,68,68,.1)",  color: "#fca5a5" },
    { icon: "📅", label: "Today's Interviews",  val: stats.todaysInterviews,   bg: "rgba(20,184,166,.1)", color: "#5eead4" },
  ] : [];

  return (
    <div className="page fade">
      <div className="page-header">
        <div className="page-title">Admin Dashboard</div>
        <div className="page-sub">Real-time overview of all interview activity</div>
      </div>
      <div className="stats-grid">
        {cards.map((s, i) => (
          <div className={`stat-card fade fade-${Math.min(i+1,4)}`} key={s.label}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="stat-val" style={{ color: s.color }}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── UPDATE INTERVIEW MODAL ────────────────────────────────────────────────────
function UpdateModal({ interview, onClose, onSaved }) {
  const [form, setForm] = useState({
    companyName: interview.companyName || "",
    hrName: interview.hrName || "",
    hrContactNumber: interview.hrContactNumber || "",
    hrEmailId: interview.hrEmailId || "",
    interviewDate: interview.interviewDate || "",
    interviewTime: interview.interviewTime?.slice(0, 5) || "",
    interviewMode: interview.interviewMode || "",
    interviewRound: interview.interviewRound || "",
    status: interview.status || "",
    interviewResult: interview.interviewResult || "",
    notes: interview.notes || "",
  });
  const [saving, setSaving] = useState(false);
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await interviewService.update(interview.id, form);
      toast.success("Interview updated!");
      onSaved();
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Update Interview — {interview.companyName}</div>
          <button className="modal-close" onClick={onClose}>{Icon.x}</button>
        </div>
        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="field form-full"><label>Company</label>
              <input value={form.companyName} onChange={f("companyName")} required /></div>
            <div className="field"><label>HR Name</label>
              <input value={form.hrName} onChange={f("hrName")} required /></div>
            <div className="field"><label>HR Contact</label>
              <input value={form.hrContactNumber} onChange={f("hrContactNumber")} required /></div>
            <div className="field form-full"><label>HR Email</label>
              <input type="email" value={form.hrEmailId} onChange={f("hrEmailId")} required /></div>
            <div className="field"><label>Date</label>
              <input type="date" value={form.interviewDate} onChange={f("interviewDate")} required /></div>
            <div className="field"><label>Time</label>
              <input type="time" value={form.interviewTime} onChange={f("interviewTime")} required /></div>
            <div className="field"><label>Mode</label>
              <select value={form.interviewMode} onChange={f("interviewMode")} required>
                <option value="">Select</option><option>ONLINE</option><option>OFFLINE</option><option>TELEPHONIC</option>
              </select></div>
            <div className="field"><label>Round</label>
              <select value={form.interviewRound} onChange={f("interviewRound")} required>
                <option value="">Select</option>
                <option>APTITUDE</option><option>TECHNICAL_1</option><option>TECHNICAL_2</option>
                <option>HR</option><option>MANAGERIAL</option><option>FINAL</option>
              </select></div>
            <div className="field"><label>Status</label>
              <select value={form.status} onChange={f("status")} required>
                <option value="">Select</option>
                <option>SCHEDULED</option><option>COMPLETED</option><option>CANCELLED</option><option>POSTPONED</option><option>PENDING</option>
              </select></div>
            <div className="field"><label>Result</label>
              <select value={form.interviewResult} onChange={f("interviewResult")} required>
                <option value="">Select</option>
                <option>SELECTED</option><option>REJECTED</option><option>PENDING</option><option>ON_HOLD</option><option>AWAITED</option>
              </select></div>
            <div className="field form-full"><label>Notes <span className="text-dim" style={{ textTransform: "none" }}>(optional)</span></label>
              <textarea value={form.notes} onChange={f("notes")} placeholder="Any additional notes..." /></div>
          </div>
          <div style={{ display: "flex", gap: ".75rem", marginTop: "1.25rem" }}>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? <><span className="spinner" /> Saving...</> : "Save Changes"}
            </button>
            <button className="btn btn-outline" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── ADMIN ALL INTERVIEWS ─────────────────────────────────────────────────────
function AdminAll() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    interviewService.getAll()
      .then(setInterviews)
      .catch(() => setInterviews([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const del = async (id) => {
    if (!confirm("Delete this interview request?")) return;
    try { await interviewService.delete(id); toast.success("Deleted"); load(); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <div className="page fade">
      <div className="section-row">
        <div>
          <div className="page-title">All Interviews</div>
          <div className="page-sub">{interviews.length} total requests</div>
        </div>
      </div>
      {loading ? <div className="loading-center"><span className="spinner-lg spinner" /></div> :
        interviews.length === 0 ? (
          <div className="empty"><div className="empty-icon">📭</div><div className="empty-title">No interview requests found</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>Candidate</th><th>Company</th><th>Round</th><th>Date</th><th>Mode</th><th>Status</th><th>Result</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {interviews.map(iv => (
                  <tr key={iv.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text)" }}>{iv.candidateName}</div>
                      <div style={{ fontSize: ".75rem", color: "var(--text-3)" }}>{iv.candidateEmail}</div>
                    </td>
                    <td style={{ fontWeight: 600, color: "var(--text)" }}>{iv.companyName}</td>
                    <td><span className="badge badge-blue">{iv.interviewRound}</span></td>
                    <td className="mono">{fmtDate(iv.interviewDate)} {fmtTime(iv.interviewTime)}</td>
                    <td>{iv.interviewMode}</td>
                    <td>{statusBadge(iv.status)}</td>
                    <td>{resultBadge(iv.interviewResult)}</td>
                    <td>
                      <div style={{ display: "flex", gap: ".4rem" }}>
                        <button className="btn btn-outline btn-sm" onClick={() => setEditing(iv)}>{Icon.edit}</button>
                        <button className="btn btn-danger btn-sm" onClick={() => del(iv.id)}>{Icon.trash}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      {editing && <UpdateModal interview={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

// ─── ADMIN SEARCH & FILTER ────────────────────────────────────────────────────
function AdminSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterResult, setFilterResult] = useState("");
  const [editing, setEditing] = useState(null);
  const [searched, setSearched] = useState(false);

  const search = async (e) => {
    e && e.preventDefault();
    if (!keyword.trim()) return;
    setLoading(true); setSearched(true);
    try { setResults(await interviewService.search(keyword)); }
    catch { setResults([]); }
    finally { setLoading(false); }
  };

  const applyStatusFilter = async () => {
    if (!filterStatus) return;
    setLoading(true); setSearched(true);
    try { setResults(await interviewService.filterByStatus(filterStatus)); }
    catch { setResults([]); }
    finally { setLoading(false); }
  };

  const applyResultFilter = async () => {
    if (!filterResult) return;
    setLoading(true); setSearched(true);
    try { setResults(await interviewService.filterByResult(filterResult)); }
    catch { setResults([]); }
    finally { setLoading(false); }
  };

  return (
    <div className="page fade">
      <div className="page-header">
        <div className="page-title">Search & Filter</div>
        <div className="page-sub">Find interviews by keyword, status, or result</div>
      </div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <form onSubmit={search}>
          <div className="toolbar" style={{ marginBottom: 0 }}>
            <div className="search-input-wrap" style={{ flex: 2 }}>
              <span className="search-icon">{Icon.search}</span>
              <input className="search-input" placeholder="Search by name, company, skills..."
                value={keyword} onChange={e => setKeyword(e.target.value)} />
            </div>
            <button className="btn btn-primary" type="submit">{Icon.search} Search</button>
          </div>
        </form>
        <hr className="divider" />
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: ".8rem", color: "var(--text-3)", fontWeight: 600 }}>{Icon.filter} FILTER BY:</span>
          <select className="search-input" style={{ maxWidth: 180, padding: ".5rem .8rem" }}
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Status...</option>
            <option>SCHEDULED</option><option>COMPLETED</option><option>CANCELLED</option><option>POSTPONED</option><option>PENDING</option>
          </select>
          <button className="btn btn-outline btn-sm" onClick={applyStatusFilter}>Apply</button>
          <select className="search-input" style={{ maxWidth: 180, padding: ".5rem .8rem" }}
            value={filterResult} onChange={e => setFilterResult(e.target.value)}>
            <option value="">Result...</option>
            <option>SELECTED</option><option>REJECTED</option><option>PENDING</option><option>ON_HOLD</option><option>AWAITED</option>
          </select>
          <button className="btn btn-outline btn-sm" onClick={applyResultFilter}>Apply</button>
        </div>
      </div>

      {loading ? <div className="loading-center"><span className="spinner-lg spinner" /></div> :
        !searched ? (
          <div className="empty"><div className="empty-icon">🔍</div><div className="empty-title">Use the search or filters above</div></div>
        ) : results.length === 0 ? (
          <div className="empty"><div className="empty-icon">🚫</div><div className="empty-title">No results found</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>Candidate</th><th>Company</th><th>Round</th><th>Date</th><th>Status</th><th>Result</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {results.map(iv => (
                  <tr key={iv.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text)" }}>{iv.candidateName}</div>
                      <div style={{ fontSize: ".75rem", color: "var(--text-3)" }}>{iv.candidateEmail}</div>
                    </td>
                    <td style={{ fontWeight: 600, color: "var(--text)" }}>{iv.companyName}</td>
                    <td><span className="badge badge-blue">{iv.interviewRound}</span></td>
                    <td className="mono">{fmtDate(iv.interviewDate)}</td>
                    <td>{statusBadge(iv.status)}</td>
                    <td>{resultBadge(iv.interviewResult)}</td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={() => setEditing(iv)}>{Icon.edit} Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      {editing && <UpdateModal interview={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); applyStatusFilter(); }} />}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
function AppInner() {
  const { isLoggedIn, role } = useAuth();
  const [authPage, setAuthPage] = useState("login");
 const defaultPage = role === "ADMIN"
    ? "a-dash"
    : "c-dash";
  const [page, setPage] = useState(defaultPage);

  useEffect(() => { if (isLoggedIn) setPage(role === "ADMIN" ? "a-dash" : "c-dash"); }, [isLoggedIn, role]);

  if (!isLoggedIn) {
    return authPage === "login"
      ? <LoginPage onSwitch={() => setAuthPage("register")} />
      : <RegisterPage onSwitch={() => setAuthPage("login")} />;
  }

  const userName = ""; // Could decode JWT to get name

  const renderPage = () => {
    switch (page) {
      case "c-dash":    return <CandidateDash setPage={setPage} />;
      case "c-profile": return <CandidateProfile />;
      case "c-new":     return <NewInterview onDone={() => setPage("c-my")} />;
      case "c-my":      return <MyInterviews />;
      case "a-dash":    return <AdminDash />;
      case "a-all":     return <AdminAll />;
      case "a-search":  return <AdminSearch />;
      default:          return <CandidateDash setPage={setPage} />;
    }
  };

  return (
    <div className="layout">
      <Sidebar page={page} setPage={setPage} role={role} userName={userName} />
      <div className="main-area">{renderPage()}</div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <style>{G}</style>
      <ToastContainer />
      <AppInner />
    </AuthProvider>
  );
}
