"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { api, ApiRequestError } from "@/lib/api";
import type { RentalStatus } from "@/types";

type AdminRental = { id: string; gearTitle: string; customerName: string; startDate: string; endDate: string; totalAmount: number; status: RentalStatus };

export default function AdminRentalsPage() {
  const [rentalOrders, setRentalOrders] = useState<AdminRental[]>([]);
  useEffect(() => {
    api.get<AdminRental[]>("/admin/rentals")
      .then(setRentalOrders)
      .catch((error) => console.error(error instanceof ApiRequestError ? error.message : error));
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">All rentals</h1>
        <p className="mt-1 text-sm text-muted">Every rental order placed across the platform.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{rentalOrders.length} orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Gear</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentalOrders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.id}</TableCell>
                  <TableCell className="font-medium">{o.gearTitle}</TableCell>
                  <TableCell className="text-muted">{o.customerName}</TableCell>
                  <TableCell className="text-muted">{o.startDate} → {o.endDate}</TableCell>
                  <TableCell>${o.totalAmount}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={o.status} />
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
