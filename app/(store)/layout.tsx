import FooterStore from "@/src/components/store/FooterStore";
import HeaderStore from "@/src/components/store/HeaderStore";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderStore />
      <main className="flex-1 relative max-w-7xl mx-auto w-full px-6 md:px-8 py-6">
        {children}
      </main>
      <FooterStore />
    </div>
  );
}
