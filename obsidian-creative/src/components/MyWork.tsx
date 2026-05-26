import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, type Category, type Project } from "@/lib/projects";

export function MyWork() {
  const qc = useQueryClient();
  const [active, setActive] = useState<Category>("Carousel");
  const [open, setOpen] = useState<Project | null>(null);

  const { data: projects = [] } = useQuery({
    queryKey: ["projects", "public"],
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

  useEffect(() => {
    const channel = supabase
      .channel("projects-mywork")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        () => qc.invalidateQueries({ queryKey: ["projects"] })
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [qc]);

  const counts = useMemo(() => {
    const c: Record<Category, number> = {
      Carousel: 0,
      "Product Image Ads": 0,
      "Product Video Ads": 0,
    };
    for (const p of projects) {
      if ((CATEGORIES as readonly string[]).includes(p.category)) {
        c[p.category as Category] += 1;
      }
    }
    return c;
  }, [projects]);

  const filtered = projects.filter((p) => p.category === active);

  return (
    <section id="my-work" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 -left-40 h-[500px] w-[500px] bg-glow opacity-30 pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-primary mb-3">ΓÇö Archive</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-silver font-semibold">My Work</h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            The full archive ΓÇö every campaign organized by craft.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28 flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {CATEGORIES.map((c) => {
                const isActive = c === active;
                return (
                  <button
                    key={c}
                    onClick={() => setActive(c)}
                    className={`relative flex-shrink-0 lg:w-full text-left rounded-xl px-4 py-3 border transition-all text-sm ${
                      isActive
                        ? "border-primary/50 bg-primary/10 text-silver-bright"
                        : "border-border/60 bg-card/30 text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="mywork-indicator"
                        className="absolute left-0 top-2.5 bottom-2.5 w-[2px] rounded-full bg-primary"
                      />
                    )}
                    <div className="flex items-center justify-between gap-3">
                      <span className="tracking-wide">{c}</span>
                      <span className="text-[10px] tracking-[0.2em] text-primary/70">
                        {String(counts[c]).padStart(2, "0")}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {filtered.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-card/30 p-12 text-center text-muted-foreground text-xs tracking-wider">
                    Nothing here yet ΓÇö new {active.toLowerCase()} drops soon.
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((p, i) => (
                      <ProjectCard key={p.id} project={p} index={i} onOpen={() => setOpen(p)} />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const thumb =
    project.cover_url || project.image_url || project.gallery_urls?.[0];
  return (
    <motion.button
      onClick={onOpen}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative text-left rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {thumb ? (
          <img
            src={thumb}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-background/50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute top-3 left-3 glass rounded-full px-2.5 py-0.5 text-[9px] tracking-[0.25em] uppercase text-silver">
          {project.category}
        </div>
        {project.video_url && (
          <div className="absolute bottom-3 right-3 glass rounded-full px-2.5 py-0.5 text-[9px] tracking-[0.2em] uppercase text-primary">
            Γû╢ Video
          </div>
        )}
        {project.pdf_url && (
          <div className="absolute bottom-3 right-3 glass rounded-full px-2.5 py-0.5 text-[9px] tracking-[0.2em] uppercase text-primary">
            PDF
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-base font-display text-silver-bright truncate">{project.title}</h3>
        {project.description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}
      </div>
    </motion.button>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [showPdf, setShowPdf] = useState(false);
  const cover =
    project.cover_url || project.image_url || project.gallery_urls?.[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 cursor-zoom-out overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-6xl w-full my-auto rounded-3xl overflow-hidden border border-border bg-card shadow-elegant cursor-default"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 h-10 w-10 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label="Close"
        >
          Γ£ò
        </button>

        <div className="grid md:grid-cols-2 min-h-[60vh]">
          {/* LEFT ΓÇö cover hero */}
          <div className="relative bg-background/60 flex items-center justify-center p-6 md:p-10 md:sticky md:top-0 md:self-start md:h-screen md:max-h-[90vh]">
            <div className="absolute inset-0 bg-glow opacity-40 pointer-events-none" />
            {cover ? (
              <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden border border-border shadow-elegant glow-blue">
                <img
                  src={cover}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-[4/5] rounded-2xl bg-background/50 border border-border" />
            )}
          </div>

          {/* RIGHT ΓÇö details */}
          <div className="p-8 md:p-12 flex flex-col justify-center gap-6">
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-primary mb-3">{project.category}</div>
              <h3 className="text-3xl md:text-4xl font-display text-silver mb-5">{project.title}</h3>
              {project.description && (
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {project.description}
                </p>
              )}
            </div>

            {/* Media-specific viewer */}
            {project.category === "Product Video Ads" && project.video_url && (
              <video
                src={project.video_url}
                poster={project.cover_url ?? undefined}
                controls
                className="w-full rounded-xl border border-border bg-black max-h-[50vh]"
              />
            )}

            {project.category === "Product Image Ads" && project.gallery_urls?.length > 0 && (
              <Gallery urls={project.gallery_urls} title={project.title} />
            )}

            {project.category === "Carousel" && project.pdf_url && (
              <div className="flex flex-col gap-3">
                {showPdf ? (
                  <object
                    data={`${project.pdf_url}#view=FitH`}
                    type="application/pdf"
                    className="w-full h-[50vh] rounded-xl border border-border bg-black"
                  >
                    <a
                      href={project.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline text-sm"
                    >
                      Open PDF in new tab
                    </a>
                  </object>
                ) : null}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowPdf((s) => !s)}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 text-xs tracking-[0.2em] uppercase text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    {showPdf ? "Hide Preview" : "Preview PDF"}
                  </button>
                  <a
                    href={project.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-2.5 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                  >
                    View Full PDF ΓåÆ
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Gallery({ urls, title }: { urls: string[]; title: string }) {
  const [idx, setIdx] = useState(0);
  const safe = (n: number) => (n + urls.length) % urls.length;
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="relative aspect-square w-full bg-black rounded-xl overflow-hidden border border-border">
        <AnimatePresence mode="wait">
          <motion.img
            key={urls[idx]}
            src={urls[idx]}
            alt={`${title} ${idx + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full object-contain"
          />
        </AnimatePresence>
        {urls.length > 1 && (
          <>
            <button
              onClick={() => setIdx(safe(idx - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full glass text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground"
              aria-label="Previous"
            >
              ΓÇ╣
            </button>
            <button
              onClick={() => setIdx(safe(idx + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full glass text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground"
              aria-label="Next"
            >
              ΓÇ║
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 glass rounded-full px-3 py-1 text-[10px] tracking-[0.2em] text-silver">
              {idx + 1} / {urls.length}
            </div>
          </>
        )}
      </div>
      {urls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 snap-x">
          {urls.map((u, i) => (
            <button
              key={u}
              onClick={() => setIdx(i)}
              className={`h-14 w-14 flex-shrink-0 snap-start rounded-lg overflow-hidden border transition ${
                i === idx ? "border-primary" : "border-border opacity-60 hover:opacity-100"
              }`}
            >
              <img src={u} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
