// ============================================
// OFFLINE SUPPORT - Network detection + sync queue
// ============================================

import type { User, Workout } from '../types';

// Check if we're in browser
const isBrowser = typeof window !== 'undefined';

// Network status
let isOnline = isBrowser ? navigator.onLine : true;

// Pending sync queue key
const PENDING_SYNC_KEY = 'ilift_pending_sync';

// Initialize network listeners
export function initNetworkStatus(): void {
  if (!isBrowser) return;
  
  window.addEventListener('online', () => {
    isOnline = true;
    console.log('[OFFLINE] Back online - processing sync queue');
    processSyncQueue();
  });
  
  window.addEventListener('offline', () => {
    isOnline = false;
    console.log('[OFFLINE] Went offline - queuing operations');
  });
}

// Check if online
export function isNetworkOnline(): boolean {
  return isOnline;
}

// Queue types
type SyncOperation = {
  id: string;
  type: 'workout' | 'pr' | 'user' | 'streak';
  data: unknown;
  timestamp: number;
};

// Get pending sync queue
function getSyncQueue(): SyncOperation[] {
  if (!isBrowser) return [];
  const data = localStorage.getItem(PENDING_SYNC_KEY);
  return data ? JSON.parse(data) : [];
}

// Save to sync queue
function addToSyncQueue(operation: Omit<SyncOperation, 'id' | 'timestamp'>): void {
  if (!isBrowser) return;
  
  const queue = getSyncQueue();
  queue.push({
    ...operation,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  });
  localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(queue));
  console.log('[OFFLINE] Added to sync queue:', operation.type);
}

// Process sync queue when back online
async function processSyncQueue(): Promise<void> {
  if (!isBrowser || !isNetworkOnline()) return;
  
  const queue = getSyncQueue();
  if (queue.length === 0) return;
  
  console.log('[OFFLINE] Processing sync queue:', queue.length, 'operations');
  
  // Process each operation (for now, just clear the queue since we're local-only)
  // In future, this would sync to cloud when re-enabled
  for (const op of queue) {
    console.log('[OFFLINE] Would sync:', op.type, op.data);
  }
  
  // Clear the queue after processing
  localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify([]));
  console.log('[OFFLINE] Sync queue cleared');
}

// Queue a workout for sync
export function queueWorkoutSync(workout: Workout): void {
  addToSyncQueue({ type: 'workout', data: workout });
}

// Queue a PR for sync
export function queuePRSync(exercise: string, weight: number): void {
  addToSyncQueue({ type: 'pr', data: { exercise, weight } });
}

// Queue user update for sync
export function queueUserSync(user: Partial<User>): void {
  addToSyncQueue({ type: 'user', data: user });
}

// Queue streak update for sync
export function queueStreakSync(streak: number): void {
  addToSyncQueue({ type: 'streak', data: { streak } });
}

// Get pending sync count (for UI indicator)
export function getPendingSyncCount(): number {
  return getSyncQueue().length;
}

export { initNetworkStatus as initOffline, isNetworkOnline as checkOnline };
