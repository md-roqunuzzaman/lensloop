import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Wallet,
  CalendarClock,
  Camera,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GearCard } from "@/components/gear/gear-card";
import { StarRating } from "@/components/star-rating";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { categories, gearItems, testimonials, blogPosts, platformStats } from "@/lib/content";
import { categoryIconMap } from "@/lib/category-icons";

const contactSheetFrames = gearItems.slice(0, 6);

const steps = [
  {
    frame: "01A",
    title: "Pick your dates",
    body: "Browse verified listings and check live availability for the exact days you're shooting.",
  },
  {
    frame: "02A",
    title: "Book & pay securely",
    body: "Reserve instantly with Stripe or SSLCommerz. Funds are held until pickup is confirmed.",
  },
  {
    frame: "03A",
    title: "Pick up & shoot",
    body: "Meet your provider, do a quick condition check together, and you're rolling.",
  },
  {
    frame: "04A",
    title: "Return & review",
    body: "Drop the gear back, get your deposit released, and leave a review for the next renter.",
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Verified providers only",
    body: "Every provider passes an ID and equipment-condition check before listing.",
  },
  {
    icon: Wallet,
    title: "Transparent daily pricing",
    body: "No hidden fees — the price per day shown is the price you pay, insurance included.",
  },
  {
    icon: CalendarClock,
    title: "Real-time availability",
    body: "Calendars sync the moment a booking is made, so you never chase a phantom listing.",
  },
  {
    icon: Truck,
    title: "Flexible pickup & delivery",
    body: "Meet in person for same-day pickups, or arrange courier delivery for tighter schedules.",
  },
];

const faqs = [
  {
    q: "What happens if the gear is damaged during my rental?",
    a: "Every booking includes basic protection against normal wear. Accidental damage is covered up to the listed deposit; anything beyond that is assessed jointly with the provider before your deposit is released.",
  },
  {
    q: "How fast can I get gear on the same day?",
    a: 'Most providers confirm within 30 minutes and offer same-day pickup within their city. Filter by "available today" on the browse page to see real-time options near you.',
  },
  {
    q: "Can I list my own gear as a provider?",
    a: "Yes — register as a provider, add your gear with photos and specs, and set your own daily rate. Payouts are released automatically once a rental is marked returned.",
  },
  {
    q: "Which payment methods are supported?",
    a: "Stripe for international cards and SSLCommerz for local bKash, Nagad, and card payments in Bangladesh.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24 lg:px-8">
          <div>
            <span className="exif-chip">Rent · Shoot · Return</span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Professional gear,
              <br /> booked like a lens change.
            </h1>
            <p className="mt-5 max-w-md text-base text-muted sm:text-lg">
              Cameras, lighting, audio and full event rigs from verified local
              providers — reserved by the day, ready when your call time is.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/gear">
                  Browse gear <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register">Become a provider</Link>
              </Button>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {platformStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs uppercase tracking-wide text-muted">{stat.label}</dt>
                  <dd className="font-display text-2xl font-semibold">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {contactSheetFrames.map((gear, i) => (
              <div
                key={gear.id}
                className={`group relative aspect-[4/5] overflow-hidden rounded-md border border-border bg-surface-muted transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  i % 2 === 1 ? "translate-y-3" : ""
                }`}
              >
                <Image
                  src={gear.images[0]}
                  alt={gear.title}
                  fill
                  sizes="(min-width: 1024px) 16vw, 33vw"
                  className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
                />
                <span className="absolute left-1.5 top-1.5 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-white">
                  {String(i + 1).padStart(2, "0")}A
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Browse by category</h2>
            <Link href="/gear" className="hidden text-sm font-medium text-primary hover:underline sm:block">
              View all gear →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => {
              const Icon = categoryIconMap[cat.icon ?? ""] ?? Camera;
              return (
                <Link
                  key={cat.id}
                  href={`/gear?category=${cat.slug}`}
                  className="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface p-5 text-center transition-colors hover:border-primary"
                >
                  <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                  <span className="text-sm font-medium">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">Featured this week</h2>
              <p className="mt-1 text-sm text-muted">Popular picks currently available near you.</p>
            </div>
            <Link href="/gear" className="hidden text-sm font-medium text-primary hover:underline sm:block">
              View all gear →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gearItems.slice(0, 6).map((gear) => (
              <GearCard key={gear.id} gear={gear} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">How it works</h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.frame}>
                <span className="font-mono text-xs tracking-widest text-primary">{step.frame}</span>
                <h3 className="mt-2 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Why creators choose LensLoop</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Card key={f.title}>
                <CardContent className="p-5">
                  <f.icon className="h-6 w-6 text-secondary" strokeWidth={1.5} />
                  <h3 className="mt-3 font-display text-base font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted">{f.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-foreground py-16 text-background">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <span className="exif-chip !bg-background/10 !text-background/70 !border-background/20">For Providers</span>
            <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
              Turn idle gear into recurring income.
            </h2>
            <p className="mt-3 max-w-lg text-background/70">
              List your cameras, lenses, or staging equipment in minutes. Set your own
              rates, approve bookings, and get paid out automatically once gear is returned.
            </p>
          </div>
          <div className="flex lg:justify-end">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">
                Start listing gear <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Trusted by working creators</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-5">
                  <StarRating rating={5} />
                  <p className="mt-3 text-sm text-foreground/90">&ldquo;{t.quote}&rdquo;</p>
                  <p className="mt-4 text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">From the blog</h2>
            <Link href="/blog" className="hidden text-sm font-medium text-primary hover:underline sm:block">
              View all posts →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full">
                  <CardContent className="p-5">
                    <p className="text-xs uppercase tracking-wide text-muted">
                      {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    <h3 className="mt-2 font-display text-base font-semibold group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-6">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Ready to book your next shoot?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Create a free account and check live availability across every provider on LensLoop.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/register">
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/gear">Browse gear</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
