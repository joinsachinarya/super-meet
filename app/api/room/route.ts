import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
        return NextResponse.json(
            { error: 'Room ID is required' },
            { status: 400 }
        );
    }

    // Here you can add additional validation logic
    // For example, checking if the room exists in your database

    return NextResponse.json({ roomId, valid: true });
} 