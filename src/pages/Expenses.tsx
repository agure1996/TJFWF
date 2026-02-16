import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseService } from '@/api/services';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Wallet, Inbox } from "lucide-react";
import { format } from "date-fns";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import { toastCreate, toastUpdate, toastDelete } from "@/components/ui/toastHelper";

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
  expenseType: string;
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
      toastCreate("Expense created successfully");
    },
  });

  const updateExpense = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<ExpenseType, "id"> }) =>
      expenseService.update(Number(id), data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setShowForm(false);
      setEditing(undefined);
      toastUpdate("Expense updated successfully");
    },
  });

  const deleteExpense = useMutation({
    mutationFn: (id: string) => expenseService.remove(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toastDelete("Expense deleted!");
    },
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

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    deleteExpense.mutate(id);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
          <p className="text-sm text-slate-500 mt-1">Track operational costs</p>
        </div>

        <Button
          onClick={() => {
            setEditing(undefined);
            setShowForm(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" /> New Expense
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500">Loading expenses...</p>
          </div>
        </div>
      ) : expenses.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No expenses yet</h3>
          <p className="text-sm text-slate-500 mb-6 max-w-sm">
            Track operational costs like rent, electricity, and more.
          </p>
          <Button
            onClick={() => {
              setEditing(undefined);
              setShowForm(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Create First Expense
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Expense
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center mr-3">
                          <Wallet className="w-4 h-4 text-rose-600" />
                        </div>
                        <div className="text-sm font-medium text-slate-900">
                          {expense.expenseName}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge className={`text-xs ${TYPE_COLORS[expense.expenseType as KnownExpenseType] || "bg-slate-100 text-slate-600"}`}>
                        {expense.expenseType}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {expense.expenseDate ? format(new Date(expense.expenseDate), "MMM d, yyyy") : "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-semibold text-rose-600">
                        £{(expense.amount || 0).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-slate-500 truncate max-w-xs">
                        {expense.notes || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditing(expense);
                            setShowForm(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                          aria-label="Edit expense"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          aria-label="Delete expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Hidden on desktop */}
          <div className="md:hidden space-y-3">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-rose-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate">
                        {expense.expenseName}
                      </div>
                      <Badge className={`text-xs mt-1 ${TYPE_COLORS[expense.expenseType as KnownExpenseType] || "bg-slate-100 text-slate-600"}`}>
                        {expense.expenseType}
                      </Badge>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditing(expense);
                        setShowForm(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8 w-8"
                      aria-label="Edit expense"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                      aria-label="Delete expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">
                      {expense.expenseDate ? format(new Date(expense.expenseDate), "MMM d, yyyy") : "—"}
                    </span>
                    <span className="font-semibold text-rose-600">
                      £{(expense.amount || 0).toFixed(2)}
                    </span>
                  </div>
                  {expense.notes && (
                    <div className="text-slate-500 text-xs pt-2 border-t border-slate-100">
                      {expense.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editing ? "Edit Expense" : "New Expense"}
            </DialogTitle>
          </DialogHeader>
          <ExpenseForm
            expense={editing}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditing(undefined);
            }}
            isLoading={createExpense.isPending || updateExpense.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}