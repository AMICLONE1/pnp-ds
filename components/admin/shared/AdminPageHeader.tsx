"use client";

import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export interface Crumb {
  label: string;
  href?: string;
}

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  backHref?: string;
  actions?: ReactNode;
  badge?: ReactNode;
}

export function AdminPageHeader({
  title,
  subtitle,
  breadcrumbs,
  backHref,
  actions,
  badge,
}: AdminPageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3"
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-sm text-gray-500 flex-wrap">
          {breadcrumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
              {c.href ? (
                <Link
                  href={c.href}
                  className="hover:text-gold-dark transition-colors"
                >
                  {c.label}
                </Link>
              ) : (
                <span className="text-gray-700 font-medium">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          {backHref && (
            <Link
              href={backHref}
              className="mt-1 p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-black">{title}</h1>
              {badge}
            </div>
            {subtitle && <p className="text-gray-600 mt-1 text-sm">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
    </motion.div>
  );
}

interface EntityLinkProps {
  type: "user" | "host" | "project";
  id: string;
  label: string;
  secondary?: string;
  className?: string;
}

export function EntityLink({ type, id, label, secondary, className = "" }: EntityLinkProps) {
  const href =
    type === "host"
      ? `/admin/hosts/${id}`
      : type === "project"
      ? `/admin/projects/${id}`
      : `/admin/users/${id}`;

  return (
    <Link
      href={href}
      className={`inline-flex flex-col hover:text-gold-dark transition-colors group ${className}`}
    >
      <span className="font-medium text-gray-900 group-hover:text-gold-dark group-hover:underline decoration-dotted underline-offset-2">
        {label}
      </span>
      {secondary && <span className="text-xs text-gray-500">{secondary}</span>}
    </Link>
  );
}

interface AdminTabsProps {
  tabs: { id: string; label: string; count?: number; icon?: ReactNode }[];
  active: string;
  onChange: (id: string) => void;
}

export function AdminTabs({ tabs, active, onChange }: AdminTabsProps) {
  return (
    <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto">
      {tabs.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              isActive
                ? "text-gold-dark"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
            {typeof t.count === "number" && (
              <span
                className={`px-1.5 py-0.5 text-xs rounded-md ${
                  isActive
                    ? "bg-gold/20 text-gold-dark"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {t.count}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="adminTabActive"
                className="absolute inset-x-0 bottom-0 h-0.5 bg-gold-dark"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

interface StatPillProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
}

export function StatPill({ label, value, icon, color = "bg-gray-50" }: StatPillProps) {
  return (
    <div className={`rounded-xl p-4 border border-gray-200 ${color}`}>
      <div className="flex items-center gap-2 text-xs text-gray-600 font-medium uppercase tracking-wide">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold text-black">{value}</div>
    </div>
  );
}
