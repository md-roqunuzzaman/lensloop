"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GearCard } from "@/components/gear/gear-card";
import { api } from "@/lib/api";
import { toGearItem, type ApiGear } from "@/lib/gear";
import type { Category, GearItem } from "@/types";

const PAGE_SIZE = 6;
type SortKey = "recommended" | "price-asc" | "price-desc" | "rating";

export default function GearListingPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<GearItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("recommended");
  const [page, setPage] = useState(1);

  useEffect(() => {
    Promise.all([
      api.get<ApiGear[]>("/gear?limit=100", { auth: false }),
      api.get<Category[]>("/categories", { auth: false }),
    ]).then(([gear, categoryData]) => {
      setItems(gear.map(toGearItem));
      setCategories(categoryData);
    }).finally(() => setLoading(false));
  }, []);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }
  function handleCategoryChange(value: string) {
    setCategory(value);
    setPage(1);
  }
  function handlePriceChange(value: string) {
    setPriceRange(value);
    setPage(1);
  }
  function handleSortChange(value: SortKey) {
    setSort(value);
    setPage(1);
  }

  const filtered = useMemo(() => {
    let result = items.filter((g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.brand.toLowerCase().includes(search.toLowerCase())
    );

    if (category !== "all") {
      result = result.filter((g) => g.category?.slug === category);
    }

    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      result = result.filter((g) => g.pricePerDay >= min && (max ? g.pricePerDay <= max : true));
    }

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
    }
    return result;
  }, [items, search, category, priceRange, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">Browse gear</h1>
          <p className="mt-1 text-sm text-muted">{filtered.length} listings match your filters.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              placeholder="Search by gear name or brand…"
              className="pl-9"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-label="Search gear"
            />
          </div>

          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={handlePriceChange}>
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Price range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any price</SelectItem>
              <SelectItem value="0-30">Under $30/day</SelectItem>
              <SelectItem value="30-60">$30–$60/day</SelectItem>
              <SelectItem value="60-1000">$60+/day</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(v) => handleSortChange(v as SortKey)}>
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))
            : paged.map((gear) => <GearCard key={gear.id} gear={gear} />)}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="mt-16 text-center text-muted">
            No gear matches those filters yet — try widening your search.
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="px-2 text-sm text-muted">
              Page {page} of {totalPages}
            </span>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
