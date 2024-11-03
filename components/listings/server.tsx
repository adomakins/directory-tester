import notionQuery from "@/lib/query";

export async function getListings(site: string) {
  const listings = await notionQuery('listings', {
    and: [
      {
        "property": "Directory",
        "relation": {
          "contains": site
        }
      },
      {
        "property": "Published",
        checkbox: {
          equals: true
        }
      }
    ]
  });

  console.log(JSON.stringify(listings.map(listing => {
    const { cover, subtypes_data, ...rest } = listing;
    return {
      ...rest,
      subtypes_data: subtypes_data.map((subtype: any) => subtype.name)
    };
  }), null, 2));
  return listings;
}