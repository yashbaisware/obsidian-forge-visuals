import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { CATEGORIES, type Category, type Project } from "@/lib/projects";
import logo from "@/assets/obsidian-logo.png";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Obsidian Creative" }] }),
  component: AdminPage,
});

const projectSchema = z.object({
  title: z.string().trim().min(1, "Title required").max(120),
  description: z.string().trim().max(600).default(""),
  category: z.enum(CATEGORIES),
  featured: z.boolean(),
});

function AdminPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const qc = useQueryClient();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (!isAdmin) {
      // Signed in but not an admin — bounce to home (do not force sign-out
      // so transient role-check failures can't lock a real admin out).
      navigate({ to: "/" });
    }
  }, [user, isAdmin, loading, navigate]);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", "admin"],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["projects"] });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (loading || !user || !isAdmin) {
    return (
      <main className="dark min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-muted-foreground text-sm tracking-widest">
          {loading ? "Loading…" : "Unauthorized Access — redirecting…"}
        </div>
      </main>
    );
  }

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="" width={36} height={36} className="h-9 w-9 object-contain" />
            <div>
              <div className="font-display tracking-[0.25em] text-silver text-sm">OBSIDIAN</div>
              <div className="text-[10px] tracking-[0.4em] text-primary">ADMIN</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground"
            >
              View Site
            </Link>
            <button
              onClick={signOut}
              className="rounded-full border border-border bg-card/60 px-4 py-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground hover:border-primary/40"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12 grid lg:grid-cols-12 gap-10">
        <section className="lg:col-span-5">
          <div className="text-[10px] tracking-[0.3em] uppercase text-primary mb-3">— New Project</div>
          <h2 className="text-2xl text-silver font-semibold mb-6">Add to portfolio</h2>
          {!isAdmin && (
            <div className="mb-6 rounded-2xl border border-border bg-card/60 p-4 text-xs text-muted-foreground leading-relaxed">
              Your account is signed in but not yet an admin. Open the backend
              dashboard and add a row in <code className="text-silver">user_roles</code> with
              your user id and role <code className="text-silver">admin</code> to enable editing.
            </div>
          )}
          <ProjectForm onSaved={refresh} disabled={!isAdmin} />
        </section>

        <section className="lg:col-span-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-primary mb-3">— Projects</div>
              <h2 className="text-2xl text-silver font-semibold">{projects.length} total</h2>
            </div>
          </div>

          {isLoading ? (
            <div className="text-muted-foreground text-sm">Loading…</div>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <ProjectRow key={p.id} project={p} onChange={refresh} disabled={!isAdmin} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function ProjectForm({ onSaved, disabled }: { onSaved: () => void; disabled: boolean }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("Carousel Ads");
  const [featured, setFeatured] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setOkMsg(null);
    if (!file) return setError("Select a project image");
    const parsed = projectSchema.safeParse({ title, description, category, featured });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Invalid input");

    setBusy(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("project-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("project-images").getPublicUrl(path);

      const { error: insErr } = await supabase.from("projects").insert({
        ...parsed.data,
        image_url: pub.publicUrl,
      });
      if (insErr) throw insErr;

      setTitle("");
      setDescription("");
      setFile(null);
      setFeatured(false);
      setOkMsg("Project added");
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-border bg-card/60 p-6 space-y-4"
    >
      <Field label="Title">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          className="input"
          placeholder="Lumière Atelier"
          disabled={disabled}
        />
      </Field>

      <Field label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={600}
          rows={3}
          className="input resize-none"
          placeholder="Short cinematic description of the campaign…"
          disabled={disabled}
        />
      </Field>

      <Field label="Category">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="input"
          disabled={disabled}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </Field>

      <Field label="Image">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:tracking-[0.2em] file:uppercase file:text-primary-foreground hover:file:bg-primary/90"
          disabled={disabled}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 accent-[oklch(0.7_0.18_245)]"
          disabled={disabled}
        />
        Featured project
      </label>

      {error && <div className="text-sm text-destructive">{error}</div>}
      {okMsg && <div className="text-sm text-primary">{okMsg}</div>}

      <button
        onClick={submit}
        disabled={busy || disabled}
        className="w-full inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm tracking-wide font-medium hover:glow-blue transition-all disabled:opacity-50"
      >
        {busy ? "Saving…" : "Add Project"}
      </button>

      <style>{`
        .input {
          width: 100%;
          background: oklch(0.12 0.005 260 / 0.6);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 0.7rem 0.9rem;
          font-size: 0.875rem;
          color: var(--foreground);
        }
        .input:focus { outline: none; border-color: oklch(0.7 0.18 245 / 0.6); }
      `}</style>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function ProjectRow({
  project,
  onChange,
  disabled,
}: {
  project: Project;
  onChange: () => void;
  disabled: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [category, setCategory] = useState<Category>(project.category as Category);

  const toggleFeatured = async () => {
    setBusy(true);
    await supabase.from("projects").update({ featured: !project.featured }).eq("id", project.id);
    setBusy(false);
    onChange();
  };

  const save = async () => {
    setBusy(true);
    await supabase
      .from("projects")
      .update({ title, description, category })
      .eq("id", project.id);
    setBusy(false);
    setEditing(false);
    onChange();
  };

  const remove = async () => {
    if (!confirm("Delete this project?")) return;
    setBusy(true);
    await supabase.from("projects").delete().eq("id", project.id);
    setBusy(false);
    onChange();
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4 flex gap-4 items-start">
      <img
        src={project.image_url}
        alt={project.title}
        className="h-24 w-20 rounded-lg object-cover border border-border flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="space-y-2">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="input resize-none"
            />
            <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="input">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-silver-bright font-display">{project.title}</h3>
              {project.featured && (
                <span className="text-[9px] tracking-[0.25em] uppercase text-primary border border-primary/40 rounded-full px-2 py-0.5">
                  Featured
                </span>
              )}
            </div>
            <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mt-1">
              {project.category}
            </div>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{project.description}</p>
          </>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {editing ? (
            <>
              <Btn onClick={save} disabled={busy}>Save</Btn>
              <Btn variant="ghost" onClick={() => setEditing(false)}>Cancel</Btn>
            </>
          ) : (
            <>
              <Btn variant="ghost" onClick={() => setEditing(true)} disabled={disabled || busy}>Edit</Btn>
              <Btn variant="ghost" onClick={toggleFeatured} disabled={disabled || busy}>
                {project.featured ? "Unfeature" : "Feature"}
              </Btn>
              <Btn variant="danger" onClick={remove} disabled={disabled || busy}>Delete</Btn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Btn({
  children,
  onClick,
  disabled,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost" | "danger";
}) {
  const base = "rounded-full px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-colors disabled:opacity-50";
  const styles = {
    primary: "bg-primary text-primary-foreground hover:glow-blue",
    ghost: "border border-border bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/40",
    danger: "border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground",
  } as const;
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]}`}>
      {children}
    </button>
  );
}
