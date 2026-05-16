import { motion } from "framer-motion";
import logo from "@/assets/obsidian-logo.png";

const stats = [
<<<<<<< HEAD
  { label: "YEARS CREATIVE EXPERIENCE", value: "2+", desc: "Building cinematic visuals and premium digital campaigns." },
  { label: "PREMIUM VISUAL PROJECTS", value: "50+", desc: "Luxury-focused carousel ads and AI-powered creative design." },
  { label: "AI CREATIVE WORKFLOW", value: "MODERN", desc: "Advanced AI-assisted visual systems for modern brands." },
=======
  { label: "Creative Campaigns", value: "120+", desc: "Carousel and ad sets shipped for global brands." },
  { label: "AI Visual Design", value: "300+", desc: "Generative creatives engineered for performance." },
  { label: "Social Media Branding", value: "40+", desc: "Identity systems built for modern social-first brands." },
>>>>>>> e06519608011d5cd6d81a812fa2a2bf28aa7260c
];

export function About() {
  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <div className="absolute -top-20 -right-20 h-[500px] w-[500px] bg-glow opacity-50" />
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative aspect-square max-w-md mx-auto">
            <div className="absolute inset-0 bg-glow animate-pulse-glow" />
            <img src={logo} alt="Obsidian Creative emblem" width={600} height={600} className="relative w-full h-full object-contain animate-float" />
          </div>
        </motion.div>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-[10px] tracking-[0.3em] uppercase text-primary mb-4">— About</div>
            <h2 className="text-4xl sm:text-5xl text-silver font-semibold leading-[1.1]">
              A studio for visuals that <span className="italic font-light text-primary">move markets.</span>
            </h2>
            <p className="mt-8 text-muted-foreground leading-relaxed text-lg">
              Obsidian Creative focuses on high-end visual storytelling through
              modern carousel ads, AI-generated creatives, and premium social
              media design — built to make brands unmistakable.
            </p>
          </motion.div>

<<<<<<< HEAD
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
=======
          <div className="mt-12 grid sm:grid-cols-3 gap-4">
>>>>>>> e06519608011d5cd6d81a812fa2a2bf28aa7260c
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
<<<<<<< HEAD
                className="rounded-[28px] border border-white/10 bg-card/65 backdrop-blur-lg p-8 sm:p-10 min-h-[220px] flex flex-col justify-between gap-4 transition-all duration-300 hover:border-primary/30 hover:bg-white/5"
              >
                <div className="text-4xl sm:text-5xl font-display text-silver-bright leading-tight">{s.value}</div>
                <div className="text-[11px] tracking-[0.32em] uppercase text-primary">{s.label}</div>
                <p className="text-sm leading-relaxed text-muted-foreground max-w-lg">{s.desc}</p>
=======
                className="rounded-2xl border border-border bg-card/60 backdrop-blur p-6 hover:border-primary/40 hover:bg-card transition-all"
              >
                <div className="text-3xl font-display text-silver-bright">{s.value}</div>
                <div className="mt-2 text-[10px] tracking-[0.25em] uppercase text-primary">{s.label}</div>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
>>>>>>> e06519608011d5cd6d81a812fa2a2bf28aa7260c
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
