import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

export default function SaleForm({ variants, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState({
    customerName: "",
    customerContact: "",
    saleDate: new Date().toISOString().slice(0, 16),
    items: [{ productVariantId: "", quantity: "", salePrice: "" }],
  });

  const addItem = () => {
    setForm(f => ({ ...f, items: [...f.items, { productVariantId: "", quantity: "", salePrice: "" }] }));
  };

  const removeItem = (idx) => {
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  };

  const updateItem = (idx, field, value) => {
    setForm(f => ({
      ...f,
      items: f.items.map((item, i) => {
        if (i !== idx) return item;
        const updated = { ...item, [field]: value };
        // Auto-fill price when variant selected
        if (field === "productVariantId") {
          const v = variants.find(vr => vr.id === value);
          if (v) updated.salePrice = v.salePrice?.toString() || "";
        }
        return updated;
      }),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const items = form.items.map(item => {
      const v = variants.find(vr => vr.id === item.productVariantId);
      return {
        productVariantId: item.productVariantId,
        sku: v?.sku || "",
        quantity: Number(item.quantity),
        salePrice: Number(item.salePrice),
      };
    });
    const totalAmount = items.reduce((s, i) => s + i.quantity * i.salePrice, 0);
    onSubmit({
      customerName: form.customerName,
      customerContact: form.customerContact,
      saleDate: new Date(form.saleDate).toISOString(),
      items,
      totalAmount,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Customer Name</Label>
          <Input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Optional" />
        </div>
        <div className="space-y-2">
          <Label>Customer Contact</Label>
          <Input value={form.customerContact} onChange={(e) => setForm({ ...form, customerContact: e.target.value })} placeholder="Optional" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Sale Date</Label>
        <Input type="datetime-local" value={form.saleDate} onChange={(e) => setForm({ ...form, saleDate: e.target.value })} required />
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
              <Label className="text-xs">Price (£)</Label>
              <Input type="number" step="0.01" className="h-9" value={item.salePrice} onChange={(e) => updateItem(idx, "salePrice", e.target.value)} required />
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
          Create Sale
        </Button>
      </div>
    </form>
  );
}