"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { supabase } from "./supabaseClient";

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
  let token = accessToken;

  if (!token) {
    const store = cookies();
    token =
      store.get("sb-access-token")?.value ??
      store.get("supabase-auth-token")?.value ??
      undefined;
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function ensureAuthenticated(accessToken?: string) {
  const user = await getAuthenticatedUser(accessToken);

  if (!user) {
    redirect("/sign-in");
  }

  return user;
}
