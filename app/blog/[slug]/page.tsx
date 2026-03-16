import { blogData } from "@/lib/utils/data.js";
import { notFound } from "next/navigation";
import Image from "next/image";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { Footer } from "@/components/layout/footer";
import {
    BlogBreadcrumbs,
    BlogMeta,
    SocialShare,
    TableOfContents,
    KeyTakeaways,
} from "@/components/features/blog/BlogComponents";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = blogData.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <LandingHeader />

            <main className="flex-1 pt-32 pb-24">
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Breadcrumbs */}
                    <BlogBreadcrumbs title={post.title} />

                    {/* Header Section */}
                    <div className="mb-10">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-black mb-4 leading-tight">
                            {post.title}
                        </h1>
                        <p className="text-lg text-gray-600 font-normal mb-6 max-w-2xl">
                            {post.description || post.excerpt}
                        </p>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                            <SocialShare />
                            
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Sidebar - left, sticky */}
                        <aside className="lg:w-[280px] flex-shrink-0 order-2 lg:order-1">
                            <div className="lg:sticky lg:top-32">
                                <TableOfContents items={post.toc || []} />
                            </div>
                        </aside>

                        {/* Main Content - right */}
                        <article className="flex-1 min-w-0 order-1 lg:order-2">
                            {/* Featured Image */}
                            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4 shadow-lg">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            <p className="text-xs text-gray-400 mb-10 italic">Digital Solar</p>

                            {/* Key Takeaways */}
                            {post.takeaways && <KeyTakeaways points={post.takeaways} />}

                            {/* Blog Content */}
                            <div
                                className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-black prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-black prose-li:text-gray-700 prose-ol:space-y-2 prose-ul:space-y-2"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {/* Mobile CTA */}
                            <div className="lg:hidden mt-12">
                            </div>
                        </article>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

// Generate static params for better performance if using static export, or just leave dynamic
export function generateStaticParams() {
    return blogData.map((post) => ({
        slug: post.slug,
    }));
}
