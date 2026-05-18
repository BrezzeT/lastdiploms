import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Users,
} from "lucide-react";

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
