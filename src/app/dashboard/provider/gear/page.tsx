"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { api, ApiRequestError } from "@/lib/api";
import { toGearItem, type ApiGear } from "@/lib/gear";
import type { GearAvailability, GearItem } from "@/types";

const availabilityVariant: Record<GearAvailability, "success" | "destructive" | "warning"> = {
  AVAILABLE: "success",
  RENTED: "destructive",
  MAINTENANCE: "warning",
};

export default function ProviderInventoryPage() {
  const [items, setItems] = useState<GearItem[]>([]);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<ApiGear[]>("/provider/gear")
      .then((data) => setItems(data.map(toGearItem)))
      .catch((requestError) => setError(requestError instanceof ApiRequestError ? requestError.message : "Could not load inventory."))
      .finally(() => setLoading(false));
  }, []);

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await api.delete(`/provider/gear/${pendingDelete}`);
      setItems((prev) => prev.filter((g) => g.id !== pendingDelete));
      toast.success("Gear removed from inventory");
      setPendingDelete(null);
    } catch (requestError) {
      toast.error(requestError instanceof ApiRequestError ? requestError.message : "Could not remove gear.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Inventory</h1>
          <p className="mt-1 text-sm text-muted">{items.length} gear items listed.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/provider/gear/new">
            <Plus className="h-4 w-4" /> Add gear
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All listings</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-4 text-sm text-danger">{error}</p>}
          {loading ? (
            <p className="py-8 text-center text-sm text-muted">Loading inventory…</p>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gear</TableHead>
                <TableHead>Price/day</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((g) => (
                <TableRow key={g.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-surface-muted">
                        <Image src={g.images[0]} alt={g.title} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{g.title}</p>
                        <p className="text-xs text-muted">{g.brand}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${g.pricePerDay}</TableCell>
                  <TableCell>{g.stock}</TableCell>
                  <TableCell>
                    <Badge variant={availabilityVariant[g.availability]}>{g.availability}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/provider/gear/${g.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setPendingDelete(g.id)}>
                        <Trash2 className="h-4 w-4 text-danger" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted">
                    No gear listed yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove this gear?</DialogTitle>
            <DialogDescription>
              This will unlist the item immediately. Existing confirmed rentals are not affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
