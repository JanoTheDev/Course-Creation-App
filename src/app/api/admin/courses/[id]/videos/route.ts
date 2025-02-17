import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Course from '@/models/Course';
import { checkPermission } from '@/middleware/checkPermission';

// Add video to course
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authCheck = await checkPermission(['admin', 'manage_courses'])(request);
    if (!authCheck.success) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: 401 }
      );
    }

    const videoData = await request.json();
    await connectToDatabase();

    const course = await Course.findById(params.id);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    course.videos.push(videoData);
    await course.save();

    return NextResponse.json(course.videos[course.videos.length - 1], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add video' },
      { status: 500 }
    );
  }
}

// Update video order
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authCheck = await checkPermission(['admin', 'manage_courses'])(request);
    if (!authCheck.success) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: 401 }
      );
    }

    const { videos } = await request.json();
    await connectToDatabase();
    console.log(params.id)
    const course = await Course.findById(params.id);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    course.videos = videos;
    await course.save();

    return NextResponse.json(course.videos);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update videos' },
      { status: 500 }
    );
  }
} 