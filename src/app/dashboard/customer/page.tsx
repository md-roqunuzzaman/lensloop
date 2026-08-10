"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Wallet, Star, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { rentalOrders, paymentHistory } from "@/lib/content";
import type { RentalStatus } from "@/types";

const tabs: { value: RentalStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PLACED", label: "Placed" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PAID", label: "Paid" },
  { value: "PICKED_UP", label: "Picked up" },
  { value: "RETURNED", label: "Returned" },
];

export default function CustomerOverviewPage() {
  const [tab, setTab] = useState<RentalStatus | "ALL">("ALL");
  const orders = tab === "ALL" ? rentalOrders : rentalOrders.filter((o) => o.status === tab);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">Here&apos;s what&apos;s happening with your rentals.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active rentals" value="2" icon={Package} />
        <StatCard label="Total spent" value="$535" icon={Wallet} trend={{ value: "12% vs last month", positive: true }} />
        <StatCard label="Upcoming pickup" value="Aug 10" icon={Clock} />
        <StatCard label="Reviews left" value="6" icon={Star} />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Rental order history</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/gear">Rent more gear</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={(v) => setTab(v as RentalStatus | "ALL")}>
            <TabsList className="flex-wrap">
              {tabs.map((t) => (
                <TabsTrigger key={t.value} value={t.value}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gear</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.gearTitle}</TableCell>
                    <TableCell className="text-muted">
                      {o.startDate} → {o.endDate}
                    </TableCell>
                    <TableCell>${o.totalAmount}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={o.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {o.status === "CONFIRMED" && <Button size="sm">Pay now</Button>}
                      {o.status === "RETURNED" && <Button size="sm" variant="outline">Leave review</Button>}
                    </TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted">
                      No rentals in this status yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment history</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid on</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.transactionId}</TableCell>
                  <TableCell>{p.method}</TableCell>
                  <TableCell>${p.amount}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={p.status === "COMPLETED" ? "RETURNED" : "PLACED"} />
                  </TableCell>
                  <TableCell className="text-muted">{p.paidAt ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
