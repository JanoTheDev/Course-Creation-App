import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const { db } = await connectToDatabase();

    // Find user and include password and permissions
    const user = await db.collection('users').findOne(
      { email: email.toLowerCase() },
      { projection: { password: 1, permissions: 1, name: 1, email: 1 } }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create token
    const token = jwt.sign(
      {
        userId: user._id,
        permissions: user.permissions || ['user'],
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data and token
    return NextResponse.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        permissions: user.permissions || ['user'],
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 