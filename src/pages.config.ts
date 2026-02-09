
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import Purchases from './pages/Purchases';
import Sales from './pages/Sales';
import Analytics from './pages/Analytics';
import Expenses from './pages/Expenses';
import __Layout from './Layout.js';


export const PAGES = {
    "Dashboard": Dashboard,
    "Products": Products,
    "Suppliers": Suppliers,
    "Purchases": Purchases,
    "Sales": Sales,
    "Analytics": Analytics,
    "Expenses": Expenses,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};