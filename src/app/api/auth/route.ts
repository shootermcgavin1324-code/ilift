import { NextResponse } from 'next/server';
import { createUser, getUserByEmail, createGroup, joinGroup, getUserById, getGroupByCode } from '@/lib/db';

export async function POST(request: Request) {
  const body = await request.json();
  const { action, name, email, groupCode } = body;

  try {
    if (action === 'register' || action === 'login') {
      let user = getUserByEmail(email);
      
      if (!user && action === 'register') {
        user = createUser(name || email.split('@')[0], email);
      }
      
      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' });
      }
      
      // Ensure badges array exists
      if (!user.badges) {
        user.badges = [];
      }
      
      // Join or create group
      const group = joinGroup(user.id, groupCode || 'TEST');
      
      return NextResponse.json({ 
        success: true, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email,
          totalXP: user.totalXP || 0,
          streak: user.streak || 0,
          badges: user.badges || [],
          lastWorkout: user.lastWorkout
        },
        group: { id: group.id, name: group.name, code: group.code }
      });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid action' });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
