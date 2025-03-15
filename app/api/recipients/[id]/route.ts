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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
    
    // Check if the recipient exists and belongs to the user
    const existingRecipient = await prisma.recipient.findUnique({
      where: { id: recipientId },
    });
    
    if (!existingRecipient || existingRecipient.userId !== user.id) {
      return NextResponse.json(
        { message: 'Recipient not found' },
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
    
    // Update the recipient
    const updatedRecipient = await prisma.recipient.update({
      where: { id: recipientId },
      data: {
        name,
        birthday: new Date(birthday),
        age,
        gender,
        interests,
        likes,
        budget,
      },
    });
    
    // Return the updated recipient
    return NextResponse.json(updatedRecipient);
    
  } catch (error) {
    console.error('Error updating recipient:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    // Always disconnect Prisma client to avoid connection leaks
    await prisma.$disconnect();
  }
}

// Delete endpoint
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
    
    // Check if the recipient exists and belongs to the user
    const existingRecipient = await prisma.recipient.findUnique({
      where: { id: recipientId },
    });
    
    if (!existingRecipient || existingRecipient.userId !== user.id) {
      return NextResponse.json(
        { message: 'Recipient not found' },
        { status: 404 }
      );
    }
    
    // Delete the recipient
    await prisma.recipient.delete({
      where: { id: recipientId },
    });
    
    // Return success message
    return NextResponse.json({ message: 'Recipient deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting recipient:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    // Always disconnect Prisma client to avoid connection leaks
    await prisma.$disconnect();
  }
}