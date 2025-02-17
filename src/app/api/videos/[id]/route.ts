import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    let videoDoc;

    // Find video document
    if (params.id.includes('.mp4')) {
      videoDoc = await db.collection('videos').findOne({
        filename: params.id
      });
    } else {
      try {
        videoDoc = await db.collection('videos').findOne({
          _id: new ObjectId(params.id)
        });
      } catch (e) {
        return NextResponse.json(
          { error: 'Invalid video ID' },
          { status: 400 }
        );
      }
    }

    if (!videoDoc) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    if (!videoDoc.data) {
      return NextResponse.json(
        { error: 'Video data not found' },
        { status: 404 }
      );
    }

    const buffer = videoDoc.data.buffer;
    const fileSize = buffer.length;
    const range = request.headers.get('range');

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const chunk = buffer.slice(start, end + 1);

      return new Response(chunk, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': 'video/mp4'
        }
      });
    }

    return new Response(buffer, {
      headers: {
        'Content-Length': fileSize.toString(),
        'Content-Type': 'video/mp4'
      }
    });

  } catch (error) {
    console.error('Error serving video:', error);
    return NextResponse.json(
      { error: 'Failed to serve video' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    
    // Delete from database
    const result = await db.collection('videos').deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    console.error('Failed to delete video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
} 