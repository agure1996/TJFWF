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
  const [form, setForm] = useState<{
    supplierId: string;
    purchaseType: "SINGLE" | "BATCH";
    purchaseDate: string;
    items: PurchaseItemForm[];
  }>({
    supplierId: "",
    purchaseType: "SINGLE",
    purchaseDate: new Date().toISOString().slice(0, 16),
    items: [{ productVariantId: "", quantity: "", costPrice: "" }],
  });

  const [errors, setErrors] = useState<string>("");

  // Populate form when editing
  useEffect(() => {
    if (!purchase) return;

    const purchaseDateValue = purchase.purchaseDate 
      ? (typeof purchase.purchaseDate === 'string' 
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
            productVariantId: (i as any).productVariant?.productVariantId?.toString() || 
                              (i as any).productVariantId?.toString() || "",
            quantity: i.quantity.toString(),
            costPrice: i.costPrice.toString(),
          }))
        : [{ productVariantId: "", quantity: "", costPrice: "" }],
    });
  }, [purchase]);

  // Auto-set batch quantity
  useEffect(() => {
    if (form.purchaseType === "BATCH") {
      setForm((f) => ({
        ...f,
        items: f.items.map((item) => ({ ...item, quantity: "12" })),
      }));
    }
  }, [form.purchaseType]);

  // Item handlers
  const addItem = () =>
    setForm((f) => ({
      ...f,
      items: [
        ...f.items,
        { productVariantId: "", quantity: "", costPrice: "" },
      ],
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

  // Handle submit
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
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.costPrice || 0),
    0,
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {errors}
        </div>
      )}

      {/* Supplier & Purchase Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="supplier" className="text-sm font-medium text-slate-700 mb-1.5">
            Supplier
          </label>
          <select
            id="supplier"
            value={form.supplierId}
            onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
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
          <label htmlFor="purchaseType" className="text-sm font-medium text-slate-700 mb-1.5">
            Purchase Type
          </label>
          <select
            id="purchaseType"
            value={form.purchaseType}
            onChange={(e) =>
              setForm({ ...form, purchaseType: e.target.value as "SINGLE" | "BATCH" })
            }
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
          >
            <option value="SINGLE">Single</option>
            <option value="BATCH">Batch (12 units)</option>
          </select>
        </div>
      </div>

      {/* Purchase Date */}
      <div className="flex flex-col">
        <label htmlFor="purchaseDate" className="text-sm font-medium text-slate-700 mb-1.5">
          Purchase Date
        </label>
        <input
          id="purchaseDate"
          type="datetime-local"
          value={form.purchaseDate}
          onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Items Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">Items</label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addItem}
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 text-sm"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {form.items.map((item, idx) => (
            <div key={`${item.productVariantId}-${idx}`} className="space-y-2">
              {/* Product Variant */}
              <div className="flex flex-col">
                <label htmlFor={`item-${idx}-variant`} className="text-xs font-medium text-slate-600 mb-1">
                  Variant
                </label>
                <select
                  id={`item-${idx}-variant`}
                  value={item.productVariantId}
                  onChange={(e) => updateItem(idx, "productVariantId", e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">Select variant</option>
                  {variants.map((v) => (
                    <option key={v.productVariantId} value={v.productVariantId.toString()}>
                      {v.sku} — {v.color} (Size {v.size})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity and Cost Price */}
              <div className="flex items-end gap-2">
                <div className="flex flex-col flex-1">
                  <label htmlFor={`item-${idx}-quantity`} className="text-xs font-medium text-slate-600 mb-1">
                    Qty
                  </label>
                  <input
                    id={`item-${idx}-quantity`}
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                    disabled={form.purchaseType === "BATCH"}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="flex flex-col flex-1">
                  <label htmlFor={`item-${idx}-cost`} className="text-xs font-medium text-slate-600 mb-1">
                    Cost (£)
                  </label>
                  <input
                    id={`item-${idx}-cost`}
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.costPrice}
                    onChange={(e) => updateItem(idx, "costPrice", e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                {form.items.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(idx)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 mb-0.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Show selected variant details */}
              {item.productVariantId && (() => {
                const selectedVariant = variants.find(
                  v => v.productVariantId.toString() === item.productVariantId
                );
                return selectedVariant ? (
                  <div className="text-xs text-slate-500 pl-3 py-1 bg-slate-50 rounded border border-slate-100">
                    {selectedVariant.sku} — {selectedVariant.color} (Size {selectedVariant.size})
                  </div>
                ) : null;
              })()}

              {idx < form.items.length - 1 && (
                <div className="border-t border-slate-100 pt-2" />
              )}
            </div>
          ))}
        </div>

        {/* Grand Total */}
        <div className="mt-4 pt-3 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-700">Grand Total</span>
            <span className="text-lg font-semibold text-green-600">
              £{grandTotal.toFixed(2)}
            </span>
          </div>
        </div>
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
          {purchase ? "Update Purchase" : "Create Purchase"}
        </Button>
      </div>
    </form>
  );
}