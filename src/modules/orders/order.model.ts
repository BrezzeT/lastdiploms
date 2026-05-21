import { Schema, model, models, Model } from "mongoose";
import { Order as OrderType } from "@/src/modules/layout/shared/types";

const OrderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String },
});

const OrderSchema = new Schema<OrderType>(
  {
    userId: {
      type: String,
      ref: "User",
    },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    comment: { type: String },
    items: [OrderItemSchema],
    paymentStatus: {
      type: String,
      enum: ["balance", "cash"],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const Order =
  (models.Order as Model<OrderType>) || model<OrderType>("Order", OrderSchema);

export default Order;
