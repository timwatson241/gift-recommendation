// app/api/recipients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Initialize Prisma client
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
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
    
    // Get the user email from the session
    const userEmail = session.user.email as string;
    
    // Get user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get all recipients for the user
    const recipients = await prisma.recipient.findMany({
      where: { userId: user.id },
      orderBy: {
        // Order by closest upcoming birthday
        birthday: 'asc',
      },
    });
    
    // Return the recipients
    return NextResponse.json(recipients);
    
  } catch (error) {
    console.error('Error fetching recipients:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    // Always disconnect Prisma client to avoid connection leaks
    await prisma.$disconnect();
  }
}