import type { ReactNode } from "react";

/**
 * Stage 1: placeholder. Generic surface used as the base for ColumnCard /
 * DoctorCard / treatment cards (white bg, border, radius, hover lift —
 * ported from .treat-card / .column-card in globals.css during stage 3).
 */
export function Card({ children }: { children: ReactNode }) {
  return <div className="card">{children}</div>;
}
