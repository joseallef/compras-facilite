"use client";

import { cn } from "@/utils/cn";
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
    <main className="max-w-7xl mx-auto w-full p-4 md:p-8">
      <div className="space-y-6">
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
      </div>
    </main>
  );
}

export function ShoppingListEditPageSkeleton() {
  return (
    <main className="max-w-7xl mx-auto w-full p-4 md:p-8">
      <div className="space-y-6 pb-24">
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
      </div>
    </main>
  );
}
