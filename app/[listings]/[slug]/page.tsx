import Content from "@/components/content";
import notionQuery from "@/lib/query";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Subscribe from "@/components/subscribe";
import { getSiteData } from "@/lib/data";
import { Site } from "@/lib/data";
import ListingRating from "@/components/listings/rating";

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

    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-screen">
            <div className="md:sticky md:top-8 flex flex-col gap-8 col-span-1 h-fit max-h-[calc(100vh-4rem)]">
                <Card className="flex h-fit w-full flex-col gap-8">
                    <CardContent className="flex flex-col gap-4 w-full">
                    <h1 className="text-2xl font-bold">{listing.name}</h1>
                    <ListingRating rating={listing.rating} />
                    <p className="text-md text-muted-foreground">{listing.description}</p>
                    {listing.subtypes_data.map((subtype: any) => (
                        <p key={subtype.name} className={`text-xs bg-${subtype.color}-100 w-fit text-${subtype.color}-900 px-2 py-1 rounded-md mb-3`}>
                            {subtype.name}
                        </p>
                    ))}
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
    )
}