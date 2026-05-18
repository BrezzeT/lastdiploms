"use server";

import dbConnect from "../db";
import Product from "@/src/models/Product";
import { Product as ProductType } from "@/src/types";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: ProductType) {
  try {
    await dbConnect();
    const newProduct = await Product.create(formData);
    revalidatePath("/admin/products");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(newProduct)),
    };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Помилка при створенні товару" };
  }
}
export async function getProducts() {
  try {
    await dbConnect();
    const product = await Product.find({}).sort({ createdAt: -1 });
    return {
      success: true,
      data: JSON.parse(JSON.stringify(product)),
    };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Помилка при отриманні товарів" };
  }
}
