import { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import {
  LayoutDashboard,
  Package,
  Truck,
  ShoppingCart,
  Receipt,
  TrendingUp,
  Wallet,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, page: "Dashboard" },
  { name: "Products", icon: Package, page: "Products" },
  { name: "Suppliers", icon: Truck, page: "Suppliers" },
  { name: "Purchases", icon: ShoppingCart, page: "Purchases" },
  { name: "Sales", icon: Receipt, page: "Sales" },
  { name: "Expenses", icon: Wallet, page: "Expenses" },
  { name: "Analytics", icon: TrendingUp, page: "Analytics" },
];

export default function Layout({ children, currentPageName }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <style>{`
        :root {
          --brand: #312e81;
          --brand-light: #4338ca;
          --accent: #d97706;
          --accent-light: #fbbf24;
        }
      `}</style>

      {/* Mobile overlay (accessible) */}
      {sidebarOpen && (
        <button
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-900 
        transform transition-transform duration-300 ease-out flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
              <span className="text-white font-black text-sm tracking-tight">TJ</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg tracking-tight">TJF</h1>
              <p className="text-indigo-300 text-[10px] uppercase tracking-[0.2em]">Stock Manager</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-indigo-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 mt-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-white/10 text-white shadow-lg shadow-indigo-950/50"
                      : "text-indigo-300 hover:text-white hover:bg-white/5"
                  }`}
              >
                <item.icon className={`w-[18px] h-[18px] ${isActive ? "text-amber-400" : ""}`} />
                <span>{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-amber-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 mx-3 mb-3 rounded-lg bg-white/5 border border-white/5">
          <p className="text-[11px] text-indigo-400 leading-relaxed">
            Modest Fashion Inventory
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-slate-100"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-amber-500 flex items-center justify-center">
              <span className="text-white font-black text-[10px]">TJ</span>
            </div>
            <span className="font-bold text-slate-800">TJF</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}