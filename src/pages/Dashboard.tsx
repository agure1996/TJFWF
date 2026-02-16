import { useQuery } from "@tanstack/react-query";
import {
  productService,
  variantService,
  supplierService,
  purchaseService,
  saleService,
} from "@/api/services";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useTheme } from "@/ThemeContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const { data: productsRes = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.list().then((r) => r.data.data),
  });
  const products = Array.isArray(productsRes) ? productsRes : [];

  const { data: variantsRes = [], isLoading: loadingVariants } = useQuery({
    queryKey: ["variants"],
    queryFn: () => variantService.listAll().then((r) => r.data.data),
  });
  const variants = Array.isArray(variantsRes) ? variantsRes : [];

  const { data: suppliersRes = [], isLoading: loadingSuppliers } = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => supplierService.list().then((r) => r.data.data),
  });
  const suppliers = Array.isArray(suppliersRes) ? suppliersRes : [];

  const { data: purchasesRes = [], isLoading: loadingPurchases } = useQuery({
    queryKey: ["purchases"],
    queryFn: () => purchaseService.list().then((r) => r.data.data),
  });
  const allPurchases = Array.isArray(purchasesRes) ? purchasesRes : [];
  const purchases = allPurchases.slice(0, 5);

  const { data: salesRes = [], isLoading: loadingSales, error: salesError } = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const response = await saleService.list();
      if (response) {
        return Array.isArray(response) ? response : [];
      }
      return Array.isArray(response) ? response : [];
    },
  });

  const allSales = Array.isArray(salesRes) ? salesRes : [];
  const sales = allSales.slice(0, 5);

  const totalStock = variants.reduce((sum, v) => sum + (v.quantity || 0), 0);
  const totalSalesAmount = allSales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);

  // Separate variants by stock status
  const outOfStockVariants = variants.filter((v) => (v.quantity ?? 0) === 0);
  const lowStockVariants = variants.filter((v) => {
    const qty = v.quantity ?? 0;
    return qty > 0 && qty <= 5;
  });

  const handleVariantClick = (variant: any) => {
    navigate(`/products?productId=${variant.productId}&variantId=${variant.productVariantId}`);
  };

  const handleSaleClick = (saleId: number) => {
    navigate('/sales', { state: { highlightSaleId: saleId } });
  };

  const handlePurchaseClick = (purchaseId: number) => {
    navigate('/purchases', { state: { highlightPurchaseId: purchaseId } });
  };

  const isLoading = loadingProducts || loadingVariants || loadingSuppliers || loadingPurchases || loadingSales;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Dashboard
        </h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
          Overview of your inventory and transactions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-slate-200'}`}>
          <p className={`text-sm font-medium ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
            Products
          </p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {isLoading ? "..." : products.length}
          </p>
        </div>
        <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-slate-200'}`}>
          <p className={`text-sm font-medium ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
            Total Stock
          </p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {isLoading ? "..." : totalStock.toLocaleString()}
          </p>
        </div>
        <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-slate-200'}`}>
          <p className={`text-sm font-medium ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
            Suppliers
          </p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {isLoading ? "..." : suppliers.length}
          </p>
        </div>
        <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-slate-200'}`}>
          <p className={`text-sm font-medium ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
            Revenue
          </p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {isLoading ? "..." : `£${totalSalesAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Sales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-slate-200'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Recent Sales
            </h2>
            <Link
              to={createPageUrl("Sales")}
              className={`text-sm font-medium flex items-center gap-1 ${darkMode ? 'text-[#E8DDD0] hover:text-white' : 'text-indigo-600 hover:text-indigo-800'}`}
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loadingSales ? (
            <p className={`text-sm py-6 text-center ${darkMode ? 'text-[#A39180]' : 'text-slate-400'}`}>
              Loading...
            </p>
          ) : salesError ? (
            <p className="text-sm text-red-500 py-6 text-center">Error loading sales</p>
          ) : sales.length === 0 ? (
            <p className={`text-sm py-6 text-center ${darkMode ? 'text-[#A39180]' : 'text-slate-400'}`}>
              No sales yet
            </p>
          ) : (
            <div className="space-y-3">
              {sales.map((sale) => (
                <button
                  key={sale.saleId}
                  onClick={() => handleSaleClick(sale.saleId)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer text-left ${
                    darkMode 
                      ? 'bg-neutral-700 hover:bg-neutral-600' 
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-700'}`}>
                      {sale.customerName || "Walk-in"}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
                      {sale.saleDate
                        ? format(new Date(sale.saleDate), "MMM d, yyyy")
                        : "—"}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    £{(sale.totalAmount || 0).toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Purchases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-slate-200'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Recent Purchases
            </h2>
            <Link
              to={createPageUrl("Purchases")}
              className={`text-sm font-medium flex items-center gap-1 ${darkMode ? 'text-[#E8DDD0] hover:text-white' : 'text-indigo-600 hover:text-indigo-800'}`}
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loadingPurchases ? (
            <p className={`text-sm py-6 text-center ${darkMode ? 'text-[#A39180]' : 'text-slate-400'}`}>
              Loading...
            </p>
          ) : purchases.length === 0 ? (
            <p className={`text-sm py-6 text-center ${darkMode ? 'text-[#A39180]' : 'text-slate-400'}`}>
              No purchases yet
            </p>
          ) : (
            <div className="space-y-3">
              {purchases.map((purchase) => (
                <button
                  key={purchase.purchaseId}
                  onClick={() => handlePurchaseClick(purchase.purchaseId)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer text-left ${
                    darkMode 
                      ? 'bg-neutral-700 hover:bg-neutral-600' 
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-700'}`}>
                      {purchase.supplier?.supplierName || `Purchase #${purchase.purchaseId}`}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
                      {purchase.purchaseDate
                        ? format(new Date(purchase.purchaseDate), "MMM d, yyyy")
                        : "—"}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    £{(purchase.totalAmount || 0).toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* OUT OF STOCK ALERT - Critical Priority */}
      {!loadingVariants && outOfStockVariants.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`mb-6 rounded-xl p-6 ${
            darkMode 
              ? 'bg-red-950/40 border-2 border-red-800/70' 
              : 'bg-red-50 border-2 border-red-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
            <h3 className={`text-lg font-bold ${darkMode ? 'text-red-400' : 'text-red-800'}`}>
              Out of Stock ({outOfStockVariants.length})
            </h3>
          </div>
          <p className={`text-sm mb-4 ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
            These products are completely sold out and cannot be sold until restocked.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {outOfStockVariants.map((v) => (
              <button
                key={v.productVariantId}
                type="button"
                className={`rounded-xl p-3 border-2 transition-all text-left w-full ${
                  darkMode
                    ? 'bg-red-950/30 border-red-800/70 hover:border-red-700 hover:bg-red-950/50'
                    : 'bg-white border-red-300 hover:border-red-400 hover:bg-red-50'
                }`}
                onClick={() => handleVariantClick(v)}
              >
                <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {v.sku}
                </p>
                <p className={`text-xs ${darkMode ? 'text-[#A39180]' : 'text-slate-600'}`}>
                  {v.color} - Size {v.size}
                </p>
                <p className={`text-sm font-bold mt-1 flex items-center gap-1 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  OUT OF STOCK
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* LOW STOCK ALERT - Warning */}
      {!loadingVariants && lowStockVariants.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-xl p-6 ${
            darkMode 
              ? 'bg-amber-900/20 border border-amber-700/50' 
              : 'bg-amber-50 border border-amber-200'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-amber-400' : 'text-amber-800'}`}>
            Low Stock Alert ({lowStockVariants.length})
          </h3>
          <p className={`text-sm mb-4 ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
            These products are running low. Consider restocking soon.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockVariants.map((v) => (
              <button
                key={v.productVariantId}
                type="button"
                className={`rounded-xl p-3 border transition-all text-left w-full ${
                  darkMode
                    ? 'bg-neutral-800 border-amber-700/50 hover:border-amber-600 hover:bg-neutral-700'
                    : 'bg-white border-amber-200 hover:border-amber-300 hover:bg-amber-50'
                }`}
                onClick={() => handleVariantClick(v)}
              >
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-700'}`}>
                  {v.sku}
                </p>
                <p className={`text-xs ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
                  {v.color} - Size {v.size}
                </p>
                <p className={`text-sm font-bold mt-1 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                  {v.quantity} left
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}