import Image from "next/image";
import { getSiteData, Site } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ArticleGrid from "@/components/articles";
import ListingGrid from "@/components/listings/client";
import { getListings } from "@/components/listings/server";
import notionQuery from "@/lib/query";

export default async function Home() {

  // --- 
  // #region // GET SITE DATA
  const { site } = await getSiteData() as { site: Site };
  if (!site) {
    throw new Error('Site data not found');
  } else {
    // console.log(site);
  }
  // #endregion
  // ---

  const listings = await getListings(site.id);
  const articles = await notionQuery('articles', {
    "property": "Directory",
    "relation": {
      "contains": site.id
    }
  });

  const featuredArticles = articles.filter(article => article.featured);
  const hasMoreArticles = articles.length > featuredArticles.length;

  return (
    <main className="flex flex-col gap-16 mb-4 md:mb-8 z-0">

      <section id="hero" className="relative w-full h-[500px] rounded-2xl overflow-hidden">
        <Image
          src={site.cover}
          alt="Hero image"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center md:items-start text-white p-8">
          <div className="w-full h-full md:w-1/2 flex flex-col justify-between items-center md:items-start">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{site.header}</h1>
              <p className="text-lg md:text-xl mb-8 max-w-2xl opacity-80">{site.description}</p>
            </div>
            <a
              href="#listings"
              className={`text-white px-6 py-3 rounded-md bg-${site.color}-500 hover:bg-${site.color}-600 transition-all duration-300`}
            >
              Explore Now
            </a>
          </div>
        </div>
      </section>

      <section id="featured" className="scroll-mt-20 gap-4 md:gap-8">
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 mb-4 md:mb-8">
          <h2 className="text-4xl font-bold text-center md:text-left">Featured Articles</h2>
          {hasMoreArticles && (
            <Link href="/#articles" className="hidden md:block">
              <Button className={`text-white px-4 py-2 rounded-md bg-${site.color}-500 hover:bg-${site.color}-600 transition-all duration-300`}>
                View All Posts
              </Button>
            </Link>
          )}
        </div>
        <ArticleGrid type="featured" articles={articles} />
        {hasMoreArticles && (
          <Link href="/#articles" className="mt-4 flex items-center justify-center md:hidden">
            <Button className={`text-white px-4 py-2 rounded-md bg-${site.color}-500 hover:bg-${site.color}-600 transition-all duration-300`}>
              View All Posts
            </Button>
          </Link>
        )}
      </section>

      <ListingGrid initialListings={listings} site={site} />

      {hasMoreArticles && (
        <section id="articles" className="scroll-mt-20">
          <h2 className="text-4xl font-bold mb-4 md:mb-8">All Articles</h2>
          <ArticleGrid type="all" articles={articles} />
        </section>
      )}
    </main>
  );
}
