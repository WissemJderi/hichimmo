import { MongoClient, ObjectId } from "mongodb";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const uri = process.env.MONGODB_URI as string;

let clientPromise: Promise<MongoClient>;

if (!(global as any)._mongoClientPromise) {
  const client = new MongoClient(uri);
  (global as any)._mongoClientPromise = client.connect();
}
clientPromise = (global as any)._mongoClientPromise;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const start = Date.now();
  const client = await clientPromise;
  console.log("DB connected in", Date.now() - start, "ms");

  const db = client.db("test");
  const collection = db.collection("properties");

  const { id, location, type } = req.query;

  // GET single property by id
  if (id) {
    const queryStart = Date.now();
    const property = await collection.findOne({
      _id: new ObjectId(id as string),
    });
    console.log("getById query took", Date.now() - queryStart, "ms");
    return res.status(200).json(property);
  }

  // GET filtered properties
  if (location || type) {
    const filter: Record<string, unknown> = {};
    if (location && location !== "none") filter.location = location;
    if (type && type !== "none") filter.type = type;
    const queryStart = Date.now();
    const properties = await collection.find(filter).toArray();
    console.log("search query took", Date.now() - queryStart, "ms");
    return res.status(200).json(properties);
  }

  // GET all properties
  const queryStart = Date.now();
  const properties = await collection.find({}).toArray();
  console.log("getAll query took", Date.now() - queryStart, "ms");

  return res.status(200).json(properties);
}
