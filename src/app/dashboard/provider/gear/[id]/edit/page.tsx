"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GearForm } from "@/components/gear/gear-form";
import { api, ApiRequestError } from "@/lib/api";
import { toGearItem, type ApiGear } from "@/lib/gear";
import type { GearItem } from "@/types";

export default function EditGearPage() {
  const { id } = useParams<{ id: string }>();
  const [gear, setGear] = useState<GearItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<ApiGear[]>("/provider/gear")
      .then((items) => {
        const found = items.map(toGearItem).find((item) => item.id === id);
        if (!found) setError("Gear item not found.");
        else setGear(found);
      })
      .catch((requestError) => setError(requestError instanceof ApiRequestError ? requestError.message : "Could not load gear."));
  }, [id]);

  if (error) return <p className="text-sm text-danger">{error}</p>;
  if (!gear) return <p className="text-sm text-muted">Loading gear…</p>;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Edit gear</h1>
        <p className="mt-1 text-sm text-muted">Update your listing details and availability.</p>
      </div>
      <GearForm initialGear={gear} />
    </div>
  );
}
