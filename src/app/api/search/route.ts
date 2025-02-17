import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const { db } = await connectToDatabase();

    // Search only courses
    const courses = await db.collection('courses')
      .aggregate([
        {
          $match: {
            $or: [
              { title: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } }
            ],
            privacy: { $in: ['public', 'unlisted'] }
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            image: 1,
            type: { $literal: 'course' }
          }
        },
        { $limit: 8 }
      ]).toArray();

    return NextResponse.json({ results: courses });
  } catch (error) {
    console.error('Search failed:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
} 