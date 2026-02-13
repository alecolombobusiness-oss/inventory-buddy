import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, trend, trendUp, className }: StatCardProps) {
  return (
    <div className={cn("bg-card rounded-xl border border-border p-5 flex items-start gap-4", className)}>
      <div className="p-2.5 rounded-lg bg-accent/10">
        <Icon size={20} className="text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold tracking-tight mt-0.5">{value}</p>
        {trend && (
          <p className={cn("text-xs mt-1 font-medium", trendUp ? "text-success" : "text-destructive")}>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
