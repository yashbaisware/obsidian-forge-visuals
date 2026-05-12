import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import m1 from "@/assets/mockup-1.jpg";
import m2 from "@/assets/mockup-2.jpg";
import m3 from "@/assets/mockup-3.jpg";

const features = [
  { label: "Carousel Ads" },
  { label: "AI Visuals" },
  { label: "Premium Design" },
];

export function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-36 pb-20">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroBg}
          alt=""
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-1/3 left-[10%] h-[500px] w-[600px] bg-glow animate-pulse-glow" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[600px] bg-glow opacity-60 animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
        {/* Text */}
        <div className="lg:col-span-7">
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
            <span
              className="italic font-light text-primary"
              style={{ textShadow: "0 0 40px oklch(0.7 0.22 245 / 0.6)" }}
            >
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
              onClick={() => scrollTo("portfolio")}
              className="inline-flex items-center gap-3 rounded-full border border-border bg-card/40 backdrop-blur px-7 py-3.5 text-sm tracking-wide text-foreground hover:border-primary/60 hover:bg-card transition-all"
            >
              Explore Work
            </button>
          </motion.div>

          {/* Minimal feature cards (replaces fake stats) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-14 flex flex-wrap gap-3"
          >
            {features.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2.5 rounded-full border border-border bg-card/40 backdrop-blur px-4 py-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-xs tracking-[0.2em] uppercase text-silver">{f.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Stacked carousel mockups */}
        <div className="lg:col-span-5 relative h-[480px] sm:h-[560px] lg:h-[640px] hidden md:block">
          <CarouselStack mockups={[m1, m2, m3]} />
        </div>
      </div>
    </section>
  );
}

function CarouselStack({ mockups }: { mockups: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {/* glow halo */}
      <div className="absolute inset-0 bg-glow" />

      {/* back card */}
      <Card src={mockups[2]} className="-rotate-[10deg] -translate-x-24 translate-y-4 z-0 opacity-70" delay={0.5} />
      {/* mid card */}
      <Card src={mockups[1]} className="rotate-[8deg] translate-x-24 -translate-y-2 z-10 opacity-90" delay={0.6} />
      {/* front card */}
      <Card src={mockups[0]} className="rotate-0 z-20" delay={0.7} featured />

      {/* tiny floating UI chip top */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute top-4 right-2 glass rounded-xl px-3 py-2 z-30"
      >
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">Slide 01 / 06</span>
        </div>
      </motion.div>

      {/* dots */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 glass rounded-full px-4 py-2 flex items-center gap-2 z-30"
      >
        <span className="h-1.5 w-6 rounded-full bg-primary" />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
      </motion.div>

      {/* engagement chip */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-20 -right-2 glass rounded-xl px-3 py-2 z-30 hidden lg:flex items-center gap-2"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="oklch(0.7 0.18 245)" stroke="oklch(0.7 0.18 245)" strokeWidth="1.5">
          <path d="M12 21s-7-4.5-9.5-9C.5 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4 4.5 8-2.5 4.5-9.5 9-9.5 9z" strokeLinejoin="round" />
        </svg>
        <span className="text-[10px] tracking-[0.2em] uppercase text-silver">CTR +38%</span>
      </motion.div>
    </motion.div>
  );
}

function Card({
  src,
  className,
  delay,
  featured,
}: {
  src: string;
  className: string;
  delay: number;
  featured?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute ${className}`}
    >
      <div
        className={`animate-float w-[200px] sm:w-[230px] aspect-[9/16] rounded-3xl overflow-hidden border border-border bg-card shadow-elegant ${
          featured ? "glow-blue" : ""
        }`}
        style={{ animationDelay: `${delay}s` }}
      >
        <img src={src} alt="" width={460} height={820} className="block h-full w-full object-cover" />
      </div>
    </motion.div>
  );
}
