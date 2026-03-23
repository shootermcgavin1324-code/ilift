// iLift MVP - Simple JSON Database
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

function initDB() {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      users: [],
      groups: [],
      workouts: [],
      badges: [
        { id: 'first_workout', name: 'First Workout', emoji: '🎉', requirement: 'Complete 1 workout' },
        { id: 'streak_7', name: 'On Fire', emoji: '🔥', requirement: '7 day streak' },
        { id: 'xp_1000', name: 'XP Hunter', emoji: '⭐', requirement: 'Earn 1000 XP' },
        { id: 'first_group', name: 'Squad Up', emoji: '👥', requirement: 'Join a group' },
      ]
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  }
}

function readDB() {
  initDB();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDB(data: Record<string, unknown>) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Users
export function createUser(name: string, email: string) {
  const db = readDB();
  const user = {
    id: Date.now().toString(),
    name,
    email,
    totalXP: 0,
    streak: 0,
    lastWorkout: null,
    badges: [],
    createdAt: new Date().toISOString()
  };
  db.users.push(user);
  writeDB(db);
  return user;
}

export function getUserById(id: string) {
  const db = readDB();
  return db.users.find((u: any) => u.id === id);
}

export function getUserByEmail(email: string) {
  const db = readDB();
  return db.users.find((u: any) => u.email === email);
}

export function updateUser(userId: string, updates: Record<string, any>) {
  const db = readDB();
  const userIndex = db.users.findIndex((u: any) => u.id === userId);
  if (userIndex !== -1) {
    db.users[userIndex] = { ...db.users[userIndex], ...updates };
    writeDB(db);
    return db.users[userIndex];
  }
  return null;
}

export function updateUserXP(userId: string, xp: number) {
  const db = readDB();
  const user = db.users.find((u: any) => u.id === userId);
  if (user) {
    user.totalXP = (user.totalXP || 0) + xp;
    
    // Check for XP badge
    if (user.totalXP >= 1000 && !user.badges.includes('xp_1000')) {
      user.badges.push('xp_1000');
    }
    
    writeDB(db);
    return user;
  }
  return null;
}

// Groups
export function createGroup(name: string, code: string, creatorId: string) {
  const db = readDB();
  const group = {
    id: Date.now().toString(),
    name,
    code,
    members: [creatorId],
    createdAt: new Date().toISOString()
  };
  db.groups.push(group);
  writeDB(db);
  return group;
}

export function getGroupByCode(code: string) {
  const db = readDB();
  return db.groups.find((g: any) => g.code === code);
}

export function joinGroup(userId: string, groupCode: string) {
  const db = readDB();
  const group = db.groups.find((g: any) => g.code === groupCode);
  
  if (!group) {
    // Create new group
    return createGroup(`${groupCode}'s Squad`, groupCode, userId);
  }
  
  if (!group.members.includes(userId)) {
    group.members.push(userId);
    writeDB(db);
  }
  
  return group;
}

export function getGroupMembers(groupId: string) {
  const db = readDB();
  const group = db.groups.find((g: any) => g.id === groupId);
  if (!group) return [];
  return db.users.filter((u: any) => group.members.includes(u.id));
}

// Workouts
export function logWorkout(userId: string, groupId: string, exercises: any[], score: number, userName?: string) {
  const db = readDB();
  
  const workout = {
    id: Date.now().toString(),
    userId,
    groupId,
    userName: userName || 'Unknown',
    exercises,
    score,
    date: new Date().toISOString()
  };
  
  db.workouts.push(workout);
  
  // Update user XP
  const user = db.users.find((u: any) => u.id === userId);
  if (user) {
    user.totalXP = (user.totalXP || 0) + score;
    
    // Update streak
    const today = new Date().toDateString();
    const lastWorkout = user.lastWorkout ? new Date(user.lastWorkout).toDateString() : null;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (lastWorkout === today) {
      // Already worked out today
    } else if (lastWorkout === yesterday) {
      user.streak = (user.streak || 0) + 1;
    } else {
      user.streak = 1;
    }
    user.lastWorkout = new Date().toISOString();
    
    // Check badges
    if (user.streak >= 7 && !user.badges.includes('streak_7')) {
      user.badges.push('streak_7');
    }
  }
  
  writeDB(db);
  return workout;
}

export function getTodayWorkouts(groupId: string) {
  const db = readDB();
  const today = new Date().toISOString().split('T')[0];
  return db.workouts.filter((w: any) => 
    w.groupId === groupId && 
    w.date.split('T')[0] === today
  );
}

export function getUserStreak(userId: string) {
  const db = readDB();
  const user = db.users.find((u: any) => u.id === userId);
  return user?.streak || 0;
}

export function getLeaderboard(groupId: string) {
  const db = readDB();
  const today = new Date().toISOString().split('T')[0];
  const todayWorkouts = db.workouts.filter((w: any) => 
    w.groupId === groupId && 
    w.date.split('T')[0] === today
  );
  
  return todayWorkouts.map((w: any) => {
    const user = db.users.find((u: any) => u.id === w.userId);
    return {
      userId: w.userId,
      userName: w.userName || user?.name || 'Unknown',
      exercises: w.exercises,
      score: w.score,
      streak: user?.streak || 0,
      badges: user?.badges || [],
      time: w.date
    };
  }).sort((a: any, b: any) => b.score - a.score);
}

export function getBadges() {
  const db = readDB();
  return db.badges || [];
}

export function getWorkoutsByUser(userId: string) {
  const db = readDB();
  const userWorkouts = db.workouts.filter((w: any) => w.userId === userId);
  return userWorkouts
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20); // Last 20 workouts
}
