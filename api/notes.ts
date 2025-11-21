import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../lib/mongodb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { key } = req.query;

  if (key !== process.env.ACCESS_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const client = await clientPromise;
    const db = client.db("finik_tracker");
    const collection = db.collection("notes");

    if (req.method === 'GET') {
      const notes = await collection.find({}).toArray();
      const formattedNotes = notes.map(n => ({ ...n, id: n._id.toString() }));
      return res.status(200).json(formattedNotes);
    }

    if (req.method === 'POST') {
      const newNote = req.body;
      delete newNote.id;
      const result = await collection.insertOne(newNote);
      return res.status(201).json({ ...newNote, id: result.insertedId.toString() });
    }

    if (req.method === 'PUT') {
      const { id, ...updateData } = req.body;
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