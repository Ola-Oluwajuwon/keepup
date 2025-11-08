import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "./supabaseServer";

export function getBearerTokenFromRequest(
  request: Request
): string | undefined {
  const header = request.headers.get("Authorization");
  if (!header) return undefined;
  const [, token] = header.split(" ");
  return token ?? undefined;
}

export async function getAuthenticatedUser(
  accessToken?: string
): Promise<User | null> {
  try {
    // If token is provided, use it directly
    if (accessToken) {
      const supabase = await createSupabaseServerClient(accessToken);
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        return null;
      }
      return data.user;
    }

    // Otherwise, try to get user from the server client
    // This will use the session from cookies if available
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error getting authenticated user:", error);
    return null;
  }
}

export async function ensureAuthenticated(accessToken?: string) {
  const user = await getAuthenticatedUser(accessToken);

  if (!user) {
    redirect("/sign-in");
  }

  return user;
}
