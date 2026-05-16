"use client";

import { cn } from "@/shared/utils/cn";
import { type CSSProperties, type HTMLAttributes } from "react";

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn("animate-pulse rounded-md bg-muted/30", className)}
    />
  );
}

export function PageHeaderSkeleton({
  titleWidth = "w-56",
  subtitleWidth = "w-72",
  actionWidths = ["w-40", "w-36"],
}: {
  titleWidth?: string;
  subtitleWidth?: string;
  actionWidths?: string[];
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
      <div className="space-y-3">
        <Skeleton className={cn("h-10 rounded-xl", titleWidth)} />
        <Skeleton className={cn("h-5 max-w-[85vw] rounded-xl", subtitleWidth)} />
      </div>
      <div className="flex gap-3">
        {actionWidths.map((width, index) => (
          <Skeleton
            key={`${width}-${index}`}
            className={cn(
              "h-11 rounded-xl",
              index === 0 ? "flex-1 md:flex-none" : "hidden md:block",
              width
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function ShoppingListCardSkeleton({
  highlighted = false,
}: {
  highlighted?: boolean;
}) {
  return (
    <div className="relative overflow-hidden bg-card p-6 rounded-[2rem] border border-border shadow-sm">
      {highlighted && (
        <div className="absolute top-0 right-0 h-10 w-24 bg-emerald-100/60 dark:bg-emerald-900/20 rotate-12 translate-x-4 -translate-y-2 rounded-full" />
      )}

      <div className="flex justify-between items-start mb-6">
        <Skeleton className="h-12 w-12 rounded-2xl bg-muted/40" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <Skeleton className="h-6 w-3/4 rounded-lg bg-muted/40" />
        <Skeleton className="h-4 w-1/3 rounded-lg" />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <div className="h-2.5 w-full rounded-full bg-muted/20 overflow-hidden">
          <Skeleton className="h-full w-1/2 rounded-full bg-muted/50" />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-3 w-3 rounded" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-12 w-12 rounded-2xl bg-muted/40" />
        <Skeleton className="h-6 w-14 rounded-lg" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-3 w-28 rounded" />
        <Skeleton className="h-8 w-32 rounded-lg bg-muted/40" />
      </div>
    </div>
  );
}

export function ProjectionCardSkeleton() {
  return (
    <div className="bg-muted/20 rounded-[2.5rem] p-8 border border-border/50 relative overflow-hidden">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-48 rounded" />
          </div>
          <div className="flex items-end gap-3">
            <Skeleton className="h-10 w-44 rounded-xl" />
            <Skeleton className="h-6 w-32 rounded-lg mb-1" />
          </div>
          <Skeleton className="h-4 w-full max-w-md rounded" />
        </div>
        
        <div className="flex gap-4">
          <div className="bg-muted/30 p-4 rounded-3xl border border-border/50 min-w-[140px] space-y-3">
            <Skeleton className="h-3 w-20 rounded mx-auto" />
            <Skeleton className="h-6 w-24 rounded-lg mx-auto" />
          </div>
          <div className="bg-muted/30 p-4 rounded-3xl border border-border/50 min-w-[140px] space-y-3">
            <Skeleton className="h-3 w-20 rounded mx-auto" />
            <Skeleton className="h-6 w-24 rounded-lg mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChartCardSkeleton({
  withLegend = false,
  titleWidth = "w-48",
}: {
  withLegend?: boolean;
  titleWidth?: string;
}) {
  return (
    <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm">
      <Skeleton className={cn("h-6 rounded-lg bg-muted/40 mb-6 ml-2", titleWidth)} />
      <div className="h-[300px] w-full flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 h-full w-full rounded-2xl bg-muted/20 border border-border/50 p-4">
          <div className="h-full w-full flex items-end gap-3">
            {[35, 55, 45, 70, 50, 80].map((height, index) => (
              <div key={index} className="flex-1 flex items-end h-full">
                <Skeleton
                  className="w-full rounded-t-xl bg-muted/40"
                  style={{ height: `${height}%` } as CSSProperties}
                />
              </div>
            ))}
          </div>
        </div>

        {withLegend && (
          <div className="flex flex-col gap-3 min-w-[150px] w-full md:w-auto">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Skeleton className="w-3 h-3 rounded-full bg-muted/40" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function TableCardSkeleton({
  columns = [160, 80, 70, 90, 70],
  rows = 4,
  titleWidth = "w-44",
  badgeWidth = "w-24",
}: {
  columns?: number[];
  rows?: number;
  titleWidth?: string;
  badgeWidth?: string;
}) {
  return (
    <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
      <div className="p-8 border-b border-border flex items-center justify-between">
        <Skeleton className={cn("h-7 rounded-lg bg-muted/40", titleWidth)} />
        <Skeleton className={cn("h-7 rounded-full", badgeWidth)} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/5 text-left border-b border-border">
              {columns.map((width, index) => (
                <th key={index} className="px-8 py-4">
                  <Skeleton className="h-3 rounded" style={{ width }} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: rows }).map((_, row) => (
              <tr key={row}>
                <td className="px-8 py-5"><Skeleton className="h-5 w-40 rounded bg-muted/40" /></td>
                <td className="px-8 py-5"><Skeleton className="h-4 w-24 rounded" /></td>
                <td className="px-8 py-5"><Skeleton className="h-4 w-16 rounded" /></td>
                <td className="px-8 py-5"><Skeleton className="h-6 w-24 rounded-lg" /></td>
                <td className="px-8 py-5"><Skeleton className="ml-auto h-5 w-20 rounded bg-muted/40" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ShoppingListFormPageSkeleton() {
  return (
    <main className="max-w-7xl mx-auto w-full p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-11 w-11 rounded-2xl bg-muted/40" />
        <Skeleton className="h-10 w-40 rounded-xl bg-muted/40" />
        <div className="ml-auto">
          <Skeleton className="h-11 w-32 rounded-2xl bg-muted/40" />
        </div>
      </div>

      <div className="bg-card p-6 rounded-[2.5rem] border border-border shadow-sm space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-28 rounded bg-muted/40 ml-1" />
          <Skeleton className="h-12 w-full rounded-2xl bg-muted/40" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Skeleton className="h-5 w-5 rounded-lg bg-muted/40" />
          <Skeleton className="h-5 w-28 rounded bg-muted/40" />
          <Skeleton className="h-5 w-10 rounded-full bg-muted/40" />
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <Skeleton className="h-12 flex-1 rounded-xl bg-muted/40" />
            <Skeleton className="h-12 w-full md:w-48 rounded-xl bg-muted/40" />
            <Skeleton className="h-12 w-full md:w-40 rounded-xl bg-muted/40" />
          </div>
        </div>

        <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
          <div className="p-8 border-b border-border space-y-3">
            <Skeleton className="h-5 w-48 rounded bg-muted/40" />
            <Skeleton className="h-4 w-72 rounded" />
          </div>
          <div className="divide-y divide-border">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="px-8 py-5 flex items-center gap-4">
                <Skeleton className="h-5 w-44 rounded bg-muted/40" />
                <div className="ml-auto flex items-center gap-3">
                  <Skeleton className="h-9 w-20 rounded-xl bg-muted/40" />
                  <Skeleton className="h-9 w-9 rounded-xl bg-muted/40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 pb-24">
      {/* Main Summary Card */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-emerald-600/30 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-emerald-300/10 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-100 font-bold uppercase tracking-wider text-xs">
                <Skeleton className="h-4 w-4 rounded-full bg-white/20" />
                <Skeleton className="h-3 w-32 rounded bg-white/20" />
              </div>
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-10 w-56 rounded-xl bg-white/15" />
                <Skeleton className="h-5 w-24 rounded bg-white/15" />
              </div>
              <Skeleton className="h-4 w-80 rounded bg-white/15" />
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-white/15 backdrop-blur-md p-4 md:p-5 rounded-2xl md:rounded-3xl border border-white/20">
                <Skeleton className="h-2 w-20 rounded bg-white/20 mb-2" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-5 w-5 rounded-full bg-white/20" />
                  <Skeleton className="h-8 w-36 rounded-lg bg-white/15" />
                </div>
              </div>
              <div className="bg-white/15 backdrop-blur-md p-4 md:p-5 rounded-2xl md:rounded-3xl border border-white/20">
                <Skeleton className="h-2 w-20 rounded bg-white/20 mb-2" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-5 w-5 rounded-full bg-white/20" />
                  <Skeleton className="h-8 w-36 rounded-lg bg-white/15" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs de Status (apenas no modo mensal) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-border shadow-sm">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <Skeleton className="h-4 w-20 rounded bg-muted/30" />
              <Skeleton className="h-9 w-9 rounded-xl bg-muted/30" />
            </div>
            <Skeleton className="h-8 w-36 rounded-lg bg-muted/40" />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution (Pie Chart) */}
        <div className="bg-card p-7 rounded-[2.5rem] border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-48 rounded-lg bg-muted/40" />
            <Skeleton className="h-10 w-10 rounded-xl bg-muted/30" />
          </div>
          <div className="h-[320px] w-full">
            <div className="h-full w-full flex items-center justify-center">
              <Skeleton className="h-64 w-64 rounded-full bg-muted/20" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 px-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full">
                <Skeleton className="w-3 h-3 rounded-full bg-muted/40" />
                <Skeleton className="h-3 w-16 rounded bg-muted/30" />
              </div>
            ))}
          </div>
        </div>

        {/* Monthly/Yearly Evolution (Line Chart) */}
        <div className="bg-card p-7 rounded-[2.5rem] border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-48 rounded-lg bg-muted/40" />
            <Skeleton className="h-10 w-10 rounded-xl bg-muted/30" />
          </div>
          <div className="h-[320px] w-full bg-muted/10 rounded-2xl border border-border/50 p-4">
            <div className="h-full w-full flex items-end gap-2">
              {[40, 60, 45, 75, 55, 85, 65, 70, 50, 80, 60, 75].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-end gap-2">
                  <Skeleton
                    className="w-full rounded-t-xl bg-muted/30"
                    style={{ height: `${height * 0.8}%` }}
                  />
                  <Skeleton
                    className="w-full rounded-t-xl bg-muted/40"
                    style={{ height: `${height * 0.6}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart for Comparison */}
      <div className="bg-card p-7 rounded-[2.5rem] border border-border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-48 rounded-lg bg-muted/40" />
        </div>
        <div className="h-[300px] w-full bg-muted/10 rounded-2xl border border-border/50 p-4">
          <div className="h-full w-full flex items-end gap-3">
            {[35, 55, 45, 70, 50, 80, 45, 60, 55, 75, 60, 85].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div className="flex gap-1 w-full">
                  <Skeleton
                    className="flex-1 rounded-t-lg bg-muted/30"
                    style={{ height: `${height * 0.7}px` }}
                  />
                  <Skeleton
                    className="flex-1 rounded-t-lg bg-muted/40"
                    style={{ height: `${height * 0.5}px` }}
                  />
                </div>
                <Skeleton className="h-3 w-6 rounded bg-muted/30" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions (apenas no modo mensal) */}
      <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border flex items-center justify-between">
          <Skeleton className="h-6 w-48 rounded-lg bg-muted/40" />
          <Skeleton className="h-4 w-24 rounded bg-muted/30" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/5 text-left border-b border-border">
                <th className="px-8 py-4">
                  <Skeleton className="h-3 w-16 rounded bg-muted/30" />
                </th>
                <th className="px-8 py-4">
                  <Skeleton className="h-3 w-20 rounded bg-muted/30" />
                </th>
                <th className="px-8 py-4">
                  <Skeleton className="h-3 w-16 rounded bg-muted/30" />
                </th>
                <th className="px-8 py-4">
                  <Skeleton className="h-3 w-24 rounded bg-muted/30" />
                </th>
                <th className="px-8 py-4">
                  <Skeleton className="h-3 w-16 rounded bg-muted/30 ml-auto" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Array.from({ length: 4 }).map((_, row) => (
                <tr key={row}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-xl bg-muted/30" />
                      <Skeleton className="h-5 w-40 rounded bg-muted/40" />
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-2 w-2 rounded-full bg-muted/40" />
                      <Skeleton className="h-4 w-24 rounded bg-muted/30" />
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <Skeleton className="h-8 w-24 rounded-lg bg-muted/30" />
                  </td>
                  <td className="px-8 py-5">
                    <Skeleton className="h-4 w-24 rounded bg-muted/30" />
                  </td>
                  <td className="px-8 py-5">
                    <Skeleton className="ml-auto h-6 w-28 rounded bg-muted/40" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function ShoppingListEditPageSkeleton() {
  return (
    <main className="max-w-7xl mx-auto w-full p-4 md:p-8 space-y-6 pb-24 pt-4 md:pt-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4 flex-1">
          <Skeleton className="h-11 w-11 rounded-2xl bg-muted/40" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-9 w-56 rounded-xl bg-muted/40" />
            <Skeleton className="h-4 w-32 rounded bg-muted/40" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-11 w-40 rounded-2xl bg-muted/40" />
        </div>
      </div>

      <div className="bg-card p-4 rounded-3xl border border-border shadow-sm flex items-center gap-4">
        <div className="flex-1 h-3 bg-muted/20 rounded-full overflow-hidden border border-muted/10">
          <Skeleton className="h-full w-1/2 rounded-full bg-muted/40" />
        </div>
        <Skeleton className="h-5 w-20 rounded bg-muted/40" />
      </div>

      <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <Skeleton className="h-12 flex-1 rounded-xl bg-muted/40" />
          <Skeleton className="h-12 w-full md:w-48 rounded-xl bg-muted/40" />
          <Skeleton className="h-12 w-full md:w-40 rounded-xl bg-muted/40" />
        </div>
      </div>

      <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border flex items-center justify-between">
          <Skeleton className="h-6 w-44 rounded bg-muted/40" />
          <Skeleton className="h-6 w-24 rounded-full bg-muted/40" />
        </div>

        <div className="divide-y divide-border">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="px-8 py-5 flex items-center gap-4">
              <Skeleton className="h-5 w-44 rounded bg-muted/40" />
              <Skeleton className="h-4 w-20 rounded" />
              <div className="ml-auto flex items-center gap-3">
                <Skeleton className="h-9 w-20 rounded-xl bg-muted/40" />
                <Skeleton className="h-9 w-9 rounded-xl bg-muted/40" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/80 backdrop-blur-md border-t border-border flex justify-center z-10">
        <div className="max-w-4xl w-full flex justify-between items-center px-4">
          <div className="flex gap-4">
            <div className="text-center space-y-2">
              <Skeleton className="h-3 w-10 rounded bg-muted/40" />
              <Skeleton className="h-7 w-10 rounded bg-muted/40" />
            </div>
            <div className="text-center space-y-2">
              <Skeleton className="h-3 w-10 rounded bg-muted/40" />
              <Skeleton className="h-7 w-10 rounded bg-muted/40" />
            </div>
          </div>
          <Skeleton className="h-12 w-44 rounded-2xl bg-muted/40" />
        </div>
      </div>
    </main>
  );
}
