import notionQuery from "@/lib/query";

export async function getListings(site: string) {
  const listings = await notionQuery('listings', {
    "property": "Directory",
    "relation": {
      "contains": site
    }
  });
  return listings;
}