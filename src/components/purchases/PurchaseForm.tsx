import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

export default function PurchaseForm({ purchase, suppliers, variants, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState({
    supplierId: "",
    purchaseType: "SINGLE",
    purchaseDate: new Date().toISOString().slice(0, 16),
    items: [{ productVariantId: "", quantity: "", costPrice: "" }],
  });

  useEffect(() => {
    if (purchase) {
      setForm({
        supplierId: purchase.supplierId || "",
        purchaseType: purchase.purchaseType || "SINGLE",
        purchaseDate: purchase.purchaseDate ? purchase.purchaseDate.slice(0, 16) : new Date().toISOString().slice(0, 16),
        items: purchase.items?.length ? purchase.items.map(i => ({
          productVariantId: i.productVariantId || "",
          quantity: i.quantity?.toString() || "",
          costPrice: i.costPrice?.toString() || "",
        })) : [{ productVariantId: "", quantity: "", costPrice: "" }],
      });
    }
  }, [purchase]);

  const addItem = () => {
    setForm(f => ({ ...f, items: [...f.items, { productVariantId: "", quantity: "", costPrice: "" }] }));
  };

  const removeItem = (idx) => {
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  };

  const updateItem = (idx, field, value) => {
    setForm(f => ({
      ...f,
      items: f.items.map((item, i) => i === idx ? { ...item, [field]: value } : item),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const supplier = suppliers.find(s => s.id === form.supplierId);
    const items = form.items.map(item => {
      const v = variants.find(vr => vr.id === item.productVariantId);
      return {
        productVariantId: item.productVariantId,
        sku: v?.sku || "",
        quantity: Number(item.quantity),
        costPrice: Number(item.costPrice),
      };
    });
    const totalCost = items.reduce((s, i) => s + i.quantity * i.costPrice, 0);
    onSubmit({
      supplierId: form.supplierId,
      supplierName: supplier?.supplierName || "",
      purchaseType: form.purchaseType,
      purchaseDate: new Date(form.purchaseDate).toISOString(),
      items,
      totalCost,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Supplier</Label>
          <Select value={form.supplierId} onValueChange={(val) => setForm({ ...form, supplierId: val })} required>
            <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
            <SelectContent>
              {suppliers.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.supplierName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Purchase Type</Label>
          <Select value={form.purchaseType} onValueChange={(val) => setForm({ ...form, purchaseType: val })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="SINGLE">Single</SelectItem>
              <SelectItem value="BATCH">Batch (12 units)</SelectItem>
            </SelectContent>
          </Select>
          {form.purchaseType === "BATCH" && (
            <p className="text-xs text-slate-500">A batch is 12 units by default</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Purchase Date</Label>
        <Input type="datetime-local" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} required />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Items</Label>
          <Button type="button" size="sm" variant="outline" onClick={addItem}>
            <Plus className="w-3 h-3 mr-1" /> Add Item
          </Button>
        </div>
        {form.items.map((item, idx) => (
          <div key={idx} className="flex items-end gap-2 p-3 bg-slate-50 rounded-xl">
            <div className="flex-1 space-y-1">
              <Label className="text-xs">Variant</Label>
              <Select value={item.productVariantId} onValueChange={(val) => updateItem(idx, "productVariantId", val)}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Select variant" /></SelectTrigger>
                <SelectContent>
                  {variants.map(v => (
                    <SelectItem key={v.id} value={v.id}>{v.sku} — {v.color} (Size {v.size})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-20 space-y-1">
              <Label className="text-xs">Qty</Label>
              <Input type="number" className="h-9" value={item.quantity} onChange={(e) => updateItem(idx, "quantity", e.target.value)} required />
            </div>
            <div className="w-24 space-y-1">
              <Label className="text-xs">Cost (£)</Label>
              <Input type="number" step="0.01" className="h-9" value={item.costPrice} onChange={(e) => updateItem(idx, "costPrice", e.target.value)} required />
            </div>
            {form.items.length > 1 && (
              <Button type="button" size="icon" variant="ghost" className="h-9 w-9" onClick={() => removeItem(idx)}>
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
          {purchase ? "Update" : "Create"} Purchase
        </Button>
      </div>
    </form>
  );
}