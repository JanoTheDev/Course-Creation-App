import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Course from '@/models/Course';
import { checkPermission } from '@/middleware/checkPermission';

// GET all courses for admin
export async function GET(request: Request) {
  try {
    // Check admin permissions
    const permissionCheck = await checkPermission(['admin', 'manage_courses'])(request);
    if (permissionCheck.success !== true) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 401 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Fetch all courses with basic data
    const courses = await db.collection('courses').find({}).toArray();

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Admin courses endpoint error:', error);

    // Handle specific database errors
    if (error instanceof Error) {
      if (
        error.name === 'MongooseError' || 
        error.message?.includes('buffering timed out') || 
        error.message?.includes('failed to connect')
      ) {
        return NextResponse.json(
          { error: 'Database connection error. Please try again.' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch courses. Please try again later.' },
      { status: 500 }
    );
  }
}

// POST new course
export async function POST(request: Request) {
  try {
    // Check admin permissions
    const permissionCheck = await checkPermission(['admin', 'manage_courses'])(request);
    if (permissionCheck.success !== true) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 401 }
      );
    }

    // Parse request body
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'instructorName', 'image'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Create new course with timestamp
    const courseData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('courses').insertOne(courseData);
    const newCourse = await db.collection('courses').findOne({ _id: result.insertedId });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error('Failed to create course:', error);

    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid course data provided' },
        { status: 400 }
      );
    }

    // Handle database connection errors
    if (
      error instanceof Error && 
      (error.name === 'MongooseError' || 
       error.message?.includes('buffering timed out') || 
       error.message?.includes('failed to connect'))
    ) {
      return NextResponse.json(
        { error: 'Database connection error. Please try again.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create course. Please try again later.' },
      { status: 500 }
    );
  }
}