import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { checkPermission } from '@/middleware/checkPermission';
import { ObjectId } from 'mongodb';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authCheck = await checkPermission(['admin'])(request);
    if (!authCheck.success) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: 401 }
      );
    }

    const { name, permissions, accessibleCourses } = await request.json();
    const { db } = await connectToDatabase();

    // Get the admin user's info from the auth check
    const adminUser = await db.collection('users').findOne(
      { _id: new ObjectId(authCheck.user!._id) }
    );

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 404 }
      );
    }

    // Convert course IDs to ObjectIds and add granted by info
    const coursesWithDates = (accessibleCourses || []).map((courseId: string) => ({
      courseId: new ObjectId(courseId),
      grantedBy: {
        userId: new ObjectId(adminUser._id),
        name: adminUser.name,
        email: adminUser.email
      },
      grantedAt: new Date()
    }));

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: {
          ...(name && { name }),
          permissions,
          accessibleCourses: coursesWithDates,
          updatedAt: new Date()
        } 
      }
    );

    if (!result.matchedCount) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updatedUser = await db.collection('users').findOne(
      { _id: new ObjectId(params.id) },
      { projection: { password: 0 } }
    );

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authCheck = await checkPermission(['admin'])(request);
    if (!authCheck.success) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();

    const result = await db.collection('users').deleteOne({
      _id: new ObjectId(params.id)
    });

    if (!result.deletedCount) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Failed to delete user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
} 