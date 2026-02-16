import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/ThemeContext";
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
  const { darkMode } = useTheme();
  
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
        <label htmlFor="color" className={`text-sm font-medium mb-1.5 ${
          darkMode ? 'text-[#E8DDD0]' : 'text-slate-700'
        }`}>
          Color
        </label>
        <input
          id="color"
          type="text"
          value={form.color}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
          placeholder="e.g. Black, Navy Blue"
          required
          className={`border rounded-lg px-3 py-2 text-sm transition-all ${
            darkMode 
              ? 'bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400' 
              : 'bg-white border-stone-300 text-slate-900 placeholder-slate-400'
          } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
        />
      </div>

      {/* Size */}
      <div className="flex flex-col">
        <label htmlFor="size" className={`text-sm font-medium mb-1.5 ${
          darkMode ? 'text-[#E8DDD0]' : 'text-slate-700'
        }`}>
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
          className={`border rounded-lg px-3 py-2 text-sm transition-all ${
            darkMode 
              ? 'bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400' 
              : 'bg-white border-stone-300 text-slate-900 placeholder-slate-400'
          } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
        />
      </div>

      {/* Quantity */}
      <div className="flex flex-col">
        <label htmlFor="quantity" className={`text-sm font-medium mb-1.5 ${
          darkMode ? 'text-[#E8DDD0]' : 'text-slate-700'
        }`}>
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
          className={`border rounded-lg px-3 py-2 text-sm transition-all ${
            darkMode 
              ? 'bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400' 
              : 'bg-white border-stone-300 text-slate-900 placeholder-slate-400'
          } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
        />
      </div>

      {/* Sale Price */}
      <div className="flex flex-col">
        <label htmlFor="salePrice" className={`text-sm font-medium mb-1.5 ${
          darkMode ? 'text-[#E8DDD0]' : 'text-slate-700'
        }`}>
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
          className={`border rounded-lg px-3 py-2 text-sm transition-all ${
            darkMode 
              ? 'bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400' 
              : 'bg-white border-stone-300 text-slate-900 placeholder-slate-400'
          } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
        />
      </div>

      {/* Action Buttons */}
      <div className={`flex justify-end gap-3 pt-4 border-t ${
        darkMode ? 'border-neutral-700' : 'border-slate-200'
      }`}>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className={darkMode 
            ? 'text-[#A39180] hover:text-white hover:bg-neutral-700' 
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#8B7355] hover:bg-[#7A6854] text-white disabled:opacity-50"
        >
          {variant ? "Update Variant" : "Create Variant"}
        </Button>
      </div>
    </form>
  );
}