import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

if (!process.env.JWT_SECRET) {
  throw new Error('Please add your JWT_SECRET to .env.local');
}

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validate the input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new user with default permissions
    const user = await db.collection('users').insertOne({
      name,
      email,
      password, // Make sure this is hashed before saving
      permissions: ['user'], // Default permissions
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.insertedId.toString(),
        permissions: ['user']
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    // Return user data (excluding password) and token
    return NextResponse.json({
      user: {
        _id: user.insertedId,
        name,
        email,
        permissions: ['user'],
        createdAt: new Date()
      },
      token
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
} 