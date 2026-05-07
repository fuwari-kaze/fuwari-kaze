import fs from "fs";
import matter from "gray-matter";
import crypto from "crypto";
import { glob } from "glob";
import { protectConfig } from "../src/content/consts.ts";

async function uploadPasswords() {
  const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
  const HASH_KV_ID = process.env.HASH_KV_ID;
  const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

  if (!CLOUDFLARE_ACCOUNT_ID || !HASH_KV_ID || !CLOUDFLARE_API_TOKEN) {
    console.error("Missing Cloudflare KV configuration environment variables.");
    process.exit(1);
  }

  try {
    const files = await glob("src/content/private/**/*.{md,mdx}");
    const bulkData = [];

    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      const { data } = matter(content);
      let passwordRaw;

      if (!data.password) {
        passwordRaw = protectConfig.password;
      } else {
        passwordRaw = data.password;
      }

      const slug = data.slug;
      const salt = crypto.randomBytes(16).toString("hex");
      const hash = crypto
        .pbkdf2Sync(passwordRaw, salt, 100000, 64, "sha512")
        .toString("hex");
      const hashedPassword = `${salt}:${hash}`;

      bulkData.push({
        key: slug,
        value: JSON.stringify({
          passwordHash: hashedPassword,
          updatedAt: new Date(),
        }),
      });
    }

    if (bulkData.length === 0) {
      console.log("No protected posts with passwords found.");
      return;
    }

    const bulkUrl = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${HASH_KV_ID}/bulk`;
    const response = await fetch(bulkUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bulkData),
    });

    if (!response.ok) {
      throw new Error(`Failed to bulk upload to KV: ${response.statusText}`);
    }

    console.log(
      "Successfully bulk uploaded all hashed passwords to Cloudflare KV.",
    );
  } catch (error) {
    console.error("Error uploading passwords:", error);
  }
}

uploadPasswords();
