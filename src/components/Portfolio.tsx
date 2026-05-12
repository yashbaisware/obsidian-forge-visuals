import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Project } from "@/lib/projects";
import m1 from "@/assets/mockup-1.jpg";
import m2 from "@/assets/mockup-2.jpg";
import m3 from "@/assets/mockup-3.jpg";

const FALLBACKS = [m1, m2, m3];

export function Portfolio() {
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

  return (
    <section id="portfolio" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-bg opacity-30" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-primary mb-4">— Selected Work</div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-silver font-semibold">Featured Portfolio</h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            A curated selection of carousel campaigns, AI creatives and brand
            visuals built for ambitious modern brands.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm tracking-wider">
            No projects yet — check back soon.
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
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
                  <img
                    src={p.image_url || FALLBACKS[i % FALLBACKS.length]}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-glow" />
                  <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[10px] tracking-[0.25em] uppercase text-silver">
                    {p.category}
                  </div>
                  <div className="absolute top-4 right-4 h-10 w-10 rounded-full glass flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:rotate-45">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display text-silver-bright">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-10 cursor-zoom-out"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[90vh] rounded-3xl overflow-hidden border border-border bg-card shadow-elegant cursor-default"
          >
            <button
              onClick={() => setOpen(null)}
              className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
            <div className="grid md:grid-cols-2">
              <img src={open.image_url} alt={open.title} className="w-full h-[40vh] md:h-[80vh] object-cover" />
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="text-[10px] tracking-[0.3em] uppercase text-primary mb-4">{open.category}</div>
                <h3 className="text-3xl md:text-4xl font-display text-silver mb-6">{open.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{open.description}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
