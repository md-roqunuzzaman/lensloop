"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";

import { CreditCard, Loader2, ShieldCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { api, ApiRequestError } from "@/lib/api";

import { toast } from "sonner";

import type { RentalStatus } from "@/types";

type CustomerOrder = {
  id: string;
  gearTitle: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: RentalStatus;
};

type PaymentMethod = "stripe" | "sslcommerz" | null;

type PaymentResponse = {
  payment: {
    id: string;
    transactionId: string;
    status: string;
    amount: number;
  };

  redirectUrl: string | null;

  sessionId: string;
};

export default function PayOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [order, setOrder] = useState<CustomerOrder | null>(null);

  const [loadingOrder, setLoadingOrder] = useState(true);

  const [loadError, setLoadError] = useState(false);

  const [method, setMethod] = useState<PaymentMethod>(null);

  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOAD RENTAL ORDER
  // =====================================================

  useEffect(() => {
    let mounted = true;

    api
      .get<CustomerOrder[]>("/rentals")
      .then((orders) => {
        if (!mounted) return;

        const foundOrder = orders.find((item) => item.id === id) ?? null;

        setOrder(foundOrder);
      })
      .catch((error) => {
        if (!mounted) return;

        setLoadError(true);

        toast.error(
          error instanceof ApiRequestError
            ? error.message
            : "Could not load this rental order.",
        );
      })
      .finally(() => {
        if (!mounted) return;

        setLoadingOrder(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  // =====================================================
  // START PAYMENT
  // =====================================================

  async function pay() {
    if (!order) {
      return;
    }

    if (!method) {
      toast.error("Please select a payment method.");

      return;
    }

    try {
      setLoading(true);

      // -------------------------------------------------
      // Create payment session on backend
      // -------------------------------------------------

      const result = await api.post<PaymentResponse>("/payment/create", {
        rentalOrderId: order.id,

        method: method === "stripe" ? "STRIPE" : "SSLCOMMERZ",
      });

      // -------------------------------------------------
      // Backend must return redirectUrl
      // -------------------------------------------------

      if (!result.redirectUrl) {
        throw new Error("Payment redirect URL was not returned.");
      }

      /*
       * IMPORTANT:
       *
       * Do NOT redirect directly to:
       *
       * /payment/success
       *
       * The user must first complete payment
       * on the payment gateway.
       *
       * For Stripe this URL will be something like:
       *
       * https://checkout.stripe.com/...
       */

      window.location.href = result.redirectUrl;
    } catch (error) {
      console.error("Payment creation error:", error);

      toast.error(
        error instanceof ApiRequestError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Failed to create payment session.",
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (loadError) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold">
              Unable to load this rental order
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loadingOrder) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading payment details...
        </div>
      </div>
    );
  }

  // =====================================================
  // ORDER NOT FOUND
  // =====================================================

  if (!order) {
    notFound();
  }

  // =====================================================
  // PAYMENT PAGE
  // =====================================================

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <Card>
        {/* ================================================
            HEADER
        ================================================= */}

        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>

            <div>
              <CardTitle>Complete your payment</CardTitle>

              <CardDescription>
                Choose your preferred payment method to complete this rental.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* ==============================================
              ORDER SUMMARY
          =============================================== */}

          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{order.gearTitle}</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {order.startDate} → {order.endDate}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-sm text-muted-foreground">Total due</p>

                <p className="text-xl font-bold">
                  ${Number(order.totalAmount).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* ==============================================
              PAYMENT METHODS
          =============================================== */}

          <div className="space-y-3">
            <p className="text-sm font-medium">Select payment method</p>

            {/* Stripe */}

            <button
              type="button"
              onClick={() => setMethod("stripe")}
              disabled={loading}
              className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                method === "stripe"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-background">
                <CreditCard className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className="font-medium">Pay with Stripe</p>

                <p className="text-sm text-muted-foreground">
                  International cards
                </p>
              </div>

              <div
                className={`h-4 w-4 rounded-full border-2 ${
                  method === "stripe"
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                }`}
              />
            </button>

            {/* SSLCommerz */}

            <button
              type="button"
              onClick={() => setMethod("sslcommerz")}
              disabled={loading}
              className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                method === "sslcommerz"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-background">
                <CreditCard className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className="font-medium">Pay with SSLCommerz</p>

                <p className="text-sm text-muted-foreground">
                  bKash, Nagad, cards
                </p>
              </div>

              <div
                className={`h-4 w-4 rounded-full border-2 ${
                  method === "sslcommerz"
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                }`}
              />
            </button>
          </div>

          <Separator />

          {/* ==============================================
              SECURITY NOTICE
          =============================================== */}

          <div className="flex items-start gap-3 rounded-lg bg-muted/40 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <div>
              <p className="text-sm font-medium">Secure payment</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Your payment is processed securely through the selected payment
                gateway. We do not store your card details.
              </p>
            </div>
          </div>

          {/* ==============================================
              PAY BUTTON
          =============================================== */}

          <Button
            type="button"
            onClick={pay}
            disabled={!method || loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating payment session...
              </>
            ) : (
              <>Pay ${Number(order.totalAmount).toFixed(2)}</>
            )}
          </Button>

          {!method && (
            <p className="text-center text-xs text-muted-foreground">
              Please select a payment method to continue.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
