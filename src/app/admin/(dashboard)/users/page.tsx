"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  Filter,
  Shield,
  User,
  Plus,
  Trash2,
  RefreshCw,
  Sparkles,
  Store,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedRole) params.set("role", selectedRole);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (e: any) {
      setFeedback({ type: "error", text: "Failed to load users from API." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleUpdateRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    try {
      setActionLoadingId(userId);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");

      setFeedback({ type: "success", text: `User role successfully updated to ${newRole}.` });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAddAiQuota = async (userId: string, currentQuota: number, amount: number) => {
    const newQuota = currentQuota + amount;
    try {
      setActionLoadingId(userId);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, aiQuota: newQuota }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to top up AI quota");

      setFeedback({ type: "success", text: `Added +${amount} AI quota tokens to user.` });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, aiQuota: newQuota } : u))
      );
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Warning: Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoadingId(userId);
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");

      setFeedback({ type: "success", text: `User "${userName}" was removed from the database.` });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black text-white tracking-wide uppercase">
              Merchants & Registered Users Directory
            </h1>
            <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-800 font-mono font-bold px-2 py-0.5 rounded-full">
              {users.length} Records
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage shopkeepers, doctors, coaching centers, AI design quotas, and access roles.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3.5 py-2 rounded-lg transition border border-zinc-700 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh List</span>
        </button>
      </div>

      {/* FEEDBACK BANNER */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === "success"
              ? "bg-emerald-950/70 border-emerald-800 text-emerald-300"
              : "bg-red-950/70 border-red-800 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-[11px] font-bold underline cursor-pointer hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* SEARCH AND FILTER TOOLBAR */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Merchant Name, Email, Phone, or Business..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-24 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-md transition cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* ROLE FILTER PILLS */}
        <div className="flex items-center gap-1.5 self-start md:self-auto shrink-0 text-xs">
          <button
            onClick={() => setSelectedRole("")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              selectedRole === ""
                ? "bg-red-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            All Roles
          </button>
          <button
            onClick={() => setSelectedRole("USER")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              selectedRole === "USER"
                ? "bg-red-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            Merchants (USER)
          </button>
          <button
            onClick={() => setSelectedRole("ADMIN")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              selectedRole === "ADMIN"
                ? "bg-red-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            Superusers (ADMIN)
          </button>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead>
              <tr className="border-b border-zinc-800 text-[10px] uppercase font-mono text-zinc-500 bg-zinc-900/80">
                <th className="py-3.5 px-4">Merchant / User Identity</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Business Preset</th>
                <th className="py-3.5 px-4 text-center">Docs Created</th>
                <th className="py-3.5 px-4 text-center">AI Quota</th>
                <th className="py-3.5 px-4 text-center">Role Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500 font-sans">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-zinc-600 mb-2" />
                    Loading registered merchants...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500 font-sans">
                    No merchants match the search criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-800/40 transition">
                    {/* User Identity */}
                    <td className="py-3.5 px-4 font-sans">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white text-xs shrink-0">
                          {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <span className="font-bold text-white block text-xs">{u.name}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            Joined {new Date(u.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-3.5 px-4 font-sans">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-zinc-300 text-[11px]">
                          <Mail className="w-3 h-3 text-zinc-500" />
                          <span>{u.email || "No email"}</span>
                        </div>
                        {u.phone && (
                          <div className="flex items-center gap-1 text-zinc-400 text-[11px] font-mono">
                            <Phone className="w-3 h-3 text-zinc-500" />
                            <span>{u.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Business Preset */}
                    <td className="py-3.5 px-4 font-sans">
                      <div className="flex items-center gap-1.5 text-zinc-200">
                        <Store className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="font-semibold truncate max-w-[140px]">
                          {u.businessName || "Default Shop"}
                        </span>
                      </div>
                    </td>

                    {/* Docs Count */}
                    <td className="py-3.5 px-4 text-center font-bold text-white">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[11px]">
                        <FileText className="w-3 h-3 text-emerald-400" />
                        {u.documentsCount || 0}
                      </span>
                    </td>

                    {/* AI Quota */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-purple-950/60 text-purple-300 border border-purple-800">
                          {u.aiQuota ?? 5} Left
                        </span>
                        <button
                          onClick={() => handleAddAiQuota(u.id, u.aiQuota ?? 5, 10)}
                          disabled={actionLoadingId === u.id}
                          title="Add +10 AI tokens"
                          className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-purple-400 hover:text-white transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Role Status */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleUpdateRole(u.id, u.role)}
                        disabled={actionLoadingId === u.id}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition cursor-pointer border ${
                          u.role === "ADMIN"
                            ? "bg-red-950/60 text-red-400 border-red-800 hover:bg-red-900"
                            : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
                        }`}
                        title="Click to toggle Role"
                      >
                        {u.role === "ADMIN" ? "Superuser" : "Standard"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        disabled={actionLoadingId === u.id}
                        className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 transition cursor-pointer border border-zinc-700/80 hover:border-red-800 disabled:opacity-50"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
