"use client";

import { useEffect, useState, useCallback } from "react";
import AshokaCss from "@/components/AshokaCss";
import * as XLSX from "xlsx";

/* ── Types ── */
interface ExportRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  roll_number: string;
  department: string;
  year: string;
  competition: string;
  time_slot: string | null;
  registered_at: string;
}

interface Stats {
  total: number;
  byCompetition: { competition: string; count: number }[];
  byDepartment: { department: string; count: number }[];
  byYear: { year: string; count: number }[];
  recent: {
    id: number;
    name: string;
    email: string;
    phone: string;
    roll_number: string;
    department: string;
    year: string;
    competition: string;
    time_slot: string | null;
    registered_at: string;
  }[];
  byDate: { day: string; count: number }[];
}

/* ── Bar chart component ── */
function BarChart({ data, color }: { data: { label: string; count: number }[]; color: string }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <div className="w-32 text-xs text-right text-[#8888A8] truncate shrink-0">{d.label}</div>
          <div className="flex-1 h-7 bg-white/5 rounded-lg overflow-hidden relative">
            <div
              className="h-full rounded-lg transition-all duration-700 ease-out flex items-center px-3"
              style={{ width: `${(d.count / max) * 100}%`, background: color }}
            >
              <span className="text-xs font-bold text-white/90 whitespace-nowrap">{d.count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Mini trend bars ── */
function TrendChart({ data }: { data: { day: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-sm bg-gradient-to-t from-[#FF9933] to-[#FFB347] transition-all duration-500"
            style={{ height: `${(d.count / max) * 100}%`, minHeight: "4px" }}
            title={`${d.day}: ${d.count}`}
          />
          <span className="text-[8px] text-[#8888A8] truncate w-full text-center">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Stat card ── */
function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div
      className="rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      style={{ background: `${color}10`, borderColor: `${color}30` }}
    >
      <p className="text-xs tracking-widest uppercase mb-2" style={{ color }}>{label}</p>
      <p className="text-4xl font-black text-white font-mono">{value}</p>
      {sub && <p className="text-xs text-[#8888A8] mt-1">{sub}</p>}
    </div>
  );
}

/* ── Main ── */
export default function AdminPage() {
  const [key, setKey] = useState(() =>
    typeof window !== "undefined" ? sessionStorage.getItem("admin_key") ?? "" : ""
  );
  const [inputKey, setInputKey] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterComp, setFilterComp] = useState("All");
  const [sortField, setSortField] = useState<"registered_at" | "name" | "competition">("registered_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchStats = useCallback(async (adminKey: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/stats?key=${encodeURIComponent(adminKey)}`);
      if (res.status === 401) { setError("Invalid admin key"); setKey(""); return; }
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setStats(data);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this registration? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}?key=${encodeURIComponent(key)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      // Remove locally for instant feedback, full refresh follows
      setStats((prev) => prev ? { ...prev, total: prev.total - 1, recent: prev.recent.filter((r) => r.id !== id) } : prev);
    } catch {
      alert("Failed to delete registration");
    } finally {
      setDeletingId(null);
    }
  };

  // Auto-refresh every 30s
  useEffect(() => {
    if (!key) return;
    const t = setTimeout(() => fetchStats(key), 0);
    const id = setInterval(() => fetchStats(key), 30000);
    return () => { clearTimeout(t); clearInterval(id); };
  }, [key, fetchStats]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;
    const k = inputKey.trim();
    sessionStorage.setItem("admin_key", k);
    setKey(k);
  };

  // ── Login screen ──
  if (!key) {
    return (
      <div className="min-h-screen bg-[#07070E] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8">
            <AshokaCss size={56} />
          </div>
          <h1 className="text-center font-black text-2xl text-white mb-1" style={{ fontFamily: "var(--font-cinzel)" }}>
            Admin Dashboard
          </h1>
          <p className="text-center text-[#8888A8] text-sm mb-8">Independence Day · KL University</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin key"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#8888A8] focus:outline-none focus:border-[#FF9933]/60 focus:bg-white/8 transition-all text-sm"
            />
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-black text-sm transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #FF9933, #e68000)" }}
            >
              Access Dashboard →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Loading ──
  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-[#07070E] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#FF9933] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#8888A8] text-sm">Loading analytics…</p>
        </div>
      </div>
    );
  }

  // ── Filtered table data ──
  const filtered = (stats?.recent ?? [])
    .filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.roll_number.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q);
      const matchComp = filterComp === "All" || r.competition === filterComp;
      return matchSearch && matchComp;
    })
    .sort((a, b) => {
      const va = a[sortField] as string;
      const vb = b[sortField] as string;
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const competitions = ["All", ...(stats?.byCompetition.map((c) => c.competition) ?? [])];

  const topCompetition = stats?.byCompetition[0];
  const topDept = stats?.byDepartment[0];

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const fetchExportRows = async (competition: string): Promise<ExportRow[]> => {
    const params = new URLSearchParams({ key });
    if (competition !== "All") params.set("competition", competition);
    const res = await fetch(`/api/admin/export?${params}`);
    if (!res.ok) { alert("Export failed"); return []; }
    const data = await res.json();
    return data.rows ?? [];
  };

  const downloadCSV = async (competition: string) => {
    const rows = await fetchExportRows(competition);
    if (!rows.length) { alert("No registrations found"); return; }
    const headers = ["ID", "Name", "Email", "Phone", "Roll No", "Department", "Year", "Competition", "Time Slot", "Registered At"];
    const body = rows.map((r) => [r.id, r.name, r.email, r.phone, r.roll_number, r.department, r.year, r.competition, r.time_slot ?? "—", r.registered_at]);
    const csv = [headers, ...body].map((row) => row.map((v) => `"${String(v)}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${competition === "All" ? "all_registrations" : competition.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadXLSX = async (competition: string) => {
    const rows = await fetchExportRows(competition);
    if (!rows.length) { alert("No registrations found"); return; }
    const headers = ["ID", "Name", "Email", "Phone", "Roll No", "Department", "Year", "Competition", "Time Slot", "Registered At"];
    const body = rows.map((r) => [r.id, r.name, r.email, r.phone, r.roll_number, r.department, r.year, r.competition, r.time_slot ?? "—", r.registered_at]);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...body]);
    ws["!cols"] = [
      { wch: 6 }, { wch: 22 }, { wch: 30 }, { wch: 14 }, { wch: 14 },
      { wch: 16 }, { wch: 10 }, { wch: 42 }, { wch: 18 }, { wch: 22 },
    ];
    const sheetName = competition === "All" ? "All" : competition.slice(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const filename = competition === "All" ? "all_registrations" : competition.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportCSV = () => downloadCSV(filterComp);
  const exportXLSX = () => downloadXLSX(filterComp);

  return (
    <div className="min-h-screen bg-[#07070E] text-white">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#07070E]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AshokaCss size={28} />
            <div>
              <h1 className="font-black text-sm sm:text-base text-white leading-none" style={{ fontFamily: "var(--font-cinzel)" }}>
                Admin Dashboard
              </h1>
              <p className="text-[10px] text-[#8888A8]">Independence Day · KL University</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {loading && (
              <div className="w-4 h-4 border border-[#FF9933] border-t-transparent rounded-full animate-spin" />
            )}
            <button
              onClick={() => fetchStats(key)}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-[#8888A8] hover:text-white hover:border-white/30 transition-all"
            >
              ↻ Refresh
            </button>
            <button
              onClick={() => { sessionStorage.removeItem("admin_key"); setKey(""); setStats(null); }}
              className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Registrations" value={stats?.total ?? 0} sub="across all events" color="#FF9933" />
          <StatCard label="Competitions" value={stats?.byCompetition.length ?? 0} sub="active events" color="#138808" />
          <StatCard label="Top Event" value={topCompetition?.competition ?? "—"} sub={topCompetition ? `${topCompetition.count} registrations` : ""} color="#FF9933" />
          <StatCard label="Top Department" value={topDept?.department ?? "—"} sub={topDept ? `${topDept.count} students` : ""} color="#138808" />
        </div>

        {/* ── Charts row ── */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Competition breakdown */}
          <div className="lg:col-span-2 rounded-2xl border border-white/8 bg-[#0F0F1A] p-6">
            <h2 className="font-bold text-white mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF9933]" /> Registrations by Competition
            </h2>
            <BarChart
              data={(stats?.byCompetition ?? []).map((d) => ({ label: d.competition, count: d.count }))}
              color="linear-gradient(90deg, #FF9933, #e68000)"
            />
          </div>

          {/* Year of study */}
          <div className="rounded-2xl border border-white/8 bg-[#0F0F1A] p-6">
            <h2 className="font-bold text-white mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#138808]" /> By Year of Study
            </h2>
            <BarChart
              data={(stats?.byYear ?? []).map((d) => ({ label: `${d.year} Year`, count: d.count }))}
              color="linear-gradient(90deg, #138808, #0d6e06)"
            />
          </div>
        </div>

        {/* Department + trend */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-white/8 bg-[#0F0F1A] p-6">
            <h2 className="font-bold text-white mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white/60" /> Registrations by Department
            </h2>
            <BarChart
              data={(stats?.byDepartment ?? []).map((d) => ({ label: d.department, count: d.count }))}
              color="linear-gradient(90deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))"
            />
          </div>

          <div className="rounded-2xl border border-white/8 bg-[#0F0F1A] p-6">
            <h2 className="font-bold text-white mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF9933]" /> Last 7 Days
            </h2>
            {stats?.byDate && stats.byDate.length > 0 ? (
              <TrendChart data={stats.byDate} />
            ) : (
              <div className="h-16 flex items-center justify-center text-[#8888A8] text-xs">No data yet</div>
            )}
          </div>
        </div>

        {/* ── Download by Competition ── */}
        <div className="rounded-2xl border border-white/8 bg-[#0F0F1A] p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF9933]" /> Download by Competition
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => downloadCSV("All")}
                className="text-xs px-3 py-1.5 rounded-lg border border-[#138808]/40 text-[#138808] hover:bg-[#138808]/10 transition-all font-medium"
              >
                ↓ All CSV
              </button>
              <button
                onClick={() => downloadXLSX("All")}
                className="text-xs px-3 py-1.5 rounded-lg border border-[#FF9933]/40 text-[#FF9933] hover:bg-[#FF9933]/10 transition-all font-medium"
              >
                ↓ All XLSX
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {(stats?.byCompetition ?? []).map((c) => (
              <div
                key={c.competition}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/3 border border-white/6 hover:border-white/12 transition-all"
              >
                <span className="text-[#FF9933] text-xs font-bold w-7 text-right shrink-0">{c.count}</span>
                <span className="text-white text-xs flex-1 truncate">{c.competition}</span>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => downloadCSV(c.competition)}
                    className="text-[10px] px-2.5 py-1 rounded-lg border border-[#138808]/40 text-[#138808] hover:bg-[#138808]/10 transition-all font-medium"
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => downloadXLSX(c.competition)}
                    className="text-[10px] px-2.5 py-1 rounded-lg border border-[#FF9933]/40 text-[#FF9933] hover:bg-[#FF9933]/10 transition-all font-medium"
                  >
                    XLSX
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Registrations table ── */}
        <div className="rounded-2xl border border-white/8 bg-[#0F0F1A] overflow-hidden">
          {/* Table header */}
          <div className="p-5 border-b border-white/8 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <h2 className="font-bold text-white">Recent Registrations</h2>
            <div className="flex gap-2 flex-wrap">
              {/* Search */}
              <input
                type="text"
                placeholder="Search name, email, roll…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-[#8888A8] focus:outline-none focus:border-[#FF9933]/40 transition-all w-48"
              />
              {/* Filter by competition */}
              <select
                value={filterComp}
                onChange={(e) => setFilterComp(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF9933]/40 transition-all"
              >
                {competitions.map((c) => <option key={c} value={c} className="bg-[#0F0F1A]">{c}</option>)}
              </select>
              {/* Export CSV */}
              <button
                onClick={exportCSV}
                className="text-xs px-3 py-2 rounded-lg border border-[#138808]/40 text-[#138808] hover:bg-[#138808]/10 transition-all font-medium"
              >
                ↓ CSV
              </button>
              {/* Export XLSX */}
              <button
                onClick={exportXLSX}
                className="text-xs px-3 py-2 rounded-lg border border-[#FF9933]/40 text-[#FF9933] hover:bg-[#FF9933]/10 transition-all font-medium"
              >
                ↓ XLSX
              </button>
            </div>
          </div>

          {/* Count */}
          <div className="px-5 py-2 border-b border-white/5">
            <p className="text-xs text-[#8888A8]">Showing {filtered.length} of {stats?.total ?? 0} registrations</p>
          </div>

          {/* Scrollable table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-[#8888A8] text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 text-left font-medium">#</th>
                  <th
                    className="px-5 py-3 text-left font-medium cursor-pointer hover:text-white transition-colors select-none"
                    onClick={() => toggleSort("name")}
                  >
                    Name {sortField === "name" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th className="px-5 py-3 text-left font-medium">Email</th>
                  <th className="px-5 py-3 text-left font-medium">Phone</th>
                  <th className="px-5 py-3 text-left font-medium">Roll No</th>
                  <th className="px-5 py-3 text-left font-medium">Dept</th>
                  <th className="px-5 py-3 text-left font-medium">Year</th>
                  <th
                    className="px-5 py-3 text-left font-medium cursor-pointer hover:text-white transition-colors select-none"
                    onClick={() => toggleSort("competition")}
                  >
                    Competition {sortField === "competition" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th className="px-5 py-3 text-left font-medium whitespace-nowrap">Time Slot</th>
                  <th
                    className="px-5 py-3 text-left font-medium cursor-pointer hover:text-white transition-colors select-none whitespace-nowrap"
                    onClick={() => toggleSort("registered_at")}
                  >
                    Registered At {sortField === "registered_at" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-red-400/60">Delete</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-5 py-16 text-center text-[#8888A8] text-sm">
                      {stats?.total === 0 ? "No registrations yet 🎉" : "No results match your search"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, i) => (
                    <tr
                      key={r.id}
                      className="border-b border-white/5 hover:bg-white/3 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-[#8888A8] text-xs">{i + 1}</td>
                      <td className="px-5 py-3.5 font-medium text-white whitespace-nowrap">{r.name}</td>
                      <td className="px-5 py-3.5 text-[#8888A8] text-xs">{r.email}</td>
                      <td className="px-5 py-3.5 text-[#8888A8] text-xs">{r.phone}</td>
                      <td className="px-5 py-3.5 text-[#8888A8] text-xs font-mono">{r.roll_number}</td>
                      <td className="px-5 py-3.5 text-[#8888A8] text-xs">{r.department}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/8 text-white/70">{r.year}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap"
                          style={{
                            background: "#FF993320",
                            color: "#FF9933",
                            border: "1px solid #FF993340",
                          }}
                        >
                          {r.competition}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {r.time_slot ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap bg-[#138808]/15 text-[#138808] border border-[#138808]/30">
                            {r.time_slot}
                          </span>
                        ) : (
                          <span className="text-[#8888A8] text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-[#8888A8] text-xs whitespace-nowrap">{r.registered_at}</td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleDelete(r.id)}
                          disabled={deletingId === r.id}
                          className="text-[10px] px-2.5 py-1 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {deletingId === r.id ? "…" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-center text-[#8888A8]/40 text-xs pb-4">Auto-refreshes every 30 seconds · {stats?.total ?? 0} total entries</p>
      </main>
    </div>
  );
}
