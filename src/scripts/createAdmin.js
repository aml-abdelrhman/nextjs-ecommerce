import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to DB");

    const email = "admin@site.com";
    const password = "123456";

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log("✅ Admin already exists");
      process.exit(0);
    }

    // هنا نخلي password plain، لأن الـ pre-save hash موجود في ال-schema
    await Admin.create({
      name: "Super Admin",
      email,
      password,
    });

    console.log("✅ Admin created successfully");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to create admin:", err);
    process.exit(1);
  }
}

createAdmin();
