import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

    setForm({
      supplierId: purchase.supplier?.supplierId?.toString() || "",
      purchaseType: purchase.purchaseType,
      purchaseDate:
        purchase.purchaseDate?.slice(0, 16) ||
        new Date().toISOString().slice(0, 16),
      items: purchase.items?.length
        ? purchase.items.map((i) => ({
            productVariantId: i.productVariant.productVariantId.toString(),
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
  if (form.items.some((i) => !i.productVariantId || !i.quantity || !i.costPrice))
    return setErrors(
      "Please select valid variants and fill quantity/cost for all items."
    );

  setErrors("");

  // Build payload with correct keys
  const payload: any = {
  supplierId: Number(form.supplierId),
  purchaseType: form.purchaseType,
  purchaseDate: new Date(form.purchaseDate).toISOString(),
  items: form.items.map((i) => ({
    productVariantId: Number(i.productVariantId),
    quantity: Number(i.quantity),
    costPrice: Number(i.costPrice),
  })),
};

  // Submit
  onSubmit(payload);
};



  const grandTotal = form.items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.costPrice),
    0,
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 max-h-[70vh] overflow-y-auto pr-2 px-4"
    >
      {errors && <p className="text-red-500 text-sm">{errors}</p>}

      {/* Supplier & Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Supplier</Label>
          <Select
            value={form.supplierId}
            onValueChange={(v) => setForm({ ...form, supplierId: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((s) => (
                <SelectItem key={s.supplierId} value={s.supplierId.toString()}>
                  {s.supplierName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Purchase Type</Label>
          <Select
            value={form.purchaseType}
            onValueChange={(v) =>
              setForm({ ...form, purchaseType: v as "SINGLE" | "BATCH" })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SINGLE">Single</SelectItem>
              <SelectItem value="BATCH">Batch (12 units)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date */}
      <div>
        <Label>Purchase Date</Label>
        <Input
          type="datetime-local"
          value={form.purchaseDate}
          onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
        />
      </div>

      {/* Items */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label>Items</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-3 h-3 mr-1" /> Add Item
          </Button>
        </div>

        {form.items.map((item, idx) => (
          <div
            key={`${item.productVariantId}-${idx}`}
            className="flex items-end gap-2 p-3 bg-slate-50 rounded-xl"
          >
            <div className="flex-1">
              <Label className="text-xs">Variant</Label>
              <Select
                value={item.productVariantId}
                onValueChange={(v) => updateItem(idx, "productVariantId", v)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select variant" />
                </SelectTrigger>
                <SelectContent>
                  {variants.map((v) => (
                    <SelectItem
                      key={v.productVariantId}
                      value={v.productVariantId.toString()}
                    >
                      {v.sku} — {v.color} (Size {v.size})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-20">
              <Label className="text-xs">Qty</Label>
              <Input
                type="number"
                className="h-9"
                value={item.quantity}
                min={1}
                onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                disabled={form.purchaseType === "BATCH"}
              />
            </div>

            <div className="w-24">
              <Label className="text-xs">Cost (£)</Label>
              <Input
                type="number"
                step="0.01"
                className="h-9"
                value={item.costPrice}
                min={0.01}
                onChange={(e) => updateItem(idx, "costPrice", e.target.value)}
              />
            </div>

            <div className="w-9 flex items-center justify-center">
              {form.items.length > 1 && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removeItem(idx)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </div>
          </div>
        ))}

        <div className="text-right font-semibold">
          Grand Total: £{grandTotal.toFixed(2)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {purchase ? "Update" : "Create"} Purchase
        </Button>
      </div>
    </form>
  );
}
