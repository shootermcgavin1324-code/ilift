import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function useGetUser(email: string | undefined) {
  return useQuery(api.users.getByEmail, { email: email || "" });
}

export function useGetLeaderboard(groupCode: string) {
  return useQuery(api.users.getLeaderboard, { groupCode });
}

export function useGetSquadMembers(groupCode: string) {
  return useQuery(api.users.getSquadMembers, { groupCode });
}

export function useGetWorkouts(userEmail: string | undefined) {
  return useQuery(api.workouts.getUserWorkouts, { userEmail: userEmail || "" });
}

export function useHasWorkedOutToday(userEmail: string | undefined) {
  return useQuery(api.workouts.hasWorkedOutToday, { userEmail: userEmail || "" });
}

export function useGetPRs(userEmail: string | undefined) {
  return useQuery(api.prs.getUserPRs, { userEmail: userEmail || "" });
}

export function useUpsertUser() {
  return useMutation(api.users.upsertUser);
}

export function useAddXP() {
  return useMutation(api.users.addXP);
}

export function useUpdateStreak() {
  return useMutation(api.users.updateStreak);
}

export function useUpdateProfile() {
  return useMutation(api.users.updateProfile);
}

export function useSaveWorkout() {
  return useMutation(api.workouts.saveWorkout);
}

export function useSavePR() {
  return useMutation(api.prs.savePR);
}
