import Content from "@/components/content";
import notionQuery from "@/lib/query";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Subscribe from "@/components/subscribe";
import { getSiteData } from "@/lib/data";
import { Site } from "@/lib/data";
import ListingRating from "@/components/listings/rating";
import { Metadata } from "next";

export interface Listing {
    id: string;
    slug: string;
    name: string;
    rating: number;
    description: string;
    cover: string;
    subtypes_data: any[];
}

interface Props {
    listing: Listing;
}

// ---
// #region // ISR CONFIGURATION

export async function generateStaticParams() {
  const listings = await notionQuery('listings', undefined, undefined);
  return listings.map((listing) => ({
    listings: listing.type,
    slug: listing.slug,
  }));
}

export const revalidate = 3600; // Revalidate every hour

// #endregion
// ---

function generateStructuredData(listing: any, site: Site) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: listing.name,
    description: listing.description,
    image: listing.cover,
    url: listing.website,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: listing.rating,
      bestRating: '5',
      worstRating: '1',
    },
    publisher: {
      '@type': 'Organization',
      name: site.name,
    },
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const filterOptions = {
    property: 'Slug',
    rich_text: { contains: slug }
  };
  const listing = await notionQuery('listings', filterOptions, undefined).then((listing) => listing[0]);
  const { site } = await getSiteData() as { site: Site };

  return {
    title: `${listing.name} | ${site.name}`,
    description: listing.description,
    openGraph: {
      title: listing.name,
      description: listing.description,
      type: 'website',
      images: [
        {
          url: listing.cover,
          width: 1200,
          height: 800,
          alt: listing.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: listing.name,
      description: listing.description,
      images: [listing.cover],
    },
  };
}

export default async function Listing({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
    const filterOptions = {
        property: 'Slug',
        rich_text: {
            contains: slug
        }
    };
    const listing = await notionQuery('listings', filterOptions, undefined).then((listing) => listing[0]);
    const { site } = await getSiteData() as { site: Site };
    // console.log(listing);

    return (
        <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateStructuredData(listing, site)),
          }}
        />
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-screen">
            <div className="md:sticky md:top-8 flex flex-col gap-8 col-span-1 h-fit max-h-[calc(100vh-4rem)]">
                <Card className="flex h-fit w-full flex-col gap-8">
                    <CardContent className="flex flex-col gap-4 w-full">
                    <h1 className="text-2xl font-bold">{listing.name}</h1>
                    <ListingRating rating={listing.rating} />
                    <p className="text-md text-muted-foreground">{listing.description}</p>
                    {listing.website && <a href={`${listing.website}?utm_source=${site.domain}&utm_medium=referral&utm_campaign=directory`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Visit Website</a>}
                    <div className="flex flex-wrap gap-2">
                        {listing.subtypes_data.map((subtype: any, index: number) => (
                            <p key={listing.id + index} 
                                className={`text-xs bg-${subtype.color}-100 text-${subtype.color}-900 px-2 py-1 rounded-md mb-3`}>
                                {subtype.name}
                            </p>
                        ))}
                    </div>
                    </CardContent>
                </Card>
                <Subscribe site={site} variant="sidebar" />
            </div>
            <div className="flex flex-col gap-8 col-span-1 md:col-span-2">
                <Card>
                    <Image src={listing.cover} alt={listing.name} width={1200} height={800} className="rounded-lg w-full aspect-video object-cover" />
                </Card>
                <Content page={listing.id} />
            </div>
        </section>
        </>
    )
}