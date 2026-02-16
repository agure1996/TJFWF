import { useQuery } from "@tanstack/react-query";
import {
  saleService,
  purchaseService,
  variantService,
  expenseService,
} from "@/api/services";
import { useTheme } from "@/ThemeContext";
import { TrendingUp, TrendingDown, DollarSign, Package, Wallet } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns";

export default function Analytics() {
  const { darkMode } = useTheme();

  // Fetch data
  const { data: salesRes = [] } = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const response = await saleService.list();
      return Array.isArray(response) ? response : [];
    },
  });

  const { data: purchasesRes = [] } = useQuery({
    queryKey: ["purchases"],
    queryFn: () => purchaseService.list().then((r) => r.data.data),
  });

  const { data: variantsRes = [] } = useQuery({
    queryKey: ["variants"],
    queryFn: () => variantService.listAll().then((r) => r.data.data),
  });

  const { data: expensesRes = [] } = useQuery({
    queryKey: ["expenses"],
    queryFn: () => expenseService.list().then((r) => r.data.data),
  });

  const sales = Array.isArray(salesRes) ? salesRes : [];
  const purchases = Array.isArray(purchasesRes) ? purchasesRes : [];
  const variants = Array.isArray(variantsRes) ? variantsRes : [];
  const expenses = Array.isArray(expensesRes) ? expensesRes : [];

  // Calculate metrics
  const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  const totalCosts = purchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netProfit = totalRevenue - totalCosts - totalExpenses;
  const totalStock = variants.reduce((sum, v) => sum + (v.quantity || 0), 0);
  const stockValue = variants.reduce((sum, v) => sum + (v.quantity || 0) * (v.salePrice || 0), 0);

  // Get last 6 months data
  const sixMonthsAgo = subMonths(new Date(), 5);
  const months = eachMonthOfInterval({
    start: startOfMonth(sixMonthsAgo),
    end: endOfMonth(new Date()),
  });

  const monthlyData = months.map((month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const monthSales = sales.filter((s) => {
      if (!s.saleDate) return false;
      const saleDate = new Date(s.saleDate);
      return saleDate >= monthStart && saleDate <= monthEnd;
    });

    const monthPurchases = purchases.filter((p) => {
      if (!p.purchaseDate) return false;
      const purchaseDate = new Date(p.purchaseDate);
      return purchaseDate >= monthStart && purchaseDate <= monthEnd;
    });

    const monthExpenses = expenses.filter((e) => {
      if (!e.expenseDate) return false;
      const expenseDate = new Date(e.expenseDate);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    });

    const revenue = monthSales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
    const costs = monthPurchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
    const monthlyExpenses = monthExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    return {
      month: format(month, "MMM"),
      revenue: revenue,
      costs: costs + monthlyExpenses,
      profit: revenue - costs - monthlyExpenses,
    };
  });

  // Top selling products
  const productSales = sales.reduce((acc: any, sale) => {
    sale.items?.forEach((item: any) => {
      const productName = item.productVariant?.productName || "Unknown";
      if (!acc[productName]) {
        acc[productName] = { name: productName, value: 0, quantity: 0 };
      }
      acc[productName].value += item.salePrice * item.quantity;
      acc[productName].quantity += item.quantity;
    });
    return acc;
  }, {});

  const topProducts = Object.values(productSales)
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 5);

  // Expense breakdown
  const expenseByType = expenses.reduce((acc: any, expense) => {
    const type = expense.expenseType || "OTHER";
    if (!acc[type]) {
      acc[type] = { name: type, value: 0 };
    }
    acc[type].value += expense.amount || 0;
    return acc;
  }, {});

  const expenseData = Object.values(expenseByType);

  // Color schemes
  const COLORS = darkMode 
    ? ['#8B7355', '#A39180', '#E8DDD0', '#6B5D4F', '#9B8577', '#7A6854']
    : ['#8B7355', '#A39180', '#6B5D4F', '#9B8577', '#7A6854', '#5D504A'];

  const chartColors = {
    revenue: darkMode ? '#10b981' : '#059669',
    costs: darkMode ? '#ef4444' : '#dc2626',
    profit: darkMode ? '#8B7355' : '#7A6854',
    grid: darkMode ? '#404040' : '#e5e7eb',
    text: darkMode ? '#A39180' : '#64748b',
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Analytics
        </h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
          Financial insights and performance metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Revenue */}
        <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-slate-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm font-medium ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
              Total Revenue
            </p>
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
              <DollarSign className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            £{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-500 font-medium">From sales</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-slate-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm font-medium ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
              Net Profit
            </p>
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-[#8B7355]/20' : 'bg-amber-50'}`}>
              <TrendingUp className={`w-4 h-4 ${darkMode ? 'text-[#E8DDD0]' : 'text-amber-600'}`} />
            </div>
          </div>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            £{netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mt-2">
            {netProfit >= 0 ? (
              <TrendingUp className="w-3 h-3 text-green-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-500" />
            )}
            <span className={`text-xs font-medium ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              Revenue - Costs
            </span>
          </div>
        </div>

        {/* Total Stock */}
        <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-slate-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm font-medium ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
              Total Stock
            </p>
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
              <Package className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {totalStock.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <span className={`text-xs font-medium ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
              Worth £{stockValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-slate-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm font-medium ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
              Total Expenses
            </p>
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
              <Wallet className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
            </div>
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            £{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <span className={`text-xs font-medium ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
              Operational costs
            </span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue vs Costs Chart */}
        <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-slate-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Revenue vs Costs (6 Months)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="month" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#262626' : '#ffffff',
                  border: darkMode ? '1px solid #404040' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: darkMode ? '#ffffff' : '#1e293b',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={chartColors.revenue}
                strokeWidth={2}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="costs"
                stroke={chartColors.costs}
                strokeWidth={2}
                name="Costs"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Profit Chart */}
        <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-slate-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Monthly Profit
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="month" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#262626' : '#ffffff',
                  border: darkMode ? '1px solid #404040' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: darkMode ? '#ffffff' : '#1e293b',
                }}
              />
              <Legend />
              <Bar dataKey="profit" fill={chartColors.profit} name="Profit" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-slate-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Top Selling Products
          </h3>
          {topProducts.length === 0 ? (
            <p className={`text-center py-8 ${darkMode ? 'text-[#A39180]' : 'text-slate-400'}`}>
              No sales data yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProducts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {topProducts.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#262626' : '#ffffff',
                    border: darkMode ? '1px solid #404040' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: darkMode ? '#ffffff' : '#1e293b',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Expense Breakdown */}
        <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-slate-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Expense Breakdown
          </h3>
          {expenseData.length === 0 ? (
            <p className={`text-center py-8 ${darkMode ? 'text-[#A39180]' : 'text-slate-400'}`}>
              No expense data yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#262626' : '#ffffff',
                    border: darkMode ? '1px solid #404040' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: darkMode ? '#ffffff' : '#1e293b',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}