import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AuthState = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
};

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const lastCheckedUid = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const checkAdmin = async (uid: string | null) => {
      if (!uid) {
        if (!cancelled) {
          setIsAdmin(false);
          lastCheckedUid.current = null;
        }
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      if (cancelled) return;
      lastCheckedUid.current = uid;
      setIsAdmin(!!data);
    };

    const applySession = async (sessionUser: User | null, initial = false) => {
      setUser(sessionUser);
      // Keep loading true until role check resolves so consumers don't
      // act on a half-known auth state.
      if (initial) setLoading(true);
      await checkAdmin(sessionUser?.id ?? null);
      if (initial && !cancelled) setLoading(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      // Re-check role for the new user; mark loading during the check
      // so /admin doesn't prematurely treat the user as non-admin.
      if (nextUser && lastCheckedUid.current !== nextUser.id) {
        setLoading(true);
        checkAdmin(nextUser.id).finally(() => {
          if (!cancelled) setLoading(false);
        });
      } else if (!nextUser) {
        setIsAdmin(false);
        lastCheckedUid.current = null;
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      applySession(session?.user ?? null, true);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading };
}
