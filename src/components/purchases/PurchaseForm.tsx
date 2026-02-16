import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type {
  ProductVariantDTO,
  PurchaseRowDTO,
  SupplierDTO,
  CreatePurchaseRequest,
} from "@/api/types";

interface PurchaseItemForm {
  productVariantId: string;
  quantity: string;
  costPrice: string;
}

interface PurchaseFormProps {
  purchase?: PurchaseRowDTO;
  suppliers: SupplierDTO[];
  variants: ProductVariantDTO[];
  onSubmit: (data: CreatePurchaseRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function PurchaseForm({
  purchase,
  suppliers,
  variants,
  onSubmit,
  onCancel,
  isLoading,
}: Readonly<PurchaseFormProps>) {
  const [form, setForm] = useState({
    supplierId: "",
    purchaseType: "SINGLE" as "SINGLE" | "BATCH",
    purchaseDate: new Date().toISOString().slice(0, 16),
    items: [{ productVariantId: "", quantity: "", costPrice: "" }],
  });

  const [errors, setErrors] = useState("");

  useEffect(() => {
    if (!purchase) return;

    const purchaseDateValue = purchase.purchaseDate
      ? (typeof purchase.purchaseDate === "string"
          ? purchase.purchaseDate
          : purchase.purchaseDate.toISOString()
        ).slice(0, 16)
      : new Date().toISOString().slice(0, 16);

    setForm({
      supplierId: purchase.supplier?.supplierId?.toString() || "",
      purchaseType: purchase.purchaseType,
      purchaseDate: purchaseDateValue,
      items: purchase.items?.length
        ? purchase.items.map((i) => ({
            productVariantId:
              (i as any).productVariant?.productVariantId?.toString() ||
              (i as any).productVariantId?.toString() ||
              "",
            quantity: i.quantity.toString(),
            costPrice: i.costPrice.toString(),
          }))
        : [{ productVariantId: "", quantity: "", costPrice: "" }],
    });
  }, [purchase]);

  useEffect(() => {
    if (form.purchaseType === "BATCH") {
      setForm((f) => ({
        ...f,
        items: f.items.map((item) => ({ ...item, quantity: "12" })),
      }));
    }
  }, [form.purchaseType]);

  const addItem = () =>
    setForm((f) => ({
      ...f,
      items: [...f.items, { productVariantId: "", quantity: "", costPrice: "" }],
    }));

  const removeItem = (index: number) =>
    setForm((f) => ({
      ...f,
      items: f.items.filter((_, idx) => idx !== index),
    }));

  const updateItem = (
    index: number,
    field: keyof PurchaseItemForm,
    value: string,
  ) =>
    setForm((f) => ({
      ...f,
      items: f.items.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item,
      ),
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.supplierId) return setErrors("Please select a supplier.");
    if (
      form.items.some((i) => !i.productVariantId || !i.quantity || !i.costPrice)
    )
      return setErrors(
        "Please select valid variants and fill quantity/cost for all items.",
      );

    setErrors("");

    const payload: CreatePurchaseRequest = {
      supplierId: Number(form.supplierId),
      purchaseType: form.purchaseType,
      purchaseDate: new Date(form.purchaseDate).toISOString(),
      items: form.items.map((i) => ({
        productVariantId: Number(i.productVariantId),
        quantity: Number(i.quantity),
        costPrice: Number(i.costPrice),
      })),
    };

    onSubmit(payload);
  };

  const grandTotal = form.items.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0) * Number(item.costPrice || 0),
    0,
  );

  const inputClasses =
    "border rounded-lg px-3 py-2 text-sm transition-all " +
    "bg-white border-stone-300 text-slate-900 " +
    "dark:bg-neutral-700 dark:border-neutral-600 dark:text-white " +
    "focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {errors && (
        <div className="text-sm rounded-lg px-3 py-2 border
          bg-red-50 text-red-600 border-red-200
          dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
          {errors}
        </div>
      )}

      {/* Supplier & Purchase Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1.5 text-slate-700 dark:text-[#E8DDD0]">
            Supplier
          </label>
          <select
            value={form.supplierId}
            onChange={(e) =>
              setForm({ ...form, supplierId: e.target.value })
            }
            className={inputClasses}
          >
            <option value="">Select supplier</option>
            {suppliers.map((s) => (
              <option key={s.supplierId} value={s.supplierId.toString()}>
                {s.supplierName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1.5 text-slate-700 dark:text-[#E8DDD0]">
            Purchase Type
          </label>
          <select
            value={form.purchaseType}
            onChange={(e) =>
              setForm({
                ...form,
                purchaseType: e.target.value as "SINGLE" | "BATCH",
              })
            }
            className={inputClasses}
          >
            <option value="SINGLE">Single</option>
            <option value="BATCH">Batch (12 units)</option>
          </select>
        </div>
      </div>

      {/* Purchase Date */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1.5 text-slate-700 dark:text-[#E8DDD0]">
          Purchase Date
        </label>
        <input
          type="datetime-local"
          value={form.purchaseDate}
          onChange={(e) =>
            setForm({ ...form, purchaseDate: e.target.value })
          }
          className={inputClasses}
        />
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700 dark:text-[#E8DDD0]">
            Items
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addItem}
            className="text-sm
              text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50
              dark:text-[#E8DDD0] dark:hover:text-white dark:hover:bg-[#8B7355]/20"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {form.items.map((item, idx) => {
            const selectedVariant = variants.find(
              (v) =>
                v.productVariantId.toString() === item.productVariantId,
            );

            return (
              <div key={`${item.productVariantId}-${idx}`} className="space-y-2">

                <div className="flex flex-col">
                  <label className="text-xs font-medium mb-1 text-slate-600 dark:text-[#A39180]">
                    Variant
                  </label>
                  <select
                    value={item.productVariantId}
                    onChange={(e) =>
                      updateItem(idx, "productVariantId", e.target.value)
                    }
                    className={inputClasses}
                  >
                    <option value="">Select variant</option>
                    {variants.map((v) => (
                      <option
                        key={v.productVariantId}
                        value={v.productVariantId.toString()}
                      >
                        {v.sku} — {v.color} (Size {v.size})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end gap-2">
                  <div className="flex flex-col flex-1">
                    <label className="text-xs font-medium mb-1 text-slate-600 dark:text-[#A39180]">
                      Qty
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      disabled={form.purchaseType === "BATCH"}
                      onChange={(e) =>
                        updateItem(idx, "quantity", e.target.value)
                      }
                      className={`${inputClasses} disabled:bg-slate-100 dark:disabled:bg-neutral-800 disabled:cursor-not-allowed`}
                    />
                  </div>

                  <div className="flex flex-col flex-1">
                    <label className="text-xs font-medium mb-1 text-slate-600 dark:text-[#A39180]">
                      Cost (£)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.costPrice}
                      onChange={(e) =>
                        updateItem(idx, "costPrice", e.target.value)
                      }
                      className={inputClasses}
                    />
                  </div>

                  {form.items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(idx)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {selectedVariant && (
                  <div className="text-xs px-3 py-2 rounded-lg border
                    bg-slate-50 border-slate-200 text-slate-600
                    dark:bg-neutral-700 dark:border-neutral-600 dark:text-[#A39180]">
                    {selectedVariant.sku} — {selectedVariant.color} (Size{" "}
                    {selectedVariant.size})
                  </div>
                )}

                {idx < form.items.length - 1 && (
                  <div className="border-t border-slate-200 dark:border-neutral-700 pt-2" />
                )}
              </div>
            );
          })}
        </div>

        {/* Grand Total */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-neutral-700">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-700 dark:text-[#E8DDD0]">
              Grand Total
            </span>
            <span className="text-lg font-semibold text-green-600 dark:text-green-400">
              £{grandTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-neutral-700">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="px-6
            text-slate-600 hover:text-slate-900 hover:bg-slate-100
            dark:text-[#A39180] dark:hover:text-white dark:hover:bg-neutral-700"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isLoading}
          className="px-6 bg-[#8B7355] hover:bg-[#7A6854] text-white"
        >
          {purchase ? "Update Purchase" : "Create Purchase"}
        </Button>
      </div>
    </form>
  );
}
