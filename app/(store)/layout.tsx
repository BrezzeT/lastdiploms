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
      <main className="flex-1 relative container mx-auto px-4 py-6">
        {children}
      </main>
      <FooterStore />
    </div>
  );
}
