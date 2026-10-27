import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

WebBrowser.maybeCompleteAuthSession();



export class CancelledAuthError extends Error {
  constructor() {
    super("User cancelled the auth flow");
    this.name = "CancelledAuthError";
  }
}

/**
 * Runs the Google OAuth browser flow and calls supabase.auth.setSession
 * on success. Does NOT return a session — AuthProvider's onAuthStateChange
 * listener picks up the change and updates `session`/`status` itself.
 * Throws CancelledAuthError if the user backs out of the browser.
 */
export async function signInWithGoogle(): Promise<void> {

  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }

  const redirectTo = Linking.createURL("redirect");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo, skipBrowserRedirect: true },
  });
  
  if (error) throw error;

  const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (res.type === "cancel" || res.type === "dismiss") {
    throw new CancelledAuthError();
  }
  if (res.type !== "success") {
    throw new Error(`Unexpected auth result: ${res.type}`);
  }

  const params = new URL(res.url.replace("#", "?")).searchParams;
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");
  if (!access_token || !refresh_token) {
    throw new Error("Missing tokens in OAuth callback");
  }

  const { error: sessionError } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (sessionError) throw sessionError;
}