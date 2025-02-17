import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Course from '@/models/Course';
import { checkPermission } from '@/middleware/checkPermission';

// GET single course
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const permissionCheck = await checkPermission(['admin', 'manage_courses'])(request);
    if (permissionCheck.success !== true) {
      return permissionCheck;
    }

    await connectToDatabase();
    const course = await Course.findById(params.id)
      .populate('mainInstructor', 'name')
      .populate('collaborators', 'name');

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// UPDATE course
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const permissionCheck = await checkPermission(['admin', 'manage_courses'])(request);
    if (permissionCheck.success !== true) {
      return permissionCheck;
    }

    const updates = await request.json();
    await connectToDatabase();

    const course = await Course.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('mainInstructor', 'name')
      .populate('collaborators', 'name');

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE course
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const permissionCheck = await checkPermission(['admin', 'manage_courses'])(request);
    if (permissionCheck.success !== true) {
      return permissionCheck;
    }

    await connectToDatabase();
    const course = await Course.findByIdAndDelete(params.id);

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
} 