import { supabase } from "./supabaseClient";

function handleAuthError(error: Error | null, fallbackMessage: string) {
  if (!error) {
    return;
  }

  const message = error.message?.trim() ?? fallbackMessage;
  throw new Error(message || fallbackMessage);
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  handleAuthError(error, "Unable to create account. Please try again.");
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  handleAuthError(error, "Unable to sign in. Please check your credentials.");
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  handleAuthError(error, "Unable to sign out. Please try again.");
}
