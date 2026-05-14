import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Project } from "@/lib/projects";
import m1 from "@/assets/mockup-1.jpg";
import m2 from "@/assets/mockup-2.jpg";
import m3 from "@/assets/mockup-3.jpg";

const FALLBACKS = [m1, m2, m3];

export function Portfolio() {
  const [open, setOpen] = useState<Project | null>(null);

  const { data: allProjects = [] } = useQuery({
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
  const featured = allProjects.filter((p) => p.featured);
  const projects = featured.length > 0 ? featured : allProjects.slice(0, 3);

  return (
    <section id="portfolio" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-bg opacity-30 pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-primary mb-4">— Selected Work</div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-silver font-semibold">Featured Portfolio</h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            A curated selection of carousel campaigns, product image ads and
            video creatives built for ambitious modern brands.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm tracking-wider">
            No projects yet — check back soon.
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {projects.map((p, i) => {
              const thumb = p.cover_url || p.image_url || p.gallery_urls?.[0] || FALLBACKS[i % FALLBACKS.length];
              return (
                <motion.button
                  key={p.id}
                  onClick={() => setOpen(p)}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative text-left rounded-3xl overflow-hidden border border-border bg-card hover:border-primary/40 transition-all"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img src={thumb} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-glow pointer-events-none" />
                    <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[10px] tracking-[0.25em] uppercase text-silver">
                      {p.category}
                    </div>
                    {p.video_url && (
                      <div className="absolute bottom-4 right-4 glass rounded-full px-3 py-1 text-[10px] tracking-[0.2em] uppercase text-primary">
                        ▶ Video
                      </div>
                    )}
                    {p.pdf_url && (
                      <div className="absolute bottom-4 right-4 glass rounded-full px-3 py-1 text-[10px] tracking-[0.2em] uppercase text-primary">
                        PDF
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-display text-silver-bright">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-10 cursor-zoom-out overflow-y-auto"
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
          className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="grid md:grid-cols-2">
          <div className="bg-background/50 min-h-[40vh] md:min-h-[80vh] flex items-center justify-center">
            <ProjectMedia project={project} />
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="text-[10px] tracking-[0.3em] uppercase text-primary mb-4">{project.category}</div>
            <h3 className="text-3xl md:text-4xl font-display text-silver mb-6">{project.title}</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{project.description}</p>
            {project.pdf_url && (
              <a
                href={project.pdf_url}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 text-xs tracking-[0.2em] uppercase text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Open PDF
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectMedia({ project }: { project: Project }) {
  if (project.category === "Product Video Ads" && project.video_url) {
    return (
      <video
        src={project.video_url}
        poster={project.cover_url ?? undefined}
        controls
        className="w-full h-full max-h-[80vh] object-contain bg-black"
      />
    );
  }

  if (project.category === "Product Image Ads" && project.gallery_urls?.length > 0) {
    return <Gallery urls={project.gallery_urls} title={project.title} />;
  }

  if (project.category === "Carousel" && project.pdf_url) {
    return (
      <object data={`${project.pdf_url}#view=FitH`} type="application/pdf" className="w-full h-[80vh]">
        <img src={project.cover_url ?? project.image_url} alt={project.title} className="w-full h-full object-cover" />
      </object>
    );
  }

  return (
    <img
      src={project.cover_url ?? project.image_url}
      alt={project.title}
      className="w-full h-full max-h-[80vh] object-cover"
    />
  );
}

function Gallery({ urls, title }: { urls: string[]; title: string }) {
  const [idx, setIdx] = useState(0);
  const safe = (n: number) => (n + urls.length) % urls.length;
  return (
    <div className="w-full flex flex-col gap-3 p-4">
      <div className="relative aspect-square w-full bg-black rounded-xl overflow-hidden">
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
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={() => setIdx(safe(idx + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground"
              aria-label="Next"
            >
              ›
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
              className={`h-16 w-16 flex-shrink-0 snap-start rounded-lg overflow-hidden border transition ${
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
