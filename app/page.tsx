import { Suspense } from "react";
import { CockpitShell } from "@/components/cockpit/CockpitShell";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CockpitShell />
    </Suspense>
  );
}
