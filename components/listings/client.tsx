"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // use this for the filter
import { Site } from "@/lib/data";
import ListingRating from "./rating";

export default function ListingGrid({ initialListings, site }: { initialListings: any[], site: Site }) {
  const [filteredListings, setFilteredListings] = useState(initialListings);

  console.log(initialListings);

  // Normal card component
  function ListingCard(listing: any) {
    return (
        <Link href={`/${site["listing type"]}/${listing.slug}`}>
        <Card className="flex flex-col gap-2 overflow-hidden h-full hover:bg-neutral-100 transition-all duration-300">
          <Image src={listing.cover} alt={listing.name} width={600} height={400} className="aspect-video w-full object-cover" />
          <CardContent className="flex flex-col gap-2 flex-grow md:p-3">
            <h3 className="text-md font-bold">{listing.name}</h3>
            <ListingRating rating={listing.rating} />
            <p className="text-sm text-muted-foreground">{listing.description}</p>
            {listing.subtypes_data.map((subtype: any) => (
              <p key={subtype.name} className={`text-xs bg-${subtype.color}-100 w-fit text-${subtype.color}-900 px-2 py-1 rounded-md mb-3`}>
                {subtype.name}
              </p>
            ))}
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <section id="listings" className="scroll-mt-20">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4 md:mb-8">
        <h2 className="text-4xl font-bold text-center md:text-left">All {site["listing type"][0].toUpperCase() + site["listing type"].slice(1)}</h2>
        <div className="flex justify-center md:justify-end">
          <Input 
            type="search"
            placeholder={`Search ${site["listing type"]}...`}
            className="md:min-w-[300px] max-w-[400px]"
            onChange={(e) => {
              const searchValue = e.target.value.toLowerCase();
              const filtered = initialListings.filter(listing => 
                listing.name.toLowerCase().includes(searchValue)
              );
              setFilteredListings(filtered);
            }}
          />
        </div>
      </div>
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.slug} {...listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No {site["listing type"]} found. Try adjusting your search.
        </div>
      )}
    </section>
  )
}