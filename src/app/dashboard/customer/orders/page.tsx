"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { api, ApiRequestError } from "@/lib/api";
import { toast } from "sonner";
import type { RentalStatus } from "@/types";

type CustomerOrder = { id: string; gearTitle: string; startDate: string; endDate: string; totalAmount: number; status: RentalStatus };

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get<CustomerOrder[]>("/rentals")
      .then(setOrders)
      .catch((error) => toast.error(error instanceof ApiRequestError ? error.message : "Could not load rental orders."))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">My rentals</h1>
        <p className="mt-1 text-sm text-muted">Every rental you&apos;ve booked, past and present.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{loading ? "Loading orders…" : `${orders.length} orders`}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Gear</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.id}</TableCell>
                  <TableCell className="font-medium">{o.gearTitle}</TableCell>
                  <TableCell className="text-muted">{o.startDate} → {o.endDate}</TableCell>
                  <TableCell>${o.totalAmount}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={o.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {o.status === "CONFIRMED" && (
                      <Button size="sm" asChild>
                        <Link href={`/dashboard/customer/orders/${o.id}/pay`}>Pay now</Link>
                      </Button>
                    )}
                    {o.status === "RETURNED" && (
                      <Button size="sm" variant="outline">Leave review</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!loading && orders.length === 0 && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted">No rental orders yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
