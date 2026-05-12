import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import logo from "@/assets/obsidian-logo.png";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Obsidian Creative" }] }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/admin" });
  }, [user, loading, navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          ...parsed.data,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="dark min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-bg opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] bg-glow opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md glass rounded-3xl p-8 sm:p-10"
      >
        <Link to="/" className="flex items-center gap-3 mb-8">
          <img src={logo} alt="" width={48} height={48} className="h-12 w-12 object-contain" />
          <div>
            <div className="font-display tracking-[0.28em] text-silver text-sm">OBSIDIAN</div>
            <div className="text-[10px] tracking-[0.4em] text-primary mt-0.5">CREATIVE</div>
          </div>
        </Link>

        <h1 className="text-3xl text-silver font-semibold">
          {mode === "signin" ? "Admin Sign In" : "Create Admin Account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your portfolio from a single private dashboard.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40"
              placeholder="you@studio.com"
            />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm tracking-wide font-medium hover:glow-blue transition-all disabled:opacity-50"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          {mode === "signin" ? "First time?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
            }}
            className="text-primary hover:underline"
          >
            {mode === "signin" ? "Create account" : "Sign in"}
          </button>
        </div>

        {mode === "signup" && (
          <p className="mt-6 text-[11px] text-muted-foreground leading-relaxed">
            Note: New accounts have no admin access by default. After creating
            the first account, grant it the <code className="text-silver">admin</code> role from the
            backend dashboard.
          </p>
        )}
      </motion.div>
    </main>
  );
}
