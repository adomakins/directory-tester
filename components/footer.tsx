'use client';

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Site } from "@/lib/data";
import Subscribe from "@/components/subscribe";

export default function Footer({ site }: { site: Site }) {
    return (
        <footer className="flex flex-col mt-16">
          <Card className="flex flex-col w-full p-6">
            <CardContent>
              <Subscribe site={site} variant="footer" />
            </CardContent>
            <CardContent className="flex flex-col md:flex-row gap-4 md:justify-between items-center pt-0">
              <Link href="/">
                <h1 className={`text-lg font-bold decoration-2 underline text-${site.color}-500 decoration-${site.color}-800 hover:text-${site.color}-600 transition-all duration-300`}>
                {site.name}.com
                </h1>
              </Link>
              <p className="text-sm text-neutral-500">&copy; {new Date().getFullYear()} {site.name}</p>
            </CardContent>
          </Card>
        </footer>
    )
}