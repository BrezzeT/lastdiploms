import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderRedirectPage({ params }: PageProps) {
  const { id } = await params;
  redirect(`/orders?id=${id}`);
}
