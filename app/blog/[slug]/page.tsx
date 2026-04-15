import { blogData } from "@/lib/utils/data.js";
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

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = blogData.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    const hasToc = Boolean(post.toc?.length);
    const contentHtml = normalizeBlogHtml(post.content);

    return (
        <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,_rgba(255,184,0,0.08),_transparent_30%),linear-gradient(180deg,#ffffff_0%,#fbfaf6_100%)]">
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
                                            className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-black prose-headings:scroll-mt-28 prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-5 prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-8 prose-p:my-5 prose-strong:text-black prose-li:text-gray-700 prose-li:my-2 prose-ol:space-y-3 prose-ul:space-y-3 prose-blockquote:border-l-gold prose-blockquote:bg-gold/5 prose-blockquote:px-5 prose-blockquote:py-1 prose-blockquote:rounded-r-xl prose-blockquote:not-italic"
                                            dangerouslySetInnerHTML={{ __html: contentHtml }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export function generateStaticParams() {
    return blogData.map((post) => ({
        slug: post.slug,
    }));
}
