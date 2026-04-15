"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Building2, User as UserIcon, FolderKanban, Loader2, CornerDownLeft } from "lucide-react";

interface SearchResults {
  users: { id: string; name: string | null; email: string | null }[];
  hosts: { id: string; name: string | null; email: string | null }[];
  projects: { id: string; name: string; spv_id: string; location: string; state: string }[];
}

type Item = {
  type: "user" | "host" | "project";
  id: string;
  label: string;
  secondary: string;
  href: string;
};

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({ users: [], hosts: [], projects: [] });
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Open on Cmd+K / Ctrl+K or custom event
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const handleOpen = () => setOpen(true);
    window.addEventListener("keydown", handleKey);
    window.addEventListener("admin:open-command-palette", handleOpen);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("admin:open-command-palette", handleOpen);
    };
  }, []);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIdx(0);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!open) return;
    if (!query.trim()) {
      setResults({ users: [], hosts: [], projects: [] });
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (json.success) setResults(json.data);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [query, open]);

  // Flatten results
  const items: Item[] = useMemo(() => [
    ...results.hosts.map((h) => ({
      type: "host" as const,
      id: h.id,
      label: h.name || "Unnamed Host",
      secondary: h.email || "",
      href: `/admin/hosts/${h.id}`,
    })),
    ...results.projects.map((p) => ({
      type: "project" as const,
      id: p.id,
      label: p.name,
      secondary: `${p.spv_id} • ${p.location}, ${p.state}`,
      href: `/admin/projects/${p.id}`,
    })),
    ...results.users.map((u) => ({
      type: "user" as const,
      id: u.id,
      label: u.name || "Unnamed User",
      secondary: u.email || "",
      href: `/admin/users/${u.id}`,
    })),
  ], [results]);

  const go = useCallback(
    (item: Item) => {
      setOpen(false);
      router.push(item.href);
    },
    [router]
  );

  // Arrow nav
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, items.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && items[selectedIdx]) {
        e.preventDefault();
        go(items[selectedIdx]);
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [open, items, selectedIdx, go]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-[90vw] max-w-xl z-[101] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIdx(0);
                }}
                placeholder="Search users, hosts, plants..."
                className="flex-1 text-sm focus:outline-none placeholder:text-gray-400"
              />
              {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
              <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-mono text-gray-500">
                ESC
              </kbd>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {!query.trim() ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  Type to search across users, hosts, and plants
                </div>
              ) : items.length === 0 && !loading ? (
                <div className="p-8 text-center text-gray-400 text-sm">No results found</div>
              ) : (
                <div className="py-2">
                  {items.map((item, idx) => (
                    <button
                      key={`${item.type}-${item.id}`}
                      onClick={() => go(item)}
                      onMouseEnter={() => setSelectedIdx(idx)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
                        idx === selectedIdx ? "bg-gold/10" : "hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          item.type === "host"
                            ? "bg-gold/20 text-gold-dark"
                            : item.type === "project"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        {item.type === "host" ? (
                          <Building2 className="w-4 h-4" />
                        ) : item.type === "project" ? (
                          <FolderKanban className="w-4 h-4" />
                        ) : (
                          <UserIcon className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium text-black truncate">{item.label}</p>
                        <p className="text-xs text-gray-500 truncate">{item.secondary}</p>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                        {item.type}
                      </span>
                      {idx === selectedIdx && <CornerDownLeft className="w-3 h-3 text-gray-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-[10px] text-gray-500">
              <div className="flex items-center gap-3">
                <span>↑↓ navigate</span>
                <span>↵ open</span>
              </div>
              <span>Global search</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
