import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { siteConfig } from "@consts";

export async function GET(context) {
  const posts = await getCollection("cpub", ({ data }) => {
    return data.draft !== true;
  });
  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/posts/${post.id}`,
    })),
  });
}
