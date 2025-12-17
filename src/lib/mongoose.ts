import mongoose from "mongoose";

let isConnected = false;

export async function mongooseConnect() {
  if (isConnected) {
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("❌ MONGODB_URI is missing in .env");
  }

  try {
    const db = await mongoose.connect(uri);
    isConnected = db.connections[0].readyState === 1;

    console.log("🔥 Mongoose Connected Successfully!");
  } catch (error) {
    console.error("❌ Mongoose Connection Error:", error);
    throw error;
  }
}
