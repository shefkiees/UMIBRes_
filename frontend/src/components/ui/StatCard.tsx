import type { AdminStat } from "../../types/admin";

type StatCardProps = {
  stat: AdminStat;
};

export function StatCard({ stat }: StatCardProps) {
  return (
    <article className={`stat-card tone-${stat.tone ?? "neutral"}`}>
      <p>{stat.label}</p>
      <strong>{stat.value}</strong>
      <span>{stat.change ?? "No change reported"}</span>
    </article>
  );
}
