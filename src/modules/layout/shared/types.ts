export type Product = {
  _id?: string;
  name: string;
  slug: string;
  price: number;
  images?: string[];
  category: string;
  brand: string;
  color: string;
  stock: number;
  sku?: string;
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
};

export type Order = {
  _id?: string;
  userId?: string;
  address: string;
  phone: string;
  comment?: string;
  items: OrderItem[];
  paymentStatus: "balance" | "cash";
  totalAmount: number;
  createdAt?: Date;
  status?: OrderStatus;
};

export type UserRole = "user" | "admin";

export type User = {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  balance: number;
  createdAt?: Date;
  avatar: string;
};

export type CartItem = {
  productId: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  color?: string;
  stock: number;
};
