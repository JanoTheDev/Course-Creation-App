import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { checkPermission } from '@/middleware/checkPermission';

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '800mb',
  },
};

export async function POST(request: Request) {
  try {
    const authCheck = await checkPermission(['admin', 'manage_courses'])(request);
    if (!authCheck.success) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Create unique filename
    const timestamp = Date.now();
    const safeFilename = file.name.replace(/\s+/g, '_');
    const filename = `${timestamp}-${safeFilename}`;

    // Get file data
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Store in MongoDB with file data
    const { db } = await connectToDatabase();
    const result = await db.collection('videos').insertOne({
      url: `${FRONTEND_URL}/api/videos/${filename}`,
      filename,
      originalName: file.name,
      uploadedAt: new Date(),
      data: buffer
    });

    return NextResponse.json({ 
      url: `${FRONTEND_URL}/api/videos/${filename}`,
      success: true 
    });

  } catch (error) {
    console.error('Video upload failed:', error);
    return NextResponse.json(
      { error: 'Failed to save video' },
      { status: 500 }
    );
  }
} 