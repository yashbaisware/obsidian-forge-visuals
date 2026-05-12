import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import logo from "@/assets/obsidian-logo.png";

const links = [
  { label: "Home", hash: "" },
  { label: "Portfolio", hash: "portfolio" },
  { label: "About", hash: "about" },
  { label: "Contact", hash: "contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    if (!id) return window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-6"}`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <nav
          className={`flex items-center justify-between rounded-2xl pl-3 pr-3 py-2.5 transition-all duration-500 ${
            scrolled ? "glass shadow-elegant" : "bg-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-4 group pr-4">
            <img
              src={logo}
              alt="Obsidian Creative"
              width={56}
              height={56}
              className="h-14 w-14 object-contain transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-base tracking-[0.28em] text-silver">OBSIDIAN</span>
              <span className="text-[10px] tracking-[0.4em] text-primary mt-1">CREATIVE</span>
            </div>
          </Link>

          <ul className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.label}>
                <button
                  onClick={() => scrollTo(l.hash)}
                  className="px-5 py-2 text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {l.label}
                  <span className="absolute inset-x-5 bottom-1 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => scrollTo("contact")}
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 text-xs tracking-[0.2em] uppercase text-primary hover:bg-primary hover:text-primary-foreground hover:glow-blue transition-all"
          >
            Get in Touch
          </button>

          <button
            aria-label="Menu"
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-foreground"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </nav>

        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-2 glass rounded-2xl p-4 flex flex-col gap-1"
          >
            {links.map((l) => (
              <li key={l.label}>
                <button
                  onClick={() => scrollTo(l.hash)}
                  className="w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </motion.header>
  );
}
