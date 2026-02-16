import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseService } from '@/api/services';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Wallet, Inbox } from "lucide-react";
import { format } from "date-fns";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import { useTheme } from "@/ThemeContext";
import { useToastHelper } from "@/components/ui/toastHelper";


const TYPE_COLORS = {
  RENT: "bg-violet-100 text-violet-700",
  ELECTRICITY: "bg-amber-100 text-amber-700",
  WATER: "bg-sky-100 text-sky-700",
  INSURANCE: "bg-indigo-100 text-indigo-700",
  MARKETING: "bg-pink-100 text-pink-700",
  SUPPLIES: "bg-emerald-100 text-emerald-700",
  OTHER: "bg-slate-100 text-slate-600",
} as const;

const TYPE_COLORS_DARK = {
  RENT: "bg-violet-900/20 text-violet-300",
  ELECTRICITY: "bg-amber-900/20 text-amber-300",
  WATER: "bg-sky-900/20 text-sky-300",
  INSURANCE: "bg-indigo-900/20 text-indigo-300",
  MARKETING: "bg-pink-900/20 text-pink-300",
  SUPPLIES: "bg-emerald-900/20 text-emerald-300",
  OTHER: "bg-neutral-700 text-[#A39180]",
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
  const { darkMode } = useTheme();
  const { toastCreate, toastUpdate, toastDelete, toastError } = useToastHelper();
  
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

  const getBadgeColor = (type: string) => {
    const typeKey = type as KnownExpenseType;
    return darkMode ? TYPE_COLORS_DARK[typeKey] || TYPE_COLORS_DARK.OTHER : TYPE_COLORS[typeKey] || TYPE_COLORS.OTHER;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Expenses
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
            Track operational costs
          </p>
        </div>

        <Button
          onClick={() => {
            setEditing(undefined);
            setShowForm(true);
          }}
          className={`${darkMode ? 'bg-[#8B7355] hover:bg-[#7A6854]' : 'bg-[#8B7355] hover:bg-[#7A6854]'} text-white`}
        >
          <Plus className="w-4 h-4 mr-2" /> New Expense
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4 ${
              darkMode ? 'border-neutral-700 border-t-[#8B7355]' : 'border-stone-200 border-t-[#8B7355]'
            }`}></div>
            <p className={darkMode ? 'text-[#A39180]' : 'text-slate-500'}>Loading expenses...</p>
          </div>
        </div>
      ) : expenses.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            darkMode ? 'bg-neutral-800' : 'bg-slate-100'
          }`}>
            <Inbox className={`w-8 h-8 ${darkMode ? 'text-[#A39180]' : 'text-slate-400'}`} />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            No expenses yet
          </h3>
          <p className={`text-sm mb-6 max-w-sm ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
            Track operational costs like rent, electricity, and more.
          </p>
          <Button
            onClick={() => {
              setEditing(undefined);
              setShowForm(true);
            }}
            className={`${darkMode ? 'bg-[#8B7355] hover:bg-[#7A6854]' : 'bg-[#8B7355] hover:bg-[#7A6854]'} text-white`}
          >
            <Plus className="w-4 h-4 mr-2" /> Create First Expense
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table View - Hidden on mobile */}
          <div className={`hidden md:block rounded-xl shadow-sm overflow-hidden ${
            darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-slate-200'
          }`}>
            <table className="w-full">
              <thead className={darkMode ? 'bg-neutral-900 border-b border-neutral-700' : 'bg-slate-50 border-b border-slate-200'}>
                <tr>
                  <th className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-[#A39180]' : 'text-slate-500'
                  }`}>
                    Expense
                  </th>
                  <th className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-[#A39180]' : 'text-slate-500'
                  }`}>
                    Type
                  </th>
                  <th className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-[#A39180]' : 'text-slate-500'
                  }`}>
                    Date
                  </th>
                  <th className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-[#A39180]' : 'text-slate-500'
                  }`}>
                    Amount
                  </th>
                  <th className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-[#A39180]' : 'text-slate-500'
                  }`}>
                    Notes
                  </th>
                  <th className={`px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-[#A39180]' : 'text-slate-500'
                  }`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={darkMode ? 'divide-y divide-neutral-700' : 'divide-y divide-slate-200'}>
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className={`transition-colors ${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                          darkMode ? 'bg-rose-900/20' : 'bg-rose-100'
                        }`}>
                          <Wallet className={`w-4 h-4 ${darkMode ? 'text-rose-400' : 'text-rose-600'}`} />
                        </div>
                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {expense.expenseName}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge className={`text-xs ${getBadgeColor(expense.expenseType)}`}>
                        {expense.expenseType}
                      </Badge>
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {expense.expenseDate ? format(new Date(expense.expenseDate), "MMM d, yyyy") : "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className={`text-sm font-semibold ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>
                        £{(expense.amount || 0).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`text-sm truncate max-w-xs ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
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
                          className={darkMode 
                            ? 'text-[#E8DDD0] hover:text-white hover:bg-[#8B7355]/20' 
                            : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
                          }
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
                className={`rounded-xl shadow-sm border p-4 ${
                  darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-slate-200'
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      darkMode ? 'bg-rose-900/20' : 'bg-rose-100'
                    }`}>
                      <Wallet className={`w-5 h-5 ${darkMode ? 'text-rose-400' : 'text-rose-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold truncate ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {expense.expenseName}
                      </div>
                      <Badge className={`text-xs mt-1 ${getBadgeColor(expense.expenseType)}`}>
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
                      className={`h-8 w-8 ${
                        darkMode 
                          ? 'text-[#E8DDD0] hover:text-white hover:bg-[#8B7355]/20' 
                          : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
                      }`}
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
                    <span className={darkMode ? 'text-[#A39180]' : 'text-slate-500'}>
                      {expense.expenseDate ? format(new Date(expense.expenseDate), "MMM d, yyyy") : "—"}
                    </span>
                    <span className={`font-semibold ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>
                      £{(expense.amount || 0).toFixed(2)}
                    </span>
                  </div>
                  {expense.notes && (
                    <div className={`text-xs pt-2 border-t ${
                      darkMode ? 'border-neutral-700 text-[#A39180]' : 'border-slate-100 text-slate-500'
                    }`}>
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
        <DialogContent className={`sm:max-w-md max-h-[90vh] overflow-y-auto ${
          darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white'
        }`}>
          <DialogHeader>
            <DialogTitle className={`text-xl font-semibold ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
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