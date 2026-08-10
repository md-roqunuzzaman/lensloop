"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, ApiRequestError } from "@/lib/api";
import { toGearItem, type ApiGear } from "@/lib/gear";
import type { GearAvailability, GearItem } from "@/types";

const variant: Record<GearAvailability, "success" | "destructive" | "warning"> = {
  AVAILABLE: "success",
  RENTED: "destructive",
  MAINTENANCE: "warning",
};

export default function AdminGearPage() {
  const [gearItems, setGearItems] = useState<GearItem[]>([]);
  useEffect(() => {
    api.get<ApiGear[]>("/admin/gear")
      .then((data) => setGearItems(data.map(toGearItem)))
      .catch((error) => console.error(error instanceof ApiRequestError ? error.message : error));
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Manage gear</h1>
        <p className="mt-1 text-sm text-muted">All listings across every provider on the platform.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{gearItems.length} listings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gear</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price/day</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gearItems.map((g) => (
                <TableRow key={g.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-surface-muted">
                        <Image src={g.images[0]} alt={g.title} fill className="object-cover" />
                      </div>
                      <p className="font-medium">{g.title}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted">{g.provider?.name}</TableCell>
                  <TableCell className="text-muted">{g.category?.name}</TableCell>
                  <TableCell>${g.pricePerDay}</TableCell>
                  <TableCell>
                    <Badge variant={variant[g.availability]}>{g.availability}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
