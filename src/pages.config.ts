import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import Purchases from './pages/Purchases';
import Sales from './pages/Sales';
import Analytics from './pages/Analytics';
import Expenses from './pages/Expenses';
import __Layout from './Layout.js';

// Explicitly type the Pages object
export const PAGES = {
  Dashboard,
  Products,
  Suppliers,
  Purchases,
  Sales,
  Analytics,
  Expenses,
} as const;

// Derive a type for the keys
export type PageKey = keyof typeof PAGES;

export const pagesConfig: {
  mainPage: PageKey;
  Pages: typeof PAGES;
  Layout: typeof __Layout;
} = {
  mainPage: "Dashboard",
  Pages: PAGES,
  Layout: __Layout,
};
