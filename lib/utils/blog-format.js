const PLACEHOLDER_SECTION_NAMES = [
  "Recommended Images & AI Prompts",
  "Image Suggestions & AI Prompts",
  "Image Suggestions",
];

const PLACEHOLDER_SECTION_REGEX = new RegExp(
  `<(h[23]|p)[^>]*>\\s*(?:${PLACEHOLDER_SECTION_NAMES.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\s*<\\/\\1>\\s*`,
  "gi"
);

const EMPTY_PARAGRAPH_REGEX = /<p[^>]*>(?:\s|&nbsp;|&#160;)*<\/p>\s*/gi;
const EMPTY_HEADING_REGEX = /<h([23])[^>]*>[\s\S]*?<\/h\1>\s*(?=<h[23][^>]*>|$)/gi;

export function normalizeBlogText(value) {
  if (typeof value !== "string") {
    return value;
  }

  return value.replace(/\s+/g, " ").trim();
}

export function normalizeBlogHtml(content) {
  if (typeof content !== "string" || !content) {
    return content;
  }

  let normalized = content;
  let previous = "";

  while (normalized !== previous) {
    previous = normalized;
    normalized = normalized
      .replace(PLACEHOLDER_SECTION_REGEX, "")
      .replace(EMPTY_PARAGRAPH_REGEX, "")
      .replace(EMPTY_HEADING_REGEX, "");
  }

  return normalized.trim();
}

export function normalizeBlogPost(post) {
  return {
    ...post,
    title: normalizeBlogText(post.title),
    excerpt: normalizeBlogText(post.excerpt),
    description: normalizeBlogText(post.description),
    content: normalizeBlogHtml(post.content),
    author: post.author
      ? {
          ...post.author,
          name: normalizeBlogText(post.author.name),
          role: normalizeBlogText(post.author.role),
        }
      : post.author,
    toc: Array.isArray(post.toc)
      ? post.toc
          .map((item) => ({
            ...item,
            title: normalizeBlogText(item.title),
          }))
          .filter((item) => item.id && item.title)
      : post.toc,
    takeaways: Array.isArray(post.takeaways)
      ? post.takeaways.map((point) => normalizeBlogText(point)).filter(Boolean)
      : post.takeaways,
  };
}

export function normalizeBlogPosts(posts) {
  return posts.map((post) => normalizeBlogPost(post));
}