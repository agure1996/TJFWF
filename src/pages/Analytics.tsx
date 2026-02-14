import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { saleService, purchaseService, expenseService } from '@/api/services';
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { format, startOfMonth, startOfQuarter, startOfYear, endOfMonth, endOfQuarter, endOfYear, eachMonthOfInterval, eachQuarterOfInterval } from "date-fns";

export default function Analytics() {
  const [period, setPeriod] = useState("monthly");

  // Fetch sales - using correct API response structure
  const { data: salesRes = [], isLoading: loadingSales } = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const response = await saleService.list();
      return Array.isArray(response) ? response : [];
    },
  });
  const sales = Array.isArray(salesRes) ? salesRes : [];

  // Fetch purchases
  const { data: purchasesRes = [], isLoading: loadingPurchases } = useQuery({
    queryKey: ["purchases"],
    queryFn: () => purchaseService.list().then(r => r.data.data),
  });
  const purchases = Array.isArray(purchasesRes) ? purchasesRes : [];

  // Fetch expenses
  const { data: expensesRes = [], isLoading: loadingExpenses } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const res = await expenseService.list();
      return res.data.data as any[];
    },
  });
  const expenses = Array.isArray(expensesRes) ? expensesRes : [];

  const chartData = useMemo(() => {
    const now = new Date();
    let intervals = [];

    if (period === "monthly") {
      const start = new Date(now.getFullYear(), 0, 1);
      intervals = eachMonthOfInterval({ start, end: now }).map(date => ({
        label: format(date, "MMM yyyy"),
        start: startOfMonth(date),
        end: endOfMonth(date),
      }));
    } else if (period === "quarterly") {
      const start = new Date(now.getFullYear() - 1, 0, 1);
      intervals = eachQuarterOfInterval({ start, end: now }).map(date => ({
        label: `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`,
        start: startOfQuarter(date),
        end: endOfQuarter(date),
      }));
    } else {
      const years = [now.getFullYear() - 2, now.getFullYear() - 1, now.getFullYear()];
      intervals = years.map(year => ({
        label: year.toString(),
        start: startOfYear(new Date(year, 0, 1)),
        end: endOfYear(new Date(year, 11, 31)),
      }));
    }

    return intervals.map(({ label, start, end }) => {
      const periodSales = sales.filter(s => {
        const date = s.saleDate ? new Date(s.saleDate) : null;
        return date && date >= start && date <= end;
      });
      const periodPurchases = purchases.filter(p => {
        const date = p.purchaseDate ? new Date(p.purchaseDate) : null;
        return date && date >= start && date <= end;
      });
      const periodExpenses = expenses.filter(e => {
        const date = e.expenseDate ? new Date(e.expenseDate) : null;
        return date && date >= start && date <= end;
      });

      const salesAmount = periodSales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
      const purchasesAmount = periodPurchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
      const expensesAmount = periodExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

      return {
        period: label,
        sales: salesAmount,
        purchases: purchasesAmount,
        expenses: expensesAmount,
        profit: salesAmount - purchasesAmount - expensesAmount,
      };
    });
  }, [sales, purchases, expenses, period]);

  const totalSales = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  const totalPurchases = purchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalProfit = totalSales - totalPurchases - totalExpenses;

  const isLoading = loadingSales || loadingPurchases || loadingExpenses;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Track performance over time</p>
        </div>

        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            <TabsTrigger value="annually">Annually</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500">Loading analytics...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-5 bg-white border border-slate-200">
              <p className="text-sm text-slate-500 font-medium">Total Sales</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">£{totalSales.toFixed(2)}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                <TrendingUp className="w-3 h-3" />
                Revenue
              </div>
            </Card>
            <Card className="p-5 bg-white border border-slate-200">
              <p className="text-sm text-slate-500 font-medium">Total Purchases</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">£{totalPurchases.toFixed(2)}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                <TrendingDown className="w-3 h-3" />
                Cost of Goods
              </div>
            </Card>
            <Card className="p-5 bg-white border border-slate-200">
              <p className="text-sm text-slate-500 font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">£{totalExpenses.toFixed(2)}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-rose-600">
                <TrendingDown className="w-3 h-3" />
                Operating Costs
              </div>
            </Card>
            <Card className="p-5 bg-white border border-slate-200">
              <p className="text-sm text-slate-500 font-medium">Net Profit</p>
              <p className={`text-2xl font-bold mt-1 ${totalProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                £{totalProfit.toFixed(2)}
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                <Calendar className="w-3 h-3" />
                All Time
              </div>
            </Card>
          </div>

          {/* Revenue vs Costs Chart */}
          <Card className="p-6 bg-white border border-slate-200 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue vs Costs</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                  formatter={(value: any) => `£${typeof value === 'number' ? value.toFixed(2) : '0.00'}`}
                />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} name="Sales" />
                <Line type="monotone" dataKey="purchases" stroke="#f59e0b" strokeWidth={2} name="Purchases" />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Profit Chart */}
          <Card className="p-6 bg-white border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Net Profit</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                  formatter={(value: any) => `£${typeof value === 'number' ? value.toFixed(2) : '0.00'}`}
                />
                <Legend />
                <Bar dataKey="profit" fill="#4338ca" name="Net Profit" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
  );
}