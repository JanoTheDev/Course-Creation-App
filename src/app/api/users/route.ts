import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { checkPermission } from '@/middleware/checkPermission';

export async function GET(request: Request) {
  try {
    // Check if user has admin permission
    const authCheck = await checkPermission(['admin'])(request);
    if (!authCheck.success) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    const { db } = await connectToDatabase();

    // Build search query
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    // Get users with pagination and search
    const [users, total] = await Promise.all([
      db.collection('users')
        .find(query)
        .project({ password: 0 }) // Exclude password field
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection('users').countDocuments(query),
    ]);

    // Ensure each user has permissions
    const usersWithPermissions = users.map(user => ({
      ...user,
      permissions: user.permissions || ['user']
    }));

    return NextResponse.json({
      users: usersWithPermissions,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    if (error instanceof Error && error.message.includes('buffering timed out')) {
      return NextResponse.json(
        { error: 'Database connection timed out. Please try again.' },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 