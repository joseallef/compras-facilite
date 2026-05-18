import { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

export function KpiCard({ title, value, icon: Icon, trend, className, iconClassName }: KpiCardProps) {
  return (
    <div className={cn("bg-card p-5 md:p-6 rounded-[2rem] border border-border shadow-sm space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className={cn("p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400", iconClassName)}>
          <Icon size={20} />
        </div>
        {trend && (
          <div className={cn(
            "text-[10px] font-bold px-2 py-1 rounded-lg",
            trend.isPositive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
          )}>
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] md:text-xs font-bold text-muted/60 uppercase tracking-widest ml-1">{title}</p>
        <h3 className="text-2xl md:text-3xl font-black tracking-tight mt-1 truncate" title={String(value)}>{value}</h3>
      </div>
    </div>
  );
}
