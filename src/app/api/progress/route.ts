import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { checkPermission, AuthCheckResult } from '@/middleware/checkPermission';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const authCheck = await checkPermission(['user'])(request) as AuthCheckResult;
    if (!authCheck.success) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }

    const { courseId, videoId, timestamp = 0, type = 'video' } = await request.json();
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

  

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Progress error:', error);
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Check authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    let userId: string;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();

    // Check if user has access to the course
    const user = await db.collection('users').findOne({
      _id: new ObjectId(userId)
    });

    const isAdmin = user?.permissions?.some((p: string) => ['admin', 'manage_courses'].includes(p));

    // Get course to check privacy
    const course = await db.collection('courses').findOne({
      _id: new ObjectId(courseId)
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check access
    const hasAccess = isAdmin || 
      course.privacy === 'public' || 
      user?.accessibleCourses?.some((ac: { courseId: string }) => 
        ac.courseId.toString() === courseId
      );

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Get progress data
    const progress = await db.collection('progress').findOne({
      userId: new ObjectId(userId),
      courseId: new ObjectId(courseId)
    });

    return NextResponse.json({
      progress: progress?.progress || [],
      lastAccessed: progress?.lastAccessed || null
    });
  } catch (error) {
    console.error('Failed to fetch progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
} 