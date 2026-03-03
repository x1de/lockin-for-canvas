// Session-Bridge: Canvas session -> Firebase anonymous auth
// OWNER: Rishi
//
// Strategy:
// 1. Content script detects user is logged into Canvas
// 2. Scrapes Canvas user ID + display name from DOM / API
// 3. Sends to background worker
// 4. Background worker signs into Firebase anonymously
// 5. Maps Canvas user ID -> Firebase UID in /users node

import { auth, db } from "./firebase";
import { signInAnonymously, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { ref, set, get } from "firebase/database";
import type { User } from "../types";

let currentUser: User | null = null;

export async function initAuth(canvasUserId: string, displayName: string): Promise<User> {
  const credential = await signInAnonymously(auth);
  const firebaseUser = credential.user;

  const user: User = {
    uid: firebaseUser.uid,
    displayName,
    canvasUserId,
    lastActive: Date.now(),
  };

  // Store user mapping
  await set(ref(db, "users/" + firebaseUser.uid), user);
  currentUser = user;
  return user;
}

export function getCurrentUser(): User | null {
  return currentUser;
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
