"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { api, ApiRequestError } from "@/lib/api";
import type { Payment } from "@/types";

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get<Payment[]>("/payments")
      .then(setPayments)
      .catch((error) => console.error(error instanceof ApiRequestError ? error.message : error))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Payments</h1>
        <p className="mt-1 text-sm text-muted">Your full payment history across all rentals.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{loading ? "Loading payments…" : `${payments.length} transactions`}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid on</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.transactionId}</TableCell>
                  <TableCell className="text-muted">{p.rentalOrderId}</TableCell>
                  <TableCell>{p.method}</TableCell>
                  <TableCell>${p.amount}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "COMPLETED" ? "success" : "warning"}>{p.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted">{p.paidAt ?? "—"}</TableCell>
                </TableRow>
              ))}
              {!loading && payments.length === 0 && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted">No payments yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
