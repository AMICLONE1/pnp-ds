import type { Metadata } from "next";
import Link from "next/link";
import { blogData } from "@/lib/utils/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { Footer } from "@/components/layout/footer";
import {
    BlogBreadcrumbs,
    SocialShare,
    TableOfContents,
    KeyTakeaways,
} from "@/components/features/blog/BlogComponents";
import { normalizeBlogHtml } from "@/lib/utils/blog-format";
import { buildMetadata, SITE_URL, SITE_LEGAL_NAME } from "@/lib/seo";

// Refresh statically-rendered blog detail every hour so updated content
// reaches search engines without a redeploy. Pure SEO move — actual content
// edits still require a code change because blog data lives in source.
export const revalidate = 3600;

/**
 * Pick up to `limit` related posts: same category first (excluding the
 * current post), then fill from other recent posts. This is a pure SEO
 * play — Google ranks pages with strong inbound internal links higher,
 * and "Continue reading" sections keep readers on-site (reducing pogo).
 */
function getRelatedPosts(currentSlug: string, currentCategory: string, limit = 3) {
    const others = (blogData as any[]).filter((p) => p.slug !== currentSlug);
    const sameCategory = others.filter((p) => p.category === currentCategory);
    const rest = others.filter((p) => p.category !== currentCategory);
    return [...sameCategory, ...rest].slice(0, limit);
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const post = (blogData as any[]).find((p) => p.slug === slug);

    if (!post) {
        return {
            title: "Article not found",
            robots: { index: false, follow: false },
        };
    }

    const description = String(post.description || post.excerpt || "")
        .replace(/\s+/g, " ")
        .slice(0, 200);

    return buildMetadata({
        title: post.title,
        description,
        path: `/blog/${post.slug}`,
        image: post.image,
        type: "article",
        publishedTime: post.date,
        authors: [post.author?.name || "PowerNetPro Team"],
        keywords: [post.category, "digital solar", "PowerNetPro blog"].filter(Boolean),
    });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = blogData.find((p: any) => p.slug === slug);

    if (!post) {
        notFound();
    }

    const hasToc = Boolean(post.toc?.length);
    const contentHtml = normalizeBlogHtml(post.content);
    const relatedPosts = getRelatedPosts(post.slug, post.category, 3);

    const articleUrl = `${SITE_URL}/blog/${post.slug}`;
    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.description || post.excerpt,
        image: post.image,
        datePublished: post.date,
        dateModified: post.date,
        author: {
            "@type": "Organization",
            name: post.author?.name || "PowerNetPro Team",
        },
        publisher: {
            "@type": "Organization",
            name: SITE_LEGAL_NAME,
            logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/icon.svg`,
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": articleUrl,
        },
        articleSection: post.category,
        inLanguage: "en-IN",
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE_URL,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: `${SITE_URL}/blog`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: articleUrl,
            },
        ],
    };

    return (
        <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,_rgba(255,184,0,0.08),_transparent_30%),linear-gradient(180deg,#ffffff_0%,#fbfaf6_100%)]">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <LandingHeader />

            <main className="flex-1 pt-28 pb-20 sm:pt-32 sm:pb-24">
                <div className="container mx-auto px-4 max-w-7xl">
                    <BlogBreadcrumbs title={post.title} />

                    <div className={`mt-6 grid gap-10 ${hasToc ? "lg:grid-cols-[280px_minmax(0,1fr)]" : ""}`}>
                        {hasToc && (
                            <aside className="order-2 h-fit lg:sticky lg:top-32 lg:order-1">
                                <TableOfContents items={post.toc || []} />
                            </aside>
                        )}

                        <article className={`order-1 min-w-0 ${hasToc ? "lg:order-2" : ""}`}>
                            <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white/90 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
                                <div className="p-6 sm:p-8 lg:p-10">
                                    <div className="max-w-4xl space-y-6">
                                        <span className="inline-flex items-center rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
                                            {post.category}
                                        </span>

                                        <h1 className="max-w-4xl text-3xl font-heading font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
                                            {post.title}
                                        </h1>

                                        <p className="max-w-3xl text-lg leading-8 text-gray-600 sm:text-xl">
                                            {post.description || post.excerpt}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="inline-flex items-center gap-3 rounded-full border border-gray-100 bg-gray-50 px-4 py-2 text-sm text-gray-600">
                                                <span className="font-semibold text-black">{post.author?.name ?? "PowerNetPro Team"}</span>
                                                <span className="h-1 w-1 rounded-full bg-gray-300" />
                                                <span>{post.readingTime}</span>
                                                <span className="h-1 w-1 rounded-full bg-gray-300" />
                                                <span>{post.date}</span>
                                            </div>
                                        </div>

                                        <SocialShare />
                                    </div>

                                    <div className="mt-8">
                                        <div className="relative aspect-[16/9] overflow-hidden rounded-[1.75rem] shadow-lg">
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-10 max-w-4xl">
                                        {post.takeaways && (
                                            <div className="mb-10">
                                                <KeyTakeaways points={post.takeaways} />
                                            </div>
                                        )}

                                        <div
                                            className="blog-content prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-black prose-headings:scroll-mt-28 prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-5 prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-8 prose-p:my-5 prose-strong:text-black prose-li:text-gray-700 prose-li:my-2 prose-ol:space-y-3 prose-ul:space-y-3 prose-blockquote:border-l-gold prose-blockquote:bg-gold/5 prose-blockquote:px-5 prose-blockquote:py-1 prose-blockquote:rounded-r-xl prose-blockquote:not-italic"
                                            dangerouslySetInnerHTML={{ __html: contentHtml }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>

                    {relatedPosts.length > 0 && (
                        <aside className="mt-16">
                            <h2 className="mb-6 text-2xl font-heading font-bold text-black sm:text-3xl">
                                Continue reading
                            </h2>
                            <div className="grid gap-6 md:grid-cols-3">
                                {relatedPosts.map((related: any) => (
                                    <Link
                                        key={related.slug}
                                        href={`/blog/${related.slug}`}
                                        className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg"
                                    >
                                        <div className="relative aspect-[16/9] overflow-hidden">
                                            <Image
                                                src={related.image}
                                                alt={related.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-5">
                                            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">
                                                {related.category}
                                            </span>
                                            <h3 className="mt-2 line-clamp-2 text-lg font-heading font-bold text-black transition-colors group-hover:text-gold-dark">
                                                {related.title}
                                            </h3>
                                            <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                                                {related.excerpt}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </aside>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export function generateStaticParams() {
    return blogData.map((post: any) => ({
        slug: post.slug,
    }));
}
