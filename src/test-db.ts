import 'dotenv/config';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

async function test() {
  await client.connect();
  console.log("✅ Connected!");
  const db = client.db("aml_onlinestore");
  const users = await db.collection("users").find().toArray();
  console.log(users);
  await client.close();
}

test().catch(console.error);
