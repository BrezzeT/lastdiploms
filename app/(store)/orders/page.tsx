import { notFound } from "next/navigation";
import { getOrderById } from "@/src/modules/orders/order.actions";
import UserOrders from "@/src/modules/profile/UserOrders";

type PageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function OrderPage({ searchParams }: PageProps) {
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  const res = await getOrderById(id);

  if (!res.success || !res.data) {
    notFound();
  }

  return <UserOrders order={res.data} />;
}
