import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProductVariantDTO, RequestProductVariantDTO } from "@/api/types";

interface VariantFormProps {
  variant?: ProductVariantDTO | null;
  productId?: number | null;
  productName?: string; // optional, for SKU preview
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (variant) {
      setForm({
        color: variant.color ?? "",
        size: variant.size ?? "",
        quantity: variant.quantity ?? "",
        salePrice: variant.salePrice ?? "",
      });
    }
  }, [variant]);

  const skuPreview =
    productName && form.color && form.size !== ""
      ? `${productName.slice(0, 3).toUpperCase()}-${form.color
          .slice(0, 3)
          .toUpperCase()}-${form.size}`
      : "";

  const handleNumberChange = (
    field: "size" | "quantity" | "salePrice",
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value === "" ? "" : Number(value),
    }));
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!form.color.trim()) newErrors.color = "Color is required";
    if (form.size === "" || form.size <= 0)
      newErrors.size = "Size must be greater than 0";
    if (form.quantity === "" || form.quantity < 0)
      newErrors.quantity = "Quantity must be 0 or more";
    if (form.salePrice === "" || form.salePrice <= 0)
      newErrors.salePrice = "Sale price must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    if (!validate()) return;

    const payload: RequestProductVariantDTO = {
      productId,
      color: form.color.trim(),
      size: Number(form.size),
      quantity: Number(form.quantity),
      salePrice: Number(form.salePrice),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          value={form.color}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
          placeholder="e.g. Black"
          required
        />
        {errors.color && <p className="text-xs text-red-500">{errors.color}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="size">Size</Label>
        <Input
          id="size"
          type="number"
          value={form.size}
          onChange={(e) => handleNumberChange("size", e.target.value)}
          placeholder="e.g. 42"
          required
        />
        {errors.size && <p className="text-xs text-red-500">{errors.size}</p>}
      </div>

      {variant?.sku && (
        <div className="space-y-1">
          <Label>SKU</Label>
          <Input
            value={variant.sku}
            readOnly
            disabled
            className="font-mono bg-slate-100 text-slate-600"
          />
        </div>
      )}

      {skuPreview && (
        <div className="space-y-1">
          <Label>SKU (preview)</Label>
          <div className="rounded-md border bg-slate-50 px-3 py-2 text-sm font-mono text-slate-600">
            {skuPreview}
          </div>
        </div>
      )}

      <div className="space-y-1">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          value={form.quantity}
          onChange={(e) => handleNumberChange("quantity", e.target.value)}
          placeholder="e.g. 20"
          required
        />
        {errors.quantity && (
          <p className="text-xs text-red-500">{errors.quantity}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="salePrice">Sale Price</Label>
        <Input
          id="salePrice"
          type="number"
          value={form.salePrice}
          onChange={(e) => handleNumberChange("salePrice", e.target.value)}
          placeholder="e.g. 29"
          required
        />
        {errors.salePrice && (
          <p className="text-xs text-red-500">{errors.salePrice}</p>
        )}
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
