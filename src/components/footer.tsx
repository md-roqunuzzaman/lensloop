import Link from "next/link";
import { Aperture, Mail, MapPin } from "lucide-react";

function InstagramGlyph() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TwitterGlyph() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.3l-5.7-6.9L3.7 22H.6l8.1-9.3L.9 2h7.5l5.1 6.3L18.9 2Zm-1.3 18h2L7.5 4H5.4l12.2 16Z" />
    </svg>
  );
}

function YoutubeGlyph() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.5 6.5a2.8 2.8 0 0 0-2-2C18.7 4 12 4 12 4s-6.7 0-8.5.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .5 5.5 2.8 2.8 0 0 0 2 2C5.3 20 12 20 12 20s6.7 0 8.5-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-5.5ZM9.8 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/gear", label: "Browse gear" },
      { href: "/gear?category=cameras", label: "Cameras" },
      { href: "/gear?category=lighting", label: "Lighting" },
      { href: "/how-it-works", label: "How it works" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
      { href: "/help", label: "Help & support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of service" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
              <Aperture className="h-6 w-6 text-primary" strokeWidth={1.75} />
              LensLoop
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Professional camera, lighting and event gear, rented by the day from
              verified local providers.
            </p>
            <div className="mt-4 space-y-2 text-sm text-muted">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> hello@lensloop.app
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Dhaka · Chattogram · Sylhet
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <a href="https://instagram.com" aria-label="Instagram" className="text-muted hover:text-primary">
                <InstagramGlyph />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className="text-muted hover:text-primary">
                <TwitterGlyph />
              </a>
              <a href="https://youtube.com" aria-label="YouTube" className="text-muted hover:text-primary">
                <YoutubeGlyph />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="exif-chip">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} LensLoop. All rights reserved.</p>
          <p className="exif-chip">F/2.8 · 1/125 · ISO 400 · Built for creators</p>
        </div>
      </div>
    </footer>
  );
}
