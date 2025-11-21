import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { key } = req.query;
  
  // Auth Check
  if (key !== process.env.ACCESS_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const client = await clientPromise;
    const db = client.db("finik_tracker");
    const collection = db.collection("events");

    if (req.method === 'GET') {
      const events = await collection.find({}).toArray();
      // Map _id to id for frontend compatibility
      const formattedEvents = events.map(e => ({ ...e, id: e._id.toString() }));
      return res.status(200).json(formattedEvents);
    }

    if (req.method === 'POST') {
      const newEvent = req.body;
      delete newEvent.id; // Let Mongo generate ID
      const result = await collection.insertOne(newEvent);
      return res.status(201).json({ ...newEvent, id: result.insertedId.toString() });
    }

    if (req.method === 'PUT') {
      const { id, ...updateData } = req.body;
      // Need to import ObjectId dynamically or use string if stored as string, 
      // but normally Mongo uses ObjectId. For simplicity in this lightweight app, 
      // we assume the frontend sends the ID which we use to match the _id (as ObjectId)
      const { ObjectId } = await import('mongodb');
      
      await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      return res.status(200).json({ success: true });
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