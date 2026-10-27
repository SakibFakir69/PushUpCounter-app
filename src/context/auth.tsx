import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getItem, keys, removeItem, setItem } from "@/lib/storage";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import {  signInWithGoogle as signInWithGoogleFlow, CancelledAuthError } from "@/lib/authFlow";


export type Session = {
  id: string;
  name: string;
  handle: string;
  provider: "local" | "google" | "apple";
  
  supabaseUserId?: string;
};

type AuthFlow = "signup" | "forgot";

type AuthContextValue = {
  status: "loading" | "signedOut" | "signedIn";
  session: Session | null;
  demoMode: boolean;
  signIn: (input: { email: string; password: string }) => Promise<void>;
  signUp: (input: { email: string; password: string; name: string }) => Promise<void>;
  sendOtp: (email: string, flow: AuthFlow) => Promise<void>;
  verifyOtp: (input: { email: string; code: string; flow: AuthFlow }) => Promise<void>;
  resetPassword: (newPassword: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function makeLocalId() {
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function toSession(
  user: { id: string; email?: string; user_metadata?: Record<string, unknown> },
  provider: Session["provider"] = "local",
): Session {

  const email = user.email ?? "";
  const metaName = typeof user.user_metadata?.name === "string" ? user.user_metadata.name : "";
  const metaFullName =
    typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "";
    
  return {
    id: user.id,
    name: metaName || metaFullName || email.split("@")[0] || "Athlete",
    handle: email,
    provider,
    supabaseUserId: user.id,
  };
}

function providerFromSupabaseUser(user: { app_metadata?: Record<string, unknown> }): Session["provider"] {
  const p = user.app_metadata?.provider;
  if (p === "google") return "google";
  if (p === "apple") return "apple";
  return "local";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthContextValue["status"]>("loading");

  const persist = useCallback(async (next: Session | null) => {
    setSession(next);
    setStatus(next ? "signedIn" : "signedOut");
    if (next) await setItem(keys.session, next);
    else await removeItem(keys.session);
  }, []);

  // Boot: supabase session first, then local cache fallback (demo mode).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;

        if (data.session?.user) {
          await persist(toSession(data.session.user, providerFromSupabaseUser(data.session.user)));
          return;
        }
      }
      const stored = await getItem<Session>(keys.session);
      if (cancelled) return;
      setSession(stored);
      setStatus(stored ? "signedIn" : "signedOut");
    })();

    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((_event, s) => {
        if (cancelled) return;
        if (s?.user) {
          setSession(toSession(s.user, providerFromSupabaseUser(s.user)));
          setStatus("signedIn");
        }
      });
      return () => {
        cancelled = true;
        data.subscription.unsubscribe();
      };
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persist]);

const signIn = useCallback<AuthContextValue["signIn"]>(
  async ({ email, password }) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(
        "Authentication is not configured. Please try again later.",
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,

    });

    if (error) throw error;

    if (!data.user) {
      throw new Error("Sign-in failed. Please try again.");
    }

    await persist(toSession(data.user));
  },
  [persist],
);


 
const signUp = useCallback<AuthContextValue["signUp"]>(
  async ({ email, password, name }) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(
        "Authentication is not configured. Please try again later.",
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { name: normalizedName },
      },
    });

    if (error) throw error;

    if (data.session?.user) {
      await persist(toSession(data.session.user));
    }
  },
  [persist],
);


  const sendOtp = useCallback<AuthContextValue["sendOtp"]>(async (email, flow) => {
    if (supabase) {
      if (flow === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          // v1 uses the in-app OTP screen rather than an emailed link.
          redirectTo: undefined,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: { shouldCreateUser: false },
        });
        if (error) throw error;
      }
    } 
  }, []);



  const verifyOtp = useCallback<AuthContextValue["verifyOtp"]>(
    async ({ email, code, flow }) => {
      if (supabase) {
        const { data, error } = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: code,
          type: flow === "forgot" ? "recovery" : "email",
        });
        if (error) throw error;
        if (data.user) {
          if (flow === "signup") {
            // Enrich display name if signUp metadata didn't come back.
            await supabase.auth.updateUser({ data: { name: data.user.user_metadata?.name } });
          }
          await persist(toSession(data.user));
        }
      } else {
      
        if (flow === "signup") {
          const pending = await getItem<Session>(keys.session);
          await persist(pending ?? { id: makeLocalId(), name: "Athlete", handle: email, provider: "local" });
        }
        // forgot flow: session is established after resetPassword succeeds.
      }
    },
    [persist],
  );

  const resetPassword = useCallback<AuthContextValue["resetPassword"]>(async (newPassword) => {
    if (supabase) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      // Recovery session may exist; ensure signed-in state is consistent.
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        await persist(toSession(data.session.user));
      }
    } else {
      // Demo: promote the cached identity (if any) to an active session.
      const pending = await getItem<Session>(keys.session);
      await persist(pending ?? null);
    }
  }, [persist]);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    await persist(null);
  }, [persist]);

  const signInWithGoogle = useCallback(async () => {
    if (supabase) {
      throw new Error(  "Supabase is not configured. Please configure authentication before signing in.",)
    
    }
    await signInWithGoogleFlow();

  }, []);

  const value = useMemo(
    () => ({
      status,
      session,
      demoMode: !isSupabaseConfigured,
      signIn,
      signUp,
      sendOtp,
      verifyOtp,
      resetPassword,
      signOut,
      signInWithGoogle,
    }),
    [status, session, signIn, signUp, sendOtp, verifyOtp, resetPassword, signOut, signInWithGoogle],
  );


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

