import { NextResponse } from 'next/server';
import { logWorkout, getLeaderboard, getTodayWorkouts, getUserById } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { exercises, score, userName, userId, groupId } = body;
    
    if (!userId || !groupId) {
      return NextResponse.json({ success: false, error: 'Missing user or group ID' }, { status: 400 });
    }
    
    const workout = logWorkout(userId, groupId, exercises, score, userName);
    
    return NextResponse.json({ success: true, workout });
  } catch (error) {
    console.error('Workout error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId') || '1';
    
    const leaderboard = getLeaderboard(groupId);
    const todayWorkouts = getTodayWorkouts(groupId);
    
    return NextResponse.json({ 
      success: true, 
      leaderboard,
      todayWorkouts
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
