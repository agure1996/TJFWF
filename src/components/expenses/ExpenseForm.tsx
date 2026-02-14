import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

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
        <label htmlFor="expenseName" className="text-sm font-medium text-slate-700 mb-1.5">
          Expense Name
        </label>
        <input
          id="expenseName"
          type="text"
          value={form.expenseName}
          onChange={(e) => setForm({ ...form, expenseName: e.target.value })}
          placeholder="e.g. Monthly Rent"
          required
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Type and Amount - Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="expenseType" className="text-sm font-medium text-slate-700 mb-1.5">
            Type
          </label>
          <select
            id="expenseType"
            value={form.expenseType}
            onChange={(e) => setForm({ ...form, expenseType: e.target.value })}
            required
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
          >
            {EXPENSE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="amount" className="text-sm font-medium text-slate-700 mb-1.5">
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
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Date */}
      <div className="flex flex-col">
        <label htmlFor="expenseDate" className="text-sm font-medium text-slate-700 mb-1.5">
          Date
        </label>
        <input
          id="expenseDate"
          type="date"
          value={form.expenseDate}
          onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
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
          {expense ? "Update Expense" : "Create Expense"}
        </Button>
      </div>
    </form>
  );
}