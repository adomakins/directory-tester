import { headers } from "next/headers";
import notionQuery from "./query";

export type Site = {
  id: string;
  name: string;
  color: string;
  "call to action": string;
  "cta full": string;
  domain: string;
  description: string;
  endpoint: string;
  info: string;
  cover: string;
  header: string;
  "listing type": string;
  analytics: string;
}

export async function getSiteData(domain?: string) {
  const directories = await notionQuery('directories')
  
  if (domain) {
    return { site: directories.find(directory => directory.domain === domain) }
  }

  // Use test domain if TEST_DATABASE_DOMAIN is set in env
  if (process.env.TEST_DATABASE_DOMAIN) {
    return { site: directories.find(directory => directory.domain === process.env.TEST_DATABASE_DOMAIN) }
  }

  // Fallback to using headers when domain is not provided (for dynamic routes)
  const hostHeader = (await headers()).get('host') || '';
  return { site: directories.find(directory => directory.domain === hostHeader) }
}

export async function getArticles() {
  const articles = await notionQuery('articles')
  return { articles }
}

export async function getListings() {
  const listings = await notionQuery('listings')
  return { listings }
}