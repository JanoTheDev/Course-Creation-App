import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';

// Set correct response size limit
export const config = {
  api: {
    responseLimit: '10mb',
    bodyParser: false // Important: disable default body parser
  }
};

export async function POST(request: Request) {
  let db;
  
  try {
    // Read the stream manually
    const data = await request.formData();
    const file = data.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Connect to MongoDB
    try {
      const dbConnection = await connectToDatabase();
      db = dbConnection.db;
    } catch (dbConnectError) {
      console.error('MongoDB connection error:', dbConnectError);
      return NextResponse.json(
        { error: 'Failed to connect to database' },
        { status: 500 }
      );
    }

    // Store image in MongoDB
    const result = await db.collection('images').insertOne({
      contentType: file.type,
      data: base64Image,
      createdAt: new Date()
    });

    if (!result.acknowledged) {
      throw new Error('Failed to insert image into database');
    }

    // Create CDN-like URL using the MongoDB generated _id
    const imageUrl = `/api/images/${result.insertedId}`;
    return NextResponse.json({ url: imageUrl });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to upload file',
        details: error 
      },
      { status: 500 }
    );
  }
} 