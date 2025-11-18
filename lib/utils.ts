import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createSupabaseServerClient } from "./supabaseServer";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extract bearer token from Authorization header
 */
export function getBearerTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Get authenticated user from token
 */
export async function getAuthenticatedUser(token: string | null) {
  if (!token) return null;

  const supabase = await createSupabaseServerClient(token);
  const {
    data: { user },
  } = await supabase.auth.getUser(token);
  return user;
}
