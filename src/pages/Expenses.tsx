import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseService } from '@/api/services';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Receipt } from "lucide-react";
import { format } from "date-fns";
import PageHeader from "../components/shared/PageHeader";
import EmptyState from "../components/shared/EmptyState";
import DataTable from "../components/shared/DataTable";
import ExpenseForm from "../components/expenses/ExpenseForm";

const TYPE_COLORS = {
  RENT: "bg-violet-100 text-violet-700",
  ELECTRICITY: "bg-amber-100 text-amber-700",
  WATER: "bg-sky-100 text-sky-700",
  INSURANCE: "bg-indigo-100 text-indigo-700",
  MARKETING: "bg-pink-100 text-pink-700",
  SUPPLIES: "bg-emerald-100 text-emerald-700",
  OTHER: "bg-slate-100 text-slate-600",
} as const;

// API response type
type ExpenseDTO = {
  id: number;
  expenseName: string;
  expenseType: string; // <- keep string for flexibility
  amount: number;
  expenseDate: string;
  notes?: string;
};

// Local type with string id
type ExpenseType = Omit<ExpenseDTO, "id"> & { id: string };

// Known types for badge coloring
type KnownExpenseType = keyof typeof TYPE_COLORS;

export default function Expenses() {
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ExpenseType | undefined>(undefined);

  // Fetch expenses
  const { data: expensesRes = [], isLoading } = useQuery<ExpenseDTO[]>({
    queryKey: ["expenses"],
    queryFn: async () => {
      const res = await expenseService.list();
      return res.data.data as ExpenseDTO[];
    },
  });

  // Convert API response to local ExpenseType (string id)
  const expenses: ExpenseType[] = Array.isArray(expensesRes)
    ? expensesRes.map((e) => ({ ...e, id: e.id.toString() }))
    : [];

  const createExpense = useMutation({
    mutationFn: (data: Omit<ExpenseType, "id">) =>
      expenseService.create(data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setShowForm(false);
      setEditing(undefined);
    },
  });

  const updateExpense = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<ExpenseType, "id"> }) =>
      expenseService.update(Number(id), data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setShowForm(false);
      setEditing(undefined);
    },
  });

  const deleteExpense = useMutation({
    mutationFn: (id: string) => expenseService.remove(Number(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
  });

  // Map string from form to known union type for badges, fallback OTHER
  const mapExpenseType = (value: string): ExpenseType["expenseType"] => {
    const validTypes: KnownExpenseType[] = Object.keys(TYPE_COLORS) as KnownExpenseType[];
    return validTypes.includes(value as KnownExpenseType) ? (value as KnownExpenseType) : "OTHER";
  };

  const handleSubmit = (data: Omit<ExpenseType, "id">) => {
    const payload: Omit<ExpenseType, "id"> = {
      ...data,
      expenseType: mapExpenseType(data.expenseType),
    };

    if (editing) {
      updateExpense.mutate({ id: editing.id, data: payload });
    } else {
      createExpense.mutate(payload);
    }
  };

  const columns = [
    {
      key: "expenseName",
      label: "Expense",
      render: (row: ExpenseType) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
            <Receipt className="w-4 h-4 text-rose-600" />
          </div>
          <span className="font-medium">{row.expenseName}</span>
        </div>
      ),
    },
    {
      key: "expenseType",
      label: "Type",
      render: (row: ExpenseType) => (
        <Badge className={`text-[10px] ${TYPE_COLORS[row.expenseType as KnownExpenseType] || "bg-slate-100 text-slate-600"}`}>
          {row.expenseType}
        </Badge>
      ),
    },
    {
      key: "expenseDate",
      label: "Date",
      render: (row: ExpenseType) =>
        row.expenseDate ? format(new Date(row.expenseDate), "MMM d, yyyy") : "—",
    },
    {
      key: "amount",
      label: "Amount",
      render: (row: ExpenseType) => <span className="font-bold text-rose-600">£{(row.amount || 0).toFixed(2)}</span>,
    },
    {
      key: "notes",
      label: "Notes",
      render: (row: ExpenseType) => <span className="text-slate-400 text-sm">{row.notes || "—"}</span>,
    },
    {
      key: "actions",
      label: "",
      render: (row: ExpenseType) => (
        <div className="flex gap-1 justify-end">
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setEditing(row);
              setShowForm(true);
            }}
          >
            <Pencil className="w-4 h-4 text-slate-400" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              deleteExpense.mutate(row.id);
            }}
          >
            <Trash2 className="w-4 h-4 text-slate-400" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Expenses"
        subtitle="Track operational costs"
        actions={
          <Button
            onClick={() => {
              setEditing(undefined);
              setShowForm(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" /> New Expense
          </Button>
        }
      />

      {expenses.length === 0 && !isLoading ? (
        <EmptyState
          title="No expenses yet"
          description="Track operational costs like rent, electricity, and more."
          action={
            <Button onClick={() => setShowForm(true)} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" /> Add Expense
            </Button>
          }
        />
      ) : (
        <DataTable columns={columns} data={expenses} isLoading={isLoading} onRowClick={undefined} />
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Expense" : "New Expense"}</DialogTitle>
          </DialogHeader>
          <ExpenseForm
            expense={editing}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            isLoading={createExpense.isPending || updateExpense.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
