import { useQuery } from "@tanstack/react-query";
import {
  productService,
  variantService,
  supplierService,
  purchaseService,
  saleService,
} from "@/api/services";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: productsRes = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.list().then((r) => r.data.data),
  });
  const products = Array.isArray(productsRes) ?
   productsRes : [];

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
    
    // The response IS the array, not wrapped in .data.data
    // Check if response has .data property, otherwise use response directly
    if (response) {
      return Array.isArray(response) ? response : [];
    }
    
    return Array.isArray(response) ? response : [];
  },
});

  // Log the sales data we got
  
  const allSales = Array.isArray(salesRes) ? salesRes : [];
  const sales = allSales.slice(0, 5);

  const totalStock = variants.reduce((sum, v) => sum + (v.quantity || 0), 0);
  const totalSalesAmount = allSales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);

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
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of your inventory and transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <p className="text-sm text-slate-500 font-medium">Products</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {isLoading ? "..." : products.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <p className="text-sm text-slate-500 font-medium">Total Stock</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {isLoading ? "..." : totalStock.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <p className="text-sm text-slate-500 font-medium">Suppliers</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {isLoading ? "..." : suppliers.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <p className="text-sm text-slate-500 font-medium">Revenue</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {isLoading ? "..." : `£${totalSalesAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Sales
            </h2>
            <Link
              to={createPageUrl("Sales")}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loadingSales ? (
            <p className="text-sm text-slate-400 py-6 text-center">Loading...</p>
          ) : salesError ? (
            <p className="text-sm text-red-500 py-6 text-center">Error loading sales</p>
          ) : sales.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">
              No sales yet
            </p>
          ) : (
            <div className="space-y-3">
              {sales.map((sale) => (
                <button
                  key={sale.saleId}
                  onClick={() => handleSaleClick(sale.saleId)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {sale.customerName || "Walk-in"}
                    </p>
                    <p className="text-xs text-slate-500">
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
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Purchases
            </h2>
            <Link
              to={createPageUrl("Purchases")}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loadingPurchases ? (
            <p className="text-sm text-slate-400 py-6 text-center">Loading...</p>
          ) : purchases.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">
              No purchases yet
            </p>
          ) : (
            <div className="space-y-3">
              {purchases.map((purchase) => (
                <button
                  key={purchase.purchaseId}
                  onClick={() => handlePurchaseClick(purchase.purchaseId)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {purchase.supplier?.supplierName || `Purchase #${purchase.purchaseId}`}
                    </p>
                    <p className="text-xs text-slate-500">
                      {purchase.purchaseDate
                        ? format(new Date(purchase.purchaseDate), "MMM d, yyyy")
                        : "—"}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    £{(purchase.totalAmount || 0).toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Low Stock Alert */}
      {!loadingVariants && variants.some((v) => (v.quantity ?? 0) <= 5) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-amber-800 mb-3">
            Low Stock Alert
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {variants
              .filter((v) => (v.quantity ?? 0) <= 5)
              .map((v) => (
                <button
                  key={v.productVariantId}
                  type="button"
                  className="bg-white rounded-xl p-3 border border-amber-200 hover:border-amber-300 hover:bg-amber-50 transition-all text-left w-full"
                  onClick={() => handleVariantClick(v)}
                >
                  <p className="text-sm font-medium text-slate-700">{v.sku}</p>
                  <p className="text-xs text-slate-500">
                    {v.color} - Size {v.size}
                  </p>
                  <p className="text-sm font-bold text-amber-600 mt-1">
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