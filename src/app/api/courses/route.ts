import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { checkPermission } from '@/middleware/checkPermission';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

interface AccessibleCourse {
  courseId: string;
}

export async function POST(request: Request) {
  try {
    const authCheck = await checkPermission(['admin', 'manage_courses'])(request);
    if (!authCheck.success) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Enforce private status for paid courses
    if (data.price > 0) {
      data.privacy = 'private';
    }

    // Validate required fields
    if (!data.title || !data.description || !data.image || !data.instructorName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db.collection('courses').insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      _id: result.insertedId,
      ...data
    });
  } catch (error) {
    console.error('Failed to create course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase();
    
    // Get user from token
    const authHeader = request.headers.get('Authorization');
    let isAdmin = false;
    let userAccessibleCourses: string[] = [];

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        const user = await db.collection('users').findOne({ 
          _id: new ObjectId(decoded.userId)
        });
        
        isAdmin = user?.permissions?.includes('admin') || false;
        userAccessibleCourses = (user?.accessibleCourses || []).map(
          (ac: { courseId: ObjectId | string }) => 
            ac.courseId instanceof ObjectId ? ac.courseId.toString() : ac.courseId
        );
      } catch (error) {
        console.error('Token verification failed:', error);
      }
    }

    const courses = await db.collection('courses')
      .find({ privacy: 'public' })
      .sort({ createdAt: -1 })
      .toArray();

    const coursesWithAccess = courses.map(course => ({
      ...course,
      hasAccess: course.price === 0 || isAdmin || userAccessibleCourses.includes(course._id.toString())
    }));

    return NextResponse.json({
      courses: coursesWithAccess,
      total: courses.length,
    });

  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}