export function Mark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="kks-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.62 0.25 27)" />
          <stop offset="100%" stopColor="oklch(0.56 0.22 258)" />
        </linearGradient>
      </defs>
      <path
        d="M6 4h9v16.5L28.5 4H40L25.5 22.5 40 44H28.5L15 26.5V44H6z"
        fill="url(#kks-mark)"
      />
      <path d="M34 4h8l-6 9-4-5z" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <Mark />
      <span className="leading-none">
        <span className="block font-display text-[0.95rem] font-black tracking-[-0.03em] uppercase">
          Kumar &amp; Kumar Sports
        </span>
        <span className="block label-caps text-[0.55rem] text-muted-foreground">
          Built Different
        </span>
      </span>
    </span>
  );
}
