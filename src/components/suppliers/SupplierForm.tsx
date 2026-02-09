import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SupplierDTO } from "@/api/types";

interface SupplierFormProps {
  supplier?: SupplierDTO | null;
  onSubmit: (data: Omit<SupplierDTO, "id">) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function SupplierForm({supplier,onSubmit,onCancel,isLoading = false,}: Readonly<SupplierFormProps>) {
  const [form, setForm] = useState<Omit<SupplierDTO, "id">>({
    supplierName: "",
    supplierContactInfo: "",
    notes: "",
  });

  useEffect(() => {
    if (supplier) {
      setForm({
        supplierName: supplier.supplierName || "",
        supplierContactInfo: supplier.supplierContactInfo || "",
        notes: supplier.notes || "",
      });
    }
  }, [supplier]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form); 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label>Supplier Name</Label>
        <Input
          value={form.supplierName}
          onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
          placeholder="e.g. Al-Noor Textiles"
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Contact Info</Label>
        <Input
          value={form.supplierContactInfo}
          onChange={(e) => setForm({ ...form, supplierContactInfo: e.target.value })}
          placeholder="Phone, email, or address"
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Optional notes..."
          rows={3}
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
          {supplier ? "Update" : "Create"} Supplier
        </Button>
      </div>
    </form>
  );
}
