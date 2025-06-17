// import mongoose, { Schema, models, model } from "mongoose";
// import bcrypt from "bcryptjs";

// export interface IUser {
//     email: string,
//     password: string,
//     phone: string,
//     _id?: mongoose.Types.ObjectId;
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// const userSchema = new Schema<IUser>({
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     phone: {
//         type: String, required: true,
//         validate: {
//             validator: function (v: string) {
//                 return /^\+?[1-9]\d{1,14}$/.test(v); // E.164 international phone format
//             },
//             message: (props: any) => `${props.value} is not a valid phone number`
//         }
//     }
// }, { timestamps: true });

// userSchema.pre("save", async function (next) {
//     if (this.isModified("password")) {
//         this.password = await bcrypt.hash(this.password, 10)
//     }
//     next()
// });

// const User = models?.User || model<IUser>("User", userSchema)

// export default User

import { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  name?: string;
  email: string;
  image?: string;
  password?: string; // optional for social logins
  role: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for social login
    image: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = models?.User || model<IUser>("User", userSchema);
export default User;
