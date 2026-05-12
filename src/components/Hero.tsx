import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/obsidian-logo.png";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";

export function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-32 pb-20">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img src={heroBg} alt="" width={1920} height={1280} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-glow animate-pulse-glow" />
      </div>

      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* Text */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 backdrop-blur px-4 py-1.5 text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
            Premium Creative Studio
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05]"
          >
            <span className="text-silver">Visuals That</span>
            <br />
            <span className="text-silver">Build </span>
            <span className="italic font-light text-primary" style={{ textShadow: "0 0 40px oklch(0.7 0.22 245 / 0.6)" }}>
              Brands.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-8 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            Obsidian Creative designs premium carousel ads and AI-powered visuals
            for modern brands and digital campaigns.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <button
              onClick={() => scrollTo("portfolio")}
              className="group inline-flex items-center gap-3 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm tracking-wide font-medium hover:glow-blue transition-all"
            >
              View Portfolio
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="inline-flex items-center gap-3 rounded-full border border-border bg-card/40 backdrop-blur px-7 py-3.5 text-sm tracking-wide text-foreground hover:border-primary/60 hover:bg-card transition-all"
            >
              Start a Project
            </button>
          </motion.div>

          <div className="mt-14 flex items-center gap-8 text-xs tracking-[0.2em] uppercase text-muted-foreground">
            <div><span className="text-silver-bright text-2xl font-display">120+</span><div className="mt-1">Campaigns</div></div>
            <div className="h-10 w-px bg-border" />
            <div><span className="text-silver-bright text-2xl font-display">40+</span><div className="mt-1">Brands</div></div>
            <div className="h-10 w-px bg-border" />
            <div><span className="text-silver-bright text-2xl font-display">5★</span><div className="mt-1">Rated</div></div>
          </div>
        </div>

        {/* Floating mockups */}
        <div className="relative h-[520px] lg:h-[620px] hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute inset-0"
          >
            <img src={logo} alt="" aria-hidden width={400} height={400}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] opacity-20 blur-sm" />

            <FloatingCard src={p2} alt="AI skincare carousel" className="left-2 top-4 w-52 -rotate-6" delay={0.4} />
            <FloatingCard src={p1} alt="Luxury fashion carousel" className="left-1/2 -translate-x-1/2 top-20 w-64 z-10 rotate-2" delay={0.55} featured />
            <FloatingCard src={p3} alt="Automotive ad carousel" className="right-0 top-40 w-52 rotate-6" delay={0.7} />

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass rounded-2xl px-5 py-3 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground">Premium Carousel Ads</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FloatingCard({
  src, alt, className, delay, featured,
}: { src: string; alt: string; className: string; delay: number; featured?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute ${className}`}
    >
      <div className={`animate-float rounded-2xl overflow-hidden border border-border bg-card shadow-elegant ${featured ? "glow-blue" : ""}`}
        style={{ animationDelay: `${delay}s` }}>
        <img src={src} alt={alt} width={520} height={650} className="block w-full aspect-[4/5] object-cover" />
      </div>
    </motion.div>
  );
}
