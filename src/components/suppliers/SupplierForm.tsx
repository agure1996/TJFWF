import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/ThemeContext";
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
  const { darkMode } = useTheme();
  
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
        <label htmlFor="supplierName" className={`text-sm font-medium mb-1.5 ${
          darkMode ? 'text-[#E8DDD0]' : 'text-slate-700'
        }`}>
          Supplier Name
        </label>
        <input
          id="supplierName"
          type="text"
          value={form.supplierName}
          onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
          placeholder="e.g. Al-Noor Textiles"
          required
          className={`border rounded-lg px-3 py-2 text-sm transition-all ${
            darkMode 
              ? 'bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400' 
              : 'bg-white border-stone-300 text-slate-900 placeholder-slate-400'
          } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
        />
      </div>

      {/* Contact Info */}
      <div className="flex flex-col">
        <label htmlFor="supplierContactInfo" className={`text-sm font-medium mb-1.5 ${
          darkMode ? 'text-[#E8DDD0]' : 'text-slate-700'
        }`}>
          Contact Info
        </label>
        <input
          id="supplierContactInfo"
          type="text"
          value={form.supplierContactInfo}
          onChange={(e) => setForm({ ...form, supplierContactInfo: e.target.value })}
          placeholder="Phone, email, or address"
          required
          className={`border rounded-lg px-3 py-2 text-sm transition-all ${
            darkMode 
              ? 'bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400' 
              : 'bg-white border-stone-300 text-slate-900 placeholder-slate-400'
          } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
        />
      </div>

      {/* Notes */}
      <div className="flex flex-col">
        <label htmlFor="notes" className={`text-sm font-medium mb-1.5 ${
          darkMode ? 'text-[#E8DDD0]' : 'text-slate-700'
        }`}>
          Notes
        </label>
        <textarea
          id="notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Optional notes..."
          rows={3}
          className={`border rounded-lg px-3 py-2 text-sm resize-none transition-all ${
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
          {supplier ? "Update Supplier" : "Create Supplier"}
        </Button>
      </div>
    </form>
  );
}