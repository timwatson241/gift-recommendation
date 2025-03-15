// app/api/recipients/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Initialize Prisma client
const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the recipient ID from params
    const recipientId = params.id;
    
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
    
    // Get the recipient by ID
    const recipient = await prisma.recipient.findUnique({
      where: { 
        id: recipientId,
      },
    });
    
    // If recipient not found or doesn't belong to the user
    if (!recipient || recipient.userId !== user.id) {
      return NextResponse.json(
        { message: 'Recipient not found' },
        { status: 404 }
      );
    }
    
    // Debug logging for fetched recipient
    console.log('Fetched Recipient:', {
      ...recipient,
      birthdayStored: recipient.birthday,
      birthdayUTC: recipient.birthday.toUTCString(),
      birthdayLocalized: recipient.birthday.toLocaleString(),
      birthdayISO: recipient.birthday.toISOString(),
    });
    
    // Return the recipient data
    return NextResponse.json(recipient);
    
  } catch (error) {
    console.error('Error fetching recipient:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    // Always disconnect Prisma client to avoid connection leaks
    await prisma.$disconnect();
  }
}