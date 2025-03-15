// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Initialize Prisma client
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { name, email, password } = body;
    
    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });
    
    // Return success response (excluding the password hash)
    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error during user registration:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    // Always disconnect Prisma client to avoid connection leaks
    await prisma.$disconnect();
  }
}