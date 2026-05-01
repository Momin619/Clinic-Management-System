import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends mongoose.Document {
  name: string;
  email: string;
  password: string;
}

const adminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const Admin = mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;
