import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { blogPosts } from "@/lib/content";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-wide text-muted">
          {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">{post.title}</h1>
        <p className="mt-4 text-lg text-muted">{post.excerpt}</p>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-foreground/90">
          <p>
            This article is part of the LensLoop resource library, written for renters and
            providers navigating gear decisions on real production timelines. Full long-form
            content for this post is coming soon — check back shortly.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
