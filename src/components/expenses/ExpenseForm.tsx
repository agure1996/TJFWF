import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EXPENSE_TYPES = ["RENT","ELECTRICITY","WATER","INSURANCE","MARKETING","SUPPLIES","OTHER"];

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

export default function ExpenseForm({expense,onSubmit,onCancel,isLoading,}: Readonly<ExpenseFormProps>) {
  const [form, setForm] = useState({
    expenseName: "",
    expenseType: "",
    amount: "",
    expenseDate: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  useEffect(() => {
    if (expense) {
      setForm({
        expenseName: expense.expenseName || "",
        expenseType: expense.expenseType || "",
        amount: expense.amount?.toString() || "",
        expenseDate: expense.expenseDate
          ? expense.expenseDate.slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        notes: expense.notes || "",
      });
    }
  }, [expense]);

  const handleSubmit = (e:any) => {
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label>Expense Name</Label>
        <Input
          value={form.expenseName}
          onChange={(e:any) => setForm({ ...form, expenseName: e.target.value })}
          placeholder="e.g. Monthly Rent"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={form.expenseType}
            onValueChange={(val:string) => setForm({ ...form, expenseType: val })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {EXPENSE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Amount (£)</Label>
          <Input
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(e:any) => setForm({ ...form, amount: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Date</Label>
        <Input
          type="date"
          value={form.expenseDate}
          onChange={(e:any) => setForm({ ...form, expenseDate: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea
          value={form.notes}
          onChange={(e:any) => setForm({ ...form, notes: e.target.value })}
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
          {expense ? "Update" : "Add"} Expense
        </Button>
      </div>
    </form>
  );
}
