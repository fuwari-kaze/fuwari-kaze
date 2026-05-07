// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import expressiveCode from "astro-expressive-code";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  site: "https://kaze.amia.work",
  trailingSlash: "never",
  integrations: [sitemap(), expressiveCode()],
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  markdown: {
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["math"],
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    smartypants: {
      dashes: "oldschool",
      openingQuotes: { double: "「", single: "『" },
      closingQuotes: { double: "」", single: "』" },
      ellipses: "unspaced",
      backticks: false,
    },
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Shippori Mincho",
      weights: [400, 700],
      subsets: ["latin", "latin-ext", "japanese"],
      cssVariable: "--font-shippori-mincho",
    },
    {
      provider: fontProviders.fontsource(),
      name: "M PLUS 1 Code",
      weights: [400, 700],
      subsets: ["latin", "latin-ext", "japanese"],
      cssVariable: "--font-m-plus-1-code",
    },
  ],
  session: {
    cookie: {
      name: "__kaze_session",
      sameSite: "strict",
    },
    ttl: 14400,
  },
});
