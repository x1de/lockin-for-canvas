// Squad CRUD + invite code logic
// OWNER: Rishi
import { db } from "./firebase";
import { ref, push, set, get, onValue, off, query, orderByChild, equalTo } from "firebase/database";
import type { Squad } from "../types";

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function createSquad(name: string, creatorUid: string): Promise<Squad> {
  const squadRef = push(ref(db, "squads"));
  const squad: Squad = {
    id: squadRef.key!,
    name,
    memberIds: [creatorUid],
    createdBy: creatorUid,
    inviteCode: generateInviteCode(),
    createdAt: Date.now(),
  };
  await set(squadRef, squad);
  return squad;
}

export async function joinSquad(inviteCode: string, uid: string): Promise<Squad | null> {
  // TODO: query squads by invite code, add uid to memberIds
  // This is a placeholder - implement with Firebase query
  return null;
}

export function subscribeToSquad(squadId: string, callback: (squad: Squad | null) => void) {
  const squadRef = ref(db, "squads/" + squadId);
  onValue(squadRef, (snapshot) => {
    callback(snapshot.val() as Squad | null);
  });
  return () => off(squadRef);
}
