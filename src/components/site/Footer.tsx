import { Link } from "@tanstack/react-router";
import { Instagram, Youtube, Facebook } from "lucide-react";
import { Mark } from "./Logo";

const COLS = [
  {
    title: "Shop",
    links: ["Protein", "Supplements", "Accessories", "Bestsellers"],
  },
  {
    title: "Company",
    links: ["About Us", "Contact", "Careers", "Store Locator"],
  },
  {
    title: "Policies",
    links: ["Shipping Policy", "Return Policy", "Privacy Policy", "Terms & Conditions"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface pb-24 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <div className="flex items-center gap-3">
            <Mark className="h-9 w-9" />
            <span className="font-display text-lg font-black uppercase">
              Kumar &amp; Kumar Sports
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Performance nutrition engineered in India for people who refuse to settle.
            Lab tested, batch traceable, athlete approved.
          </p>
          <div className="mt-5 flex gap-2">
            {[Instagram, Youtube, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label={["Instagram", "YouTube", "Facebook"][i]}
                className="grid h-10 w-10 place-items-center rounded-sm border border-border transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h3 className="label-caps text-primary">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l}>
                  <Link
                    to="/shop"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Kumar &amp; Kumar Sports. All rights reserved.</p>
          <p className="label-caps">Built Different</p>
        </div>
      </div>
    </footer>
  );
}
