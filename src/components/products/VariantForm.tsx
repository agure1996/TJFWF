import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProductVariantDTO, RequestProductVariantDTO } from "@/api/types";

interface VariantFormProps {
  variant?: ProductVariantDTO | null;
  productId?: number | null;
  productName?: string; //optional, used for display purposes
  onSubmit: (data: RequestProductVariantDTO) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function VariantForm({
  variant,
  productId,
  productName,
  onSubmit,
  onCancel,
  isLoading = false,
}: Readonly<VariantFormProps>) {
  const [form, setForm] = useState<{
    color: string;
    size: number | "";
    quantity: number | "";
    salePrice: number | "";
  }>({
    color: "",
    size: "",
    quantity: "",
    salePrice: "",
  });

  useEffect(() => {
    if (variant) {
      setForm({
        color: variant.color ?? "",
        size: typeof variant.size === "number" ? variant.size : "",
        quantity: typeof variant.quantity === "number" ? variant.quantity : "",
        salePrice:
          typeof variant.salePrice === "number" ? variant.salePrice : "",
      });
    }
  }, [variant]);

  const skuPreview =
    productName && form.color && form.size !== ""
      ? `${productName.slice(0, 3).toUpperCase()}-${form.color
          .slice(0, 3)
          .toUpperCase()}-${form.size}`
      : "";

  // Generic handler for number inputs
  const handleNumberChange = (
    field: "size" | "quantity" | "salePrice",
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value === "" ? "" : Number(value),
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    // Prepare payload for backend
    const payload: RequestProductVariantDTO = {
      color: form.color,
      size: typeof form.size === "number" ? form.size : 0,
      quantity: typeof form.quantity === "number" ? form.quantity : 0,
      salePrice: typeof form.salePrice === "number" ? form.salePrice : 0,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          value={form.color}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
          placeholder="e.g. Black"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="size">Size</Label>
        <Input
          id="size"
          type="number"
          value={form.size}
          onChange={(e) => handleNumberChange("size", e.target.value)}
          placeholder="e.g. 42"
          required
        />
      </div>

      {skuPreview && (
        <div className="space-y-1">
          <Label>SKU (preview)</Label>
          <div className="rounded-md border bg-slate-50 px-3 py-2 text-sm font-mono text-slate-600">
            {skuPreview}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          value={form.quantity}
          onChange={(e) => handleNumberChange("quantity", e.target.value)}
          placeholder="e.g. 20"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="salePrice">Sale Price</Label>
        <Input
          id="salePrice"
          type="number"
          value={form.salePrice}
          onChange={(e) => handleNumberChange("salePrice", e.target.value)}
          placeholder="e.g. 29"
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {variant ? "Update" : "Create"} Variant
        </Button>
      </div>
    </form>
  );
}
