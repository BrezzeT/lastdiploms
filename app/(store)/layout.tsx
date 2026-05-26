import FooterStore from "@/src/modules/layout/store/components/FooterStore";
import HeaderStore from "@/src/modules/layout/store/components/HeaderStore";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderStore />
      <main className="flex-1 relative max-w-7xl mx-auto w-full px-6 md:px-8 md:py-12 py-6">
        <div className="min-h-screen">{children}</div>
      </main>
      <FooterStore />
    </div>
  );
}
