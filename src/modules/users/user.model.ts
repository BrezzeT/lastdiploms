import { Schema, models, model, Model } from "mongoose";
import { User as UserType } from "@/src/modules/shared/types";

const UserSchema = new Schema<UserType>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    avatar: { type: String, default: "" },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true },
);

if (process.env.NODE_ENV === "development") {
  delete models.User;
}

const User =
  (models.User as Model<UserType>) || model<UserType>("User", UserSchema);

export default User;
