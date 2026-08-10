"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { gearFormSchema, type GearFormInput } from "@/lib/validations";
import { api, ApiRequestError } from "@/lib/api";
import type { GearItem, Category } from "@/types";

export function GearForm({ initialGear }: { initialGear?: GearItem }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GearFormInput>({
    resolver: zodResolver(gearFormSchema),
    defaultValues: initialGear
      ? {
          title: initialGear.title,
          brand: initialGear.brand,
          categoryId: initialGear.categoryId,
          description: initialGear.description,
          pricePerDay: initialGear.pricePerDay,
          stock: initialGear.stock,
          images: initialGear.images,
          specs: Object.entries(initialGear.specs).map(([key, value]) => ({ key, value })),
        }
      : { images: [""], specs: [{ key: "", value: "" }], pricePerDay: 0, stock: 1 },
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({ control, name: "specs" });
  const images = watch("images") ?? [];

  useEffect(() => {
    api.get<Category[]>("/categories", { auth: false })
      .then(setCategories)
      .catch(() => setCategoryError("Categories could not be loaded."));
  }, []);

  async function onSubmit(data: GearFormInput) {
    const payload = {
      name: data.title,
      brand: data.brand,
      categoryId: data.categoryId,
      description: data.description,
      images: data.images,
      pricePerDay: data.pricePerDay,
      stock: data.stock,
      specifications: Object.fromEntries(data.specs.map(({ key, value }) => [key, value])),
    };
    try {
      if (initialGear) {
        await api.put(`/provider/gear/${initialGear.id}`, payload);
      } else {
        await api.post("/provider/gear", payload);
      }
      toast.success(initialGear ? "Gear updated" : "Gear added to your inventory");
      router.push("/dashboard/provider/gear");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiRequestError ? error.message : "Could not save gear. Try again.");
    }
  }

  function updateImage(index: number, value: string) {
    const next = [...images];
    next[index] = value;
    setValue("images", next);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Sony A7S III Mirrorless Body" {...register("title")} />
              {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" placeholder="Sony" {...register("brand")} />
              {errors.brand && <p className="text-xs text-danger">{errors.brand.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="categoryId">Category</Label>
            <Select
              defaultValue={initialGear?.categoryId}
              onValueChange={(v) => setValue("categoryId", v, { shouldValidate: true })}
            >
              <SelectTrigger id="categoryId">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-xs text-danger">{errors.categoryId.message}</p>}
            {categoryError && <p className="text-xs text-danger">{categoryError}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} placeholder="Describe condition, what's included, and ideal use case…" {...register("description")} />
            {errors.description && <p className="text-xs text-danger">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pricePerDay">Price per day ($)</Label>
              <Input id="pricePerDay" type="number" step="0.01" {...register("pricePerDay")} />
              {errors.pricePerDay && <p className="text-xs text-danger">{errors.pricePerDay.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stock">Stock / units available</Label>
              <Input id="stock" type="number" {...register("stock")} />
              {errors.stock && <p className="text-xs text-danger">{errors.stock.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <Label>Image URLs</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => setValue("images", [...images, ""])}>
              <Plus className="h-3.5 w-3.5" /> Add image
            </Button>
          </div>
          {images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="https://…"
                value={img}
                onChange={(e) => updateImage(i, e.target.value)}
              />
              {images.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setValue("images", images.filter((_, idx) => idx !== i))}
                >
                  <Trash2 className="h-4 w-4 text-danger" />
                </Button>
              )}
            </div>
          ))}
          {errors.images && <p className="text-xs text-danger">{errors.images.message as string}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <Label>Specifications</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => appendSpec({ key: "", value: "" })}>
              <Plus className="h-3.5 w-3.5" /> Add spec
            </Button>
          </div>
          {specFields.map((field, i) => (
            <div key={field.id} className="flex gap-2">
              <Input placeholder="Spec name (e.g. aperture)" {...register(`specs.${i}.key`)} />
              <Input placeholder="Value (e.g. f/2.8)" {...register(`specs.${i}.value`)} />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeSpec(i)}>
                <Trash2 className="h-4 w-4 text-danger" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {initialGear ? "Save changes" : "Add gear"}
        </Button>
      </div>
    </form>
  );
}
