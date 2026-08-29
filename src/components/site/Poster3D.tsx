import React, { useEffect, useRef } from "react";
import goalRecovery from "@/assets/goal-recovery.jpg";

export function Poster3D({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement | null>(null);
  const bg = useRef<HTMLDivElement | null>(null);
  const mid = useRef<HTMLDivElement | null>(null);
  const fg = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;
    let mx = 0;
    let my = 0;

    function onMove(e: MouseEvent) {
      if (!root.current) return;
      const rect = root.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mx = x;
      my = y;
    }

    function tick() {
      const damp = 0.08;
      if (root.current) {
        const rx = -my * 12;
        const ry = mx * 16;
        root.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
      if (bg.current) bg.current.style.transform = `translate3d(${mx * 6}px, ${my * 6}px, -30px) scale(1.02)`;
      if (mid.current) mid.current.style.transform = `translate3d(${mx * 12}px, ${my * 10}px, 18px)`;
      if (fg.current) fg.current.style.transform = `translate3d(${mx * 22}px, ${my * 16}px, 48px)`;

      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={root}
      className={"relative w-72 h-96 rounded-xl bg-card border border-border shadow-lg perspective-800 preserve-3d overflow-hidden " + className}
      style={{ transformStyle: "preserve-3d", transition: "transform 420ms cubic-bezier(0.16,1,0.3,1)" }}
    >
      {/* background texture / gradient */}
      <div
        ref={bg}
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            `linear-gradient(135deg, rgba(36,86,232,0.08), rgba(223,25,48,0.06)), url(${goalRecovery}) center/cover no-repeat`,
          filter: "contrast(1.03) saturate(1.06)",
          transform: "translate3d(0,0,-30px)",
          transition: "transform 300ms ease-out",
        }}
      />

      {/* middle decorative band */}
      <div
        ref={mid}
        aria-hidden
        className="absolute left-4 top-6 right-4 h-24 rounded-lg bg-gradient-to-r from-primary/10 to-accent/8 blur-lg"
        style={{ transform: "translate3d(0,0,18px)", transition: "transform 320ms ease-out" }}
      />

      {/* foreground content */}
      <div className="relative z-10 flex h-full flex-col items-start justify-end p-6">
        <h3 ref={fg} className="text-3xl font-display font-black text-foreground" style={{ transform: "translate3d(0,0,48px)", transition: "transform 260ms ease-out" }}>
          Train with
          <br />
          <span style={{ background: "linear-gradient(90deg,#df1930,#2456e8)", WebkitBackgroundClip: "text", color: "transparent" }}>
            intent.
          </span>
          <br />
          Recover <span className="text-accent">strong.</span>
        </h3>
        <p className="mt-3 max-w-xs text-sm text-muted-foreground">
          Fast-absorbing proteins and essential amino matrices for faster recovery and cleaner gains.
        </p>
        <div className="mt-4 flex gap-3">
          <button className="inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2 text-xs font-bold text-primary-foreground uppercase">
            Shop Recovery
          </button>
          <button className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-4 py-2 text-xs font-bold uppercase text-muted-foreground">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

export default Poster3D;
