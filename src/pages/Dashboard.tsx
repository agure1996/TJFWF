import { useQuery } from "@tanstack/react-query";
import { productService, variantService, supplierService, purchaseService, saleService } from '@/api/services';
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import PageHeader from "../components/shared/PageHeader";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: productsRes = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.list().then(r => r.data.data),
  });
  const products = productsRes ?? [];

  const { data: variantsRes = [] } = useQuery({
    queryKey: ["variants"],
    queryFn: () => variantService.listAll().then(r => r.data.data),
  });
  const variants = variantsRes ?? [];

  const { data: suppliersRes = [] } = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => supplierService.list().then(r => r.data.data),
  });
  const suppliers = suppliersRes ?? [];

  const { data: purchasesRes = [] } = useQuery({
    queryKey: ["purchases"],
    queryFn: () => purchaseService.list().then(r => r.data.data),
  });
  const purchases = (purchasesRes ?? []).slice(0, 5);

  const { data: salesRes = [] } = useQuery({
    queryKey: ["sales"],
    queryFn: () => saleService.list().then(r => r.data.data),
  });
  const sales = (salesRes ?? []).slice(0, 5);

  const totalStock = variants.reduce((sum, v) => sum + (v.quantity || 0), 0);
  const totalSalesAmount = sales.reduce((sum, s) => sum + (s.total || 0), 0);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your inventory and transactions"
        actions={undefined}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <p className="text-sm text-slate-500 font-medium">Products</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{products.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <p className="text-sm text-slate-500 font-medium">Total Stock</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{totalStock.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <p className="text-sm text-slate-500 font-medium">Suppliers</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{suppliers.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <p className="text-sm text-slate-500 font-medium">Revenue</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">£{totalSalesAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Sales</h2>
            <Link
              to={createPageUrl("Sales")}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {sales.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">No sales yet</p>
          ) : (
            <div className="space-y-3">
              {sales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Sale #{sale.id}
                    </p>
                    <p className="text-xs text-slate-400">
                      {sale.saleDate ? format(new Date(sale.saleDate), "MMM d, yyyy") : "—"}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    £{(sale.total || 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Purchases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Purchases</h2>
            <Link
              to={createPageUrl("Purchases")}
              className="text-sm text-[#8B7355] hover:text-[#6D5A45] font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {purchases.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">No purchases yet</p>
          ) : (
            <div className="space-y-3">
              {purchases.slice(0, 5).map((purchase) => (
                <div key={purchase.purchaseId} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Purchase #{purchase.purchaseId}
                    </p>
                    <p className="text-xs text-slate-400">
                      {purchase.purchaseDate ? format(new Date(purchase.purchaseDate), "MMM d, yyyy") : "—"}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    £{(purchase.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Low Stock Alert */}
      {variants.some(v => (v.quantity ?? 0) <= 5) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-amber-800 mb-3">Low Stock Alert</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {variants.filter(v => (v.quantity ?? 0) <= 5).map(v => (
              <div key={v.productVariantId} className="bg-white rounded-xl p-3 border border-amber-100">
                <p className="text-sm font-medium text-slate-700">{v.sku}</p>
                <p className="text-xs text-slate-500">{v.color} - Size {v.size}</p>
                <p className="text-sm font-bold text-amber-600 mt-1">{v.quantity} left</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}