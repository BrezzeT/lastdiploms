"use client";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import AdminHeader from "@/src/components/admin/AdminHeader";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.includes("products")) return "Керування товарами";
    if (pathname.includes("orders")) return "Замовлення";
    if (pathname.includes("analytics")) return "Аналітика та звіти";
    if (pathname.includes("settings")) return "Налаштування системи";
    return "Огляд дашборду";
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <AdminHeader title={getTitle()} />
        <main className="flex-1 p-6 relative ">
          <div className="max-w-7xl mx-auto ">
            <div className="mt-2">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
