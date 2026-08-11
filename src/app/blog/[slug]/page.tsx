import { notFound } from "next/navigation";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  category?: string;
  coverImage?: string;
  author?: {
    name?: string;
  };
  createdAt?: string;
  publishedAt?: string;
}

interface BlogResponse {
  success: boolean;
  data: BlogPost;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/blog/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }

      console.error(`Blog API request failed: /blog/${slug}`, response.status);

      return null;
    }

    const payload = (await response.json()) as BlogResponse;

    return payload.data ?? null;
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const date = post.publishedAt ?? post.createdAt;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Category */}
          {post.category && (
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              {post.category}
            </p>
          )}

          {/* Date */}
          {date && (
            <p className="mt-2 text-xs uppercase tracking-wide text-muted">
              {new Date(date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}

          {/* Title */}
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {post.excerpt}
            </p>
          )}

          {/* Author */}
          {post.author?.name && (
            <p className="mt-5 text-sm text-muted">
              By{" "}
              <span className="font-medium text-foreground">
                {post.author.name}
              </span>
            </p>
          )}

          {/* Cover Image */}
          {post.coverImage && (
            <div className="mt-10 overflow-hidden rounded-xl border border-border">
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-auto w-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="mt-10 whitespace-pre-wrap text-sm leading-8 text-foreground/90 sm:text-base">
            {post.content || "This article does not have any content yet."}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
