import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import type { SupplierDTO } from "@/api/types";

interface SupplierFormProps {
  supplier?: SupplierDTO | null;
  onSubmit: (data: Omit<SupplierDTO, "supplierId">) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function SupplierForm({
  supplier,
  onSubmit,
  onCancel,
  isLoading = false,
}: Readonly<SupplierFormProps>) {
  const [form, setForm] = useState<Omit<SupplierDTO, "supplierId">>({
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Supplier Name */}
      <div className="flex flex-col">
        <label htmlFor="supplierName" className="text-sm font-medium text-slate-700 mb-1.5">
          Supplier Name
        </label>
        <input
          id="supplierName"
          type="text"
          value={form.supplierName}
          onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
          placeholder="e.g. Al-Noor Textiles"
          required
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Contact Info */}
      <div className="flex flex-col">
        <label htmlFor="supplierContactInfo" className="text-sm font-medium text-slate-700 mb-1.5">
          Contact Info
        </label>
        <input
          id="supplierContactInfo"
          type="text"
          value={form.supplierContactInfo}
          onChange={(e) => setForm({ ...form, supplierContactInfo: e.target.value })}
          placeholder="Phone, email, or address"
          required
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Notes */}
      <div className="flex flex-col">
        <label htmlFor="notes" className="text-sm font-medium text-slate-700 mb-1.5">
          Notes
        </label>
        <textarea
          id="notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Optional notes..."
          rows={3}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
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
          {supplier ? "Update Supplier" : "Create Supplier"}
        </Button>
      </div>
    </form>
  );
}