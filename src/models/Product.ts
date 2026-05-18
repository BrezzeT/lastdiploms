import { Schema, model, models, Model } from "mongoose";
import { Product as ProductType } from "@/src/types";

const ProductSchema = new Schema<ProductType>(
  {
    name: {
      type: String,
      required: [true, "Введіть назву товару"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Введіть slug"],
      unique: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: [true, "Введіть ціну"],
      min: [0, "Ціна не може бути від'ємною"],
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, "Виберіть категорію"],
    },
    brand: {
      type: String,
    },
    color: {
      type: String,
    },
    stock: {
      type: Number,
      required: [true, "Введіть кількість на складі"],
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Product =
  (models.Product as Model<ProductType>) ||
  model<ProductType>("Product", ProductSchema);

export default Product;
