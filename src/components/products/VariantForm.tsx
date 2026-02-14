import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import type { ProductVariantDTO, RequestProductVariantDTO } from "@/api/types";

interface VariantFormProps {
  variant: ProductVariantDTO | null;
  productId: number | null;
  onSubmit: (data: RequestProductVariantDTO) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function VariantForm({
  variant,
  onSubmit,
  onCancel,
  isLoading = false,
}: Readonly<VariantFormProps>) {
  const [form, setForm] = useState({
    color: "",
    size: "",
    quantity: "",
    salePrice: "",
  });

  useEffect(() => {
    if (variant) {
      setForm({
        color: variant.color || "",
        size: String(variant.size) || "",
        quantity: String(variant.quantity) || "",
        salePrice: String(variant.salePrice) || "",
      });
    }
  }, [variant]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const payload: RequestProductVariantDTO = {
      color: form.color,
      size: Number(form.size),
      quantity: Number(form.quantity),
      salePrice: Number(form.salePrice),
    };
    
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Color */}
      <div className="flex flex-col">
        <label htmlFor="color" className="text-sm font-medium text-slate-700 mb-1.5">
          Color
        </label>
        <input
          id="color"
          type="text"
          value={form.color}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
          placeholder="e.g. Black, Navy Blue"
          required
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Size */}
      <div className="flex flex-col">
        <label htmlFor="size" className="text-sm font-medium text-slate-700 mb-1.5">
          Size
        </label>
        <input
          id="size"
          type="number"
          value={form.size}
          onChange={(e) => setForm({ ...form, size: e.target.value })}
          placeholder="e.g. 38, 42, 46"
          required
          min={1}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Quantity */}
      <div className="flex flex-col">
        <label htmlFor="quantity" className="text-sm font-medium text-slate-700 mb-1.5">
          Quantity
        </label>
        <input
          id="quantity"
          type="number"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          placeholder="Stock quantity"
          required
          min={0}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Sale Price */}
      <div className="flex flex-col">
        <label htmlFor="salePrice" className="text-sm font-medium text-slate-700 mb-1.5">
          Sale Price (£)
        </label>
        <input
          id="salePrice"
          type="number"
          step="0.01"
          value={form.salePrice}
          onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
          placeholder="0.00"
          required
          min={0}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="px-6 border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="px-6 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {variant ? "Update Variant" : "Create Variant"}
        </Button>
      </div>
    </form>
  );
}