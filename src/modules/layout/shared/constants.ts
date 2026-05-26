import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Users,
} from "lucide-react";
import { Order, OrderStatus } from "./types";

export const ADMIN_MENU_ITEMS = [
  { label: "Дашборд", href: "/admin", icon: LayoutDashboard },
  { label: "Товари", href: "/admin/products", icon: Package },
  { label: "Замовлення", href: "/admin/orders", icon: ShoppingCart },
  { label: "Користувачі", href: "/admin/users", icon: Users },
  { label: "Аналітика", href: "/admin/analytics", icon: BarChart3 },
  { label: "Налаштування", href: "/admin/settings", icon: Settings },
];

export const PRODUCT_CATEGORIES = [
  {
    id: "phones",
    label: "Смартфони",
    subcategories: ["Apple", "Samsung", "Xiaomi", "Google", "OnePlus"],
  },
  {
    id: "laptops",
    label: "Ноутбуки",
    subcategories: ["MacBook", "Asus", "Dell", "HP", "Lenovo", "Acer"],
  },
  {
    id: "audio",
    label: "Аудіо",
    subcategories: ["AirPods", "Sony", "JBL", "Marshall", "Sennheiser"],
  },
  {
    id: "accessories",
    label: "Аксесуари",
    subcategories: ["Чохли", "Зарядки", "Кабелі", "PowerBank"],
  },
];

export const PRODUCT_COLORS = [
  { name: "Space Gray", hex: "#4b4b4b" },
  { name: "Silver", hex: "#c0c0c0" },
  { name: "Midnight", hex: "#191970" },
  { name: "Starlight", hex: "#f0f0e0" },
  { name: "Purple", hex: "#a020f0" },
  { name: "Blue", hex: "#0000ff" },
  { name: "Green", hex: "#008000" },
  { name: "Red", hex: "#ff0000" },
  { name: "Gold", hex: "#ffd700" },
];
export const PROFILE_MENU_ITEMS = [
  { label: "Мої замовлення", href: "/profile/orders", icon: ShoppingCart },
  { label: "Налаштування", href: "/profile/settings", icon: Settings },
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Очікується",
  paid: "Оплачено",
  shipped: "В дорозі",
  delivered: "Доставлено",
  cancelled: "Скасовано",
};
export const ORDER_STATUS_STYLES_STORE: Record<OrderStatus, string> = {
  pending: "text-amber-600 bg-amber-50 border-amber-200",
  paid: "text-emerald-600 bg-emerald-50 border-emerald-200",
  shipped: "text-blue-600 bg-blue-50 border-blue-200",
  delivered: "text-indigo-600 bg-indigo-50 border-indigo-200",
  cancelled: "text-red-600 bg-red-50 border-red-200",
};
export const ORDER_STATUS_STYLES_ADMIN: Record<OrderStatus, string> = {
  pending: "text-amber-400 bg-amber-500/10 border-amber-500/15",
  paid: "text-emerald-400 bg-emerald-500/10 border-emerald-500/15",
  shipped: "text-blue-400 bg-blue-500/10 border-blue-500/15",
  delivered: "text-indigo-400 bg-indigo-500/10 border-indigo-500/15",
  cancelled: "text-rose-400 bg-rose-500/10 border-rose-500/15",
};
export const PAYMENT_LABELS = {
  balance: "Баланс",
  cash: "Готівка",
} as const;
