import { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { useTheme } from "./ThemeContext";
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
  Sun,
  Moon,
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
  const { darkMode, setDarkMode } = useTheme();

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-neutral-900' : 'bg-stone-50'}`}>
      <style>{`
        :root {
          --brand-beige: #8B7355;
          --brand-taupe: #7A6854;
          --brand-light: #A39180;
          --accent-cream: #E8DDD0;
        }
      `}</style>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 
        ${darkMode 
          ? 'bg-gradient-to-b from-neutral-900 via-stone-900 to-neutral-950' 
          : 'bg-gradient-to-b from-[#8B7355] via-[#7A6854] to-[#6B5D4F] border-r border-[#9B8577]/20'
        }
        transform transition-transform duration-300 ease-out flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex flex-col">
            {/* Large TJF monogram */}
            <div className="relative mb-3">
              <span 
                className={`text-6xl font-serif tracking-tighter leading-none
                ${darkMode ? 'text-[#8B7355]/30' : 'text-white/20'}`}
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                TJF
              </span>
            </div>
            
            {/* Brand name */}
            <h1 
              className={`text-[11px] font-light tracking-[0.35em] uppercase leading-tight
              ${darkMode ? 'text-[#E8DDD0]' : 'text-white/95'}`}
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              The Jilbaab Factory
            </h1>          
          </div>
          
          <button
            onClick={() => setSidebarOpen(false)}
            className={`lg:hidden ${darkMode ? 'text-[#A39180] hover:text-white' : 'text-white/70 hover:text-white'}`}
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
                    darkMode
                      ? isActive
                        ? "bg-[#8B7355]/20 text-[#E8DDD0] shadow-lg"
                        : "text-[#A39180] hover:text-[#E8DDD0] hover:bg-white/5"
                      : isActive
                        ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
              >
                <item.icon className={`w-[18px] h-[18px] ${
                  darkMode 
                    ? isActive ? "text-[#E8DDD0]" : ""
                    : isActive ? "text-white" : ""
                }`} />
                <span>{item.name}</span>
                {isActive && (
                  <ChevronRight className={`w-4 h-4 ml-auto ${darkMode ? 'text-[#E8DDD0]' : 'text-white'}`} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Compact Dark Mode Toggle */}
        <div className={`mx-3 mb-3 p-2.5 rounded-lg ${darkMode ? 'bg-white/5 border border-white/5' : 'bg-white/10 backdrop-blur-sm border border-white/20'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${darkMode ? 'text-[#A39180]' : 'text-white/80'}`}>
              Theme
            </span>
            
            {/* Compact Toggle Switch */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-12 h-6 rounded-full transition-all duration-300
                ${darkMode 
                  ? 'bg-[#8B7355]' 
                  : 'bg-white/30'
                }`}
              aria-label="Toggle dark mode"
            >
              {/* Sliding circle */}
              <div className={`absolute top-0.5 transition-all duration-300 ease-out
                ${darkMode ? 'left-[26px]' : 'left-0.5'}
                w-5 h-5 rounded-full flex items-center justify-center
                ${darkMode 
                  ? 'bg-neutral-900 shadow-lg' 
                  : 'bg-white shadow-md'
                }`}
              >
                {darkMode ? (
                  <Moon className="w-3 h-3 text-[#E8DDD0]" />
                ) : (
                  <Sun className="w-3 h-3 text-[#8B7355]" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 mx-3 mb-3 rounded-lg ${darkMode ? 'bg-white/5 border border-white/5' : 'bg-white/10 backdrop-blur-sm border border-white/20'}`}>
          <p className={`text-[11px] leading-relaxed ${darkMode ? 'text-[#A39180]' : 'text-white/80'}`}>
            TJF &copy; 2024. All rights reserved.
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className={`lg:hidden ${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-stone-200'} border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-30`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-stone-100'}`}
          >
            <Menu className={`w-5 h-5 ${darkMode ? 'text-[#A39180]' : 'text-[#7A6854]'}`} />
          </button>
         
          {/* Mobile dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`ml-auto p-2 rounded-lg ${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-stone-100'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Moon className="w-5 h-5 text-[#8B7355]" />
            ) : (
              <Sun className="w-5 h-5 text-[#8B7355]" />
            )}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
