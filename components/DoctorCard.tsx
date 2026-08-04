import Link from "next/link";
import type { Doctor } from "@/lib/types";

/** Stage 1: placeholder. Used on author-filter UI and any doctor roster grid. */
export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Link href={`/doctor/${doctor.slug}`}>
      <span>{doctor.name}</span>
      <span>{doctor.title}</span>
    </Link>
  );
}
