import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../lib/mongodb.js';

// Initial data to seed if DB is empty
const INITIAL_WEIGHT_DATA = [
  { date: '2025-10-23', weight: 1100 },
  { date: '2025-10-29', weight: 1370 },
  { date: '2025-11-07', weight: 1460 },
  { date: '2025-11-10', weight: 1625 },
  { date: '2025-11-15', weight: 1765 },
  { date: '2025-11-20', weight: 2120 },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { key } = req.query;
  
  if (key !== process.env.ACCESS_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const client = await clientPromise;
    const db = client.db("finik_tracker");
    const collection = db.collection("weights");

    if (req.method === 'GET') {
      const count = await collection.countDocuments();
      if (count === 0) {
        // Seed initial data
        await collection.insertMany(INITIAL_WEIGHT_DATA);
      }

      const weights = await collection.find({}).sort({ date: 1 }).toArray();
      const formatted = weights.map(w => ({ ...w, id: w._id.toString() }));
      return res.status(200).json(formatted);
    }

    if (req.method === 'POST') {
      const newRecord = req.body;
      delete newRecord.id;
      const result = await collection.insertOne(newRecord);
      return res.status(201).json({ ...newRecord, id: result.insertedId.toString() });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      const { ObjectId } = await import('mongodb');
      
      if (typeof id === 'string') {
        await collection.deleteOne({ _id: new ObjectId(id) });
        return res.status(200).json({ success: true });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database error' });
  }
}