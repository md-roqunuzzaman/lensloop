"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { api, ApiRequestError } from "@/lib/api";
import type { RentalStatus } from "@/types";

const nextAction: Partial<Record<RentalStatus, { label: string; next: RentalStatus }>> = {
  PLACED: { label: "Confirm", next: "CONFIRMED" },
  PAID: { label: "Mark picked up", next: "PICKED_UP" },
  PICKED_UP: { label: "Mark returned", next: "RETURNED" },
};

interface ProviderOrder {
  id: string;
  gearTitle: string;
  customerName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: RentalStatus;
}

interface ApiProviderOrder extends Omit<ProviderOrder, "gearTitle" | "customerName"> {
  gearTitle?: string;
  customerName?: string;
  customer?: { name?: string };
  user?: { name?: string };
  items?: { gear?: { title?: string } }[];
}

function toProviderOrder(order: ApiProviderOrder): ProviderOrder {
  return {
    ...order,
    gearTitle: order.gearTitle ?? order.items?.map((item) => item.gear?.title).filter(Boolean).join(", ") ?? "Gear item",
    customerName: order.customerName ?? order.customer?.name ?? order.user?.name ?? "Customer",
  };
}

function getOrders(payload: ApiProviderOrder[] | { orders?: ApiProviderOrder[]; rentals?: ApiProviderOrder[] }) {
  return Array.isArray(payload) ? payload : payload.orders ?? payload.rentals ?? [];
}

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<ProviderOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<ApiProviderOrder[] | { orders?: ApiProviderOrder[]; rentals?: ApiProviderOrder[] }>("/provider/orders")
      .then((data) => setOrders(getOrders(data).map(toProviderOrder)))
      .catch((error) => toast.error(error instanceof ApiRequestError ? error.message : "Could not load orders."))
      .finally(() => setLoading(false));
  }, []);

  async function advance(id: string) {
    const order = orders.find((item) => item.id === id);
    const action = order && nextAction[order.status];
    if (!action) return;
    try {
      await api.patch(`/provider/orders/${id}`, { status: action.next });
      setOrders((prev) => prev.map((item) => item.id === id ? { ...item, status: action.next } : item));
      toast.success("Order updated");
    } catch (error) {
      toast.error(error instanceof ApiRequestError ? error.message : "Could not update order.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Incoming orders</h1>
        <p className="mt-1 text-sm text-muted">Confirm bookings and update status as gear moves.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p className="py-8 text-center text-sm text-muted">Loading orders…</p> :
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Gear</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => {
                const action = nextAction[o.status];
                return (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.id}</TableCell>
                    <TableCell className="font-medium">{o.gearTitle}</TableCell>
                    <TableCell className="text-muted">{o.customerName}</TableCell>
                    <TableCell className="text-muted">{o.startDate} → {o.endDate}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={o.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {action ? (
                        <Button size="sm" onClick={() => advance(o.id)}>
                          {action.label}
                        </Button>
                      ) : (
                        <span className="text-xs text-muted">No action</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {orders.length === 0 && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted">No incoming orders yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
          }
        </CardContent>
      </Card>
    </div>
  );
}
