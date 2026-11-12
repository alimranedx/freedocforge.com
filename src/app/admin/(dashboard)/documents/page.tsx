"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  Eye,
  Store,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  X,
  Download,
  ShieldAlert,
} from "lucide-react";

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [inspectDoc, setInspectDoc] = useState<any | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedCategory) params.set("category", selectedCategory);

      const res = await fetch(`/api/admin/documents?${params.toString()}`);
      const data = await res.json();
      if (data.documents) {
        setDocuments(data.documents);
      }
    } catch (e: any) {
      setFeedback({ type: "error", text: "Failed to load documents audit trail." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDocuments();
  };

  const handleDeleteDocument = async (docId: string, docNumber: string) => {
    if (!confirm(`Confirm: Purge document #${docNumber} from database?`)) return;

    try {
      setActionLoadingId(docId);
      const res = await fetch("/api/admin/documents", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: docId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete document");

      setFeedback({ type: "success", text: `Document #${docNumber} purged successfully.` });
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      if (inspectDoc?.id === docId) setInspectDoc(null);
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
              Document Audit & Compliance Center
            </h1>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-bold px-2 py-0.5 rounded-full">
              {documents.length} Audited Slips
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Audit platform-wide invoices, medical prescriptions, and certificates for legal compliance.
          </p>
        </div>

        <button
          onClick={fetchDocuments}
          className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3.5 py-2 rounded-lg transition border border-zinc-700 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Feed</span>
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
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
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

      {/* SEARCH AND CATEGORY FILTERS */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Document #, Recipient, Template, or Creator..."
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

        {/* CATEGORY FILTER PILLS */}
        <div className="flex items-center gap-1.5 self-start md:self-auto shrink-0 text-xs overflow-x-auto max-w-full pb-1 md:pb-0">
          {[
            { label: "All Formats", val: "" },
            { label: "Business (Memos)", val: "Business" },
            { label: "Healthcare (Rx)", val: "Healthcare" },
            { label: "Academic", val: "Education" },
            { label: "Food POS", val: "POS" },
          ].map((cat) => (
            <button
              key={cat.val}
              onClick={() => setSelectedCategory(cat.val)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer shrink-0 ${
                selectedCategory === cat.val
                  ? "bg-red-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* DOCUMENTS AUDIT TABLE */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead>
              <tr className="border-b border-zinc-800 text-[10px] uppercase font-mono text-zinc-500 bg-zinc-900/80">
                <th className="py-3.5 px-4">Document #</th>
                <th className="py-3.5 px-4">Template / Format</th>
                <th className="py-3.5 px-4">Recipient / Details</th>
                <th className="py-3.5 px-4">Amount / Rx Details</th>
                <th className="py-3.5 px-4">Origin Merchant</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500 font-sans">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-zinc-600 mb-2" />
                    Auditing saved documents...
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500 font-sans">
                    No documents found matching criteria.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-zinc-800/40 transition">
                    {/* Document Number */}
                    <td className="py-3.5 px-4 font-bold text-white">
                      <span className="font-mono text-xs">{doc.documentNumber}</span>
                    </td>

                    {/* Template & Category */}
                    <td className="py-3.5 px-4 font-sans">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-white block text-xs truncate max-w-[170px]">
                          {doc.templateTitle}
                        </span>
                        <span className="inline-block text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                          {doc.category}
                        </span>
                      </div>
                    </td>

                    {/* Recipient */}
                    <td className="py-3.5 px-4 font-sans text-zinc-300 truncate max-w-[150px]">
                      {doc.recipientName || "—"}
                    </td>

                    {/* Amount / Rx details */}
                    <td className="py-3.5 px-4">
                      <span className="text-emerald-400 font-bold">
                        {doc.amountOrDetails || "Standard Slip"}
                      </span>
                    </td>

                    {/* Origin Merchant */}
                    <td className="py-3.5 px-4 font-sans">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-white block text-xs">
                          {doc.creatorName}
                        </span>
                        <span className="text-[10px] text-zinc-500 block truncate max-w-[130px]">
                          {doc.creatorEmail}
                        </span>
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-zinc-500 text-[10px]">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setInspectDoc(doc)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer border border-zinc-700"
                          title="Inspect Document Payload"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc.id, doc.documentNumber)}
                          disabled={actionLoadingId === doc.id}
                          className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 transition cursor-pointer border border-zinc-700/80 hover:border-red-800 disabled:opacity-50"
                          title="Purge Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT MODAL */}
      {inspectDoc && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs font-sans">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-500" />
                  Audit Inspection: #{inspectDoc.documentNumber}
                </h3>
                <p className="text-xs text-zinc-400">
                  {inspectDoc.templateTitle} • Created by {inspectDoc.creatorName}
                </p>
              </div>
              <button
                onClick={() => setInspectDoc(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Recipient / Client</span>
                  <span className="text-white font-bold">{inspectDoc.recipientName || "—"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Amount or Scope</span>
                  <span className="text-emerald-400 font-bold">{inspectDoc.amountOrDetails || "—"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Category</span>
                  <span className="text-zinc-300">{inspectDoc.category}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Timestamp</span>
                  <span className="text-zinc-300">{new Date(inspectDoc.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                  Stored Data Payload (JSON)
                </span>
                <pre className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-[11px] text-zinc-300 overflow-x-auto max-h-60">
                  {JSON.stringify(inspectDoc.dataJson || {}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-800 flex justify-end gap-2 bg-zinc-900/50">
              <button
                onClick={() => setInspectDoc(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
