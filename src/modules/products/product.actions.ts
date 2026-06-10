"use server";

import dbConnect from "@/src/modules/shared/db";
import Product from "@/src/modules/products/product.model";
import { Product as ProductType } from "@/src/modules/shared/types";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: ProductType) {
  try {
    await dbConnect();

    const newProduct = await Product.create(formData);
    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    revalidatePath("/");
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
    const product = await Product.find({}).sort({ createdAt: -1 }).lean();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(product)),
    };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Помилка при отриманні товарів" };
  }
}

export async function updateProduct(
  id: string,
  formData: Partial<ProductType>,
) {
  try {
    await dbConnect();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: formData },
      { new: true, runValidators: true },
    );
    if (!updatedProduct) {
      return { success: false, error: "Товар не знайдено" };
    }
    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedProduct)),
    };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Помилка при оновленні товару" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await dbConnect();
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return { success: false, error: "Товар не знайдено" };
    }
    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(deletedProduct)),
    };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Помилка при видаленні товару" };
  }
}

export async function getProductById(id: string) {
  try {
    await dbConnect();
    const product = await Product.findById(id).lean();
    if (!product) {
      return { success: false, error: "Товар не знайдено" };
    }
    return {
      success: true,
      data: JSON.parse(JSON.stringify(product)),
    };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Помилка при отриманні товару" };
  }
}

export async function getCategoryCounts() {
  try {
    await dbConnect();
    const counts = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const countMap: Record<string, number> = {};
    counts.forEach((item) => {
      if (item._id) {
        countMap[item._id] = item.count;
      }
    });

    return { success: true, data: countMap };
  } catch (error) {
    console.log(error);
    return { success: false, data: {} };
  }
}
