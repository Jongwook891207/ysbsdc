"use client";

import type { ReactNode } from "react";
import { useTreatmentModal } from "./TreatmentModal";

/** Ports the `#ktModalBtn` / `#kdModalBtn` / `#kcModalBtn` buttons — each opens the shared modal at a fixed TREATMENTS index. */
export function ModalTriggerButton({
  index,
  className,
  children,
}: {
  index: number;
  className: string;
  children: ReactNode;
}) {
  const { open } = useTreatmentModal();
  return (
    <button type="button" className={className} onClick={() => open(index)}>
      {children}
    </button>
  );
}
