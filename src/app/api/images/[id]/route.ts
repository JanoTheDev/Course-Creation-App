import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();

    // Validate if the ID is a valid ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid image ID' },
        { status: 400 }
      );
    }

    const image = await db.collection('images').findOne({
      _id: new ObjectId(params.id)
    });

    if (!image) {
      console.error('Image not found:', params.id);
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Convert base64 back to buffer
    const buffer = Buffer.from(image.data, 'base64');

    // Return image with proper content type
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': image.contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Failed to fetch image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
} 