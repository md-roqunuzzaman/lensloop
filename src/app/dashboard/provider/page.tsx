"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Wallet, ClipboardList, Star } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatCard } from "@/components/dashboard/stat-card";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { api, ApiRequestError } from "@/lib/api";
import type { RentalStatus } from "@/types";

type DashboardOrder = {
  id: string;
  gearTitle: string;
  customerName: string;
  startDate: string;
  endDate: string;
  status: RentalStatus;
};

type RevenuePoint = { month: string; revenue: number };

interface ProviderDashboard {
  totalGear?: number;
  gearListed?: number;
  activeRentals?: number;
  totalRevenue?: number;
  revenue30d?: number;
  averageRating?: number;
  avgRating?: number;
  revenueByMonth?: RevenuePoint[];
  monthlyRevenue?: RevenuePoint[];
  recentOrders?: DashboardOrder[];
  orders?: DashboardOrder[];
}

const emptyDashboard: Required<ProviderDashboard> = {
  totalGear: 0,
  gearListed: 0,
  activeRentals: 0,
  totalRevenue: 0,
  revenue30d: 0,
  averageRating: 0,
  avgRating: 0,
  revenueByMonth: [],
  monthlyRevenue: [],
  recentOrders: [],
  orders: [],
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProviderOverviewPage() {
  const [dashboard, setDashboard] = useState<ProviderDashboard>(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    api.get<ProviderDashboard>("/provider/dashboard")
      .then((data) => {
        if (active) setDashboard(data);
      })
      .catch((requestError) => {
        if (!active) return;
        setError(
          requestError instanceof ApiRequestError
            ? requestError.message
            : "Could not load your dashboard."
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const revenue = dashboard.revenue30d ?? dashboard.totalRevenue ?? 0;
  const gearListed = dashboard.gearListed ?? dashboard.totalGear ?? 0;
  const averageRating = dashboard.avgRating ?? dashboard.averageRating ?? 0;
  const chartData = dashboard.revenueByMonth ?? dashboard.monthlyRevenue ?? [];
  const rawOrders: unknown = dashboard.recentOrders ?? dashboard.orders ?? [];
  const orders = Array.isArray(rawOrders)
    ? rawOrders
    : (rawOrders as { orders?: DashboardOrder[]; rentals?: DashboardOrder[] }).orders
      ?? (rawOrders as { rentals?: DashboardOrder[] }).rentals
      ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Provider overview</h1>
        <p className="mt-1 text-sm text-muted">Track your inventory performance and incoming bookings.</p>
      </div>

      {error && <p className="rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Gear listed" value={loading ? "—" : String(gearListed)} icon={Package} />
        <StatCard label="Active rentals" value={loading ? "—" : String(dashboard.activeRentals ?? 0)} icon={ClipboardList} />
        <StatCard label="Revenue (30d)" value={loading ? "—" : formatCurrency(revenue)} icon={Wallet} />
        <StatCard label="Avg. rating" value={loading ? "—" : averageRating.toFixed(1)} icon={Star} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue, last 6 months</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {loading ? (
            <p className="py-24 text-center text-sm text-muted">Loading revenue…</p>
          ) : chartData.length === 0 ? (
            <p className="py-24 text-center text-sm text-muted">No revenue data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted)" fontSize={12} />
                <YAxis stroke="var(--color-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Incoming orders</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/provider/orders">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted">Loading incoming orders…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gear</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 4).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.gearTitle}</TableCell>
                    <TableCell className="text-muted">{order.customerName}</TableCell>
                    <TableCell className="text-muted">{order.startDate} → {order.endDate}</TableCell>
                    <TableCell><OrderStatusBadge status={order.status} /></TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-muted">No incoming orders yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
