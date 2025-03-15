// app/api/recipients/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Initialize Prisma client
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Get the user session to verify authentication
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the user ID from the session
    const userEmail = session.user.email as string;
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Parse the request body
    const body = await req.json();
    const { name, birthday, age, gender, interests, likes, budget } = body;
    
    // Validate required fields
    if (!name || !birthday) {
      return NextResponse.json(
        { message: 'Name and birthday are required' },
        { status: 400 }
      );
    }
    
    // Create the recipient
    const recipient = await prisma.recipient.create({
      data: {
        name,
        birthday: new Date(birthday),
        age,
        gender,
        // Convert arrays to comma-separated strings for SQLite
        interests: Array.isArray(interests) ? interests.join(',') : interests,
        likes: Array.isArray(likes) ? likes.join(',') : likes,
        budget,
        userId: user.id,
      },
    });
    
    // Return success response
    return NextResponse.json(recipient, { status: 201 });
    
  } catch (error) {
    console.error('Error creating recipient:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    // Always disconnect Prisma client to avoid connection leaks
    await prisma.$disconnect();
  }
}