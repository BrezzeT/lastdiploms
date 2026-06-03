"use server";

import dbConnect from "@/src/modules/shared/db";
import User from "@/src/modules/users/user.model";
import bcrypt from "bcryptjs";
import { User as UserType } from "@/src/modules/shared/types";
import { revalidatePath } from "next/cache";

export async function registerUser(formData: UserType) {
  try {
    await dbConnect();
    const { name, email, password } = formData;

    if (!password) return { success: false, error: "Пароль обов'язковий" };

    const userExists = await User.findOne({ email });
    if (userExists) {
      return { success: false, error: "Користувач з таким email вже існує" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
      balance: 0,
    });
    await newUser.save();

    return { success: true, data: JSON.parse(JSON.stringify(newUser)) };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Помилка при реєстрації" };
  }
}

export async function loginUser(formData: { email: string; password: string }) {
  try {
    await dbConnect();
    const { email, password } = formData;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return { success: false, error: "Користувача з таким email не знайдено" };
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      return { success: false, error: "Невірний пароль" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Помилка при вході" };
  }
}

export async function getAllUsers() {
  try {
    await dbConnect();
    const users = await User.find().sort({ createdAt: -1 });
    return { success: true, data: JSON.parse(JSON.stringify(users)) };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Помилка при отриманні користувачів" };
  }
}

export async function updateUserBalance(userId: string, amount: number) {
  try {
    await dbConnect();
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { balance: amount },
      { new: true },
    );
    if (!updateUser) {
      return { success: false, error: "Користувача не знайдено" };
    }
    revalidatePath("/checkout");
    revalidatePath("/(store)");
    return { success: true, data: JSON.parse(JSON.stringify(updateUser)) };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Помилка при обновленні балансу" };
  }
}

export async function getUserBalance(userId: string) {
  try {
    await dbConnect();
    const user = await User.findById(userId).select("balance");
    return { success: true, data: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Помилка при отриманні балансу" };
  }
}
export async function updateUserProfile(
  userId: string,
  data: { name: string; avatar?: string },
) {
  try {
    await dbConnect();
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true },
    );
    if (!updatedUser) {
      return { success: false, error: "Користувача не знайдено" };
    }
    return { success: true, data: JSON.parse(JSON.stringify(updatedUser)) };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Помилка при оновленні профілю" };
  }
}
