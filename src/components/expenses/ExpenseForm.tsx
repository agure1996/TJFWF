import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useTheme } from "@/ThemeContext";

const EXPENSE_TYPES = ["RENT", "ELECTRICITY", "WATER", "INSURANCE", "MARKETING", "SUPPLIES", "OTHER"];

type ExpenseFormProps = {
  expense?: {
    id: string;
    expenseName: string;
    expenseType: string;
    amount: number;
    expenseDate: string;
    notes?: string;
  };
  onSubmit: (data: {
    expenseName: string;
    expenseType: string;
    amount: number;
    expenseDate: string;
    notes?: string;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export default function ExpenseForm({
  expense,
  onSubmit,
  onCancel,
  isLoading,
}: Readonly<ExpenseFormProps>) {
  const { darkMode } = useTheme();
  
  const [form, setForm] = useState({
    expenseName: "",
    expenseType: "RENT",
    amount: "",
    expenseDate: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  useEffect(() => {
    if (expense) {
      setForm({
        expenseName: expense.expenseName || "",
        expenseType: expense.expenseType || "RENT",
        amount: expense.amount?.toString() || "",
        expenseDate: expense.expenseDate
          ? expense.expenseDate.slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        notes: expense.notes || "",
      });
    }
  }, [expense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      expenseName: form.expenseName,
      expenseType: form.expenseType,
      amount: Number(form.amount),
      expenseDate: form.expenseDate,
      notes: form.notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Expense Name */}
      <div className="flex flex-col">
        <label htmlFor="expenseName" className={`text-sm font-medium mb-1.5 ${
          darkMode ? 'text-[#E8DDD0]' : 'text-slate-700'
        }`}>
          Expense Name
        </label>
        <input
          id="expenseName"
          type="text"
          value={form.expenseName}
          onChange={(e) => setForm({ ...form, expenseName: e.target.value })}
          placeholder="e.g. Monthly Rent"
          required
          className={`border rounded-lg px-3 py-2 text-sm transition-all ${
            darkMode 
              ? 'bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400' 
              : 'bg-white border-stone-300 text-slate-900 placeholder-slate-400'
          } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
        />
      </div>

      {/* Type and Amount - Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="expenseType" className={`text-sm font-medium mb-1.5 ${
            darkMode ? 'text-[#E8DDD0]' : 'text-slate-700'
          }`}>
            Type
          </label>
          <div className="relative">
            <select
              id="expenseType"
              value={form.expenseType}
              onChange={(e) => setForm({ ...form, expenseType: e.target.value })}
              required
              className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm appearance-none cursor-pointer transition-all ${
                darkMode 
                  ? 'bg-neutral-700 border-neutral-600 text-white' 
                  : 'bg-white border-stone-300 text-slate-900'
              } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
            >
              {EXPENSE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
              darkMode ? 'text-neutral-400' : 'text-slate-400'
            }`} />
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="amount" className={`text-sm font-medium mb-1.5 ${
            darkMode ? 'text-[#E8DDD0]' : 'text-slate-700'
          }`}>
            Amount (£)
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="0.00"
            required
            className={`border rounded-lg px-3 py-2 text-sm transition-all ${
              darkMode 
                ? 'bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400' 
                : 'bg-white border-stone-300 text-slate-900 placeholder-slate-400'
            } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
          />
        </div>
      </div>

      {/* Date */}
      <div className="flex flex-col">
        <label htmlFor="expenseDate" className={`text-sm font-medium mb-1.5 ${
          darkMode ? 'text-[#E8DDD0]' : 'text-slate-700'
        }`}>
          Date
        </label>
        <input
          id="expenseDate"
          type="date"
          value={form.expenseDate}
          onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
          required
          className={`border rounded-lg px-3 py-2 text-sm transition-all ${
            darkMode 
              ? 'bg-neutral-700 border-neutral-600 text-white' 
              : 'bg-white border-stone-300 text-slate-900'
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
          {expense ? "Update Expense" : "Create Expense"}
        </Button>
      </div>
    </form>
  );
}