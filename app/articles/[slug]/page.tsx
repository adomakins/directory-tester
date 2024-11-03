import Content from "@/components/content";
import notionQuery from "@/lib/query";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Subscribe from "@/components/subscribe";
import { getSiteData } from "@/lib/data";
import { Site } from "@/lib/data";
import type { GetStaticPaths, GetStaticProps, Metadata } from 'next'


// ---
// #region // ISR CONFIGURATION

export async function generateStaticParams() {
  const articles = await notionQuery('articles', undefined, undefined);
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// Add revalidate to the page metadata
export const dynamicParams = true;
export const revalidate = 3600; // Revalidate every hour

// #endregion
// ---

function generateStructuredData(article: any, site: Site) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    image: article.cover,
    datePublished: article.published,
    dateModified: article.edited,
    author: {
      '@type': 'Person',
      name: article.author,
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
  const article = await notionQuery('articles', filterOptions, undefined).then((article) => article[0]);
  const { site } = await getSiteData() as { site: Site };

  return {
    title: `${article.title} | ${site.name}`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      publishedTime: article.published,
      modifiedTime: article.edited,
      authors: [article.author],
      images: [
        {
          url: article.cover,
          width: 1200,
          height: 800,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: [article.cover],
    },
  };
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
    const filterOptions = {
        property: 'Slug',
        rich_text: {
            contains: slug
        }
    };
    const article = await notionQuery('articles', filterOptions, undefined).then((article) => article[0]);
    const { site } = await getSiteData() as { site: Site };
    // console.log(article);

    return (
        <>
        <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData(article, site)),
        }}
        />
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-screen">
            <div className="md:sticky md:top-8 flex flex-col gap-8 col-span-1 h-fit max-h-[calc(100vh-4rem)]">
                <Card className="flex h-fit w-full flex-col gap-8">
                    <CardContent className="flex flex-col gap-4 w-full">
                    <h1 className="text-2xl font-bold">{article.title}</h1>
                    <p className="text-md text-muted-foreground">{article.summary}</p>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-bold text-muted-foreground">
                            <span className="">Written by</span>{' '}
                            {article.author}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            <span className="">Last updated</span>{' '}
                            {new Date(article.edited).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                        </div>
                    </CardContent>
                </Card>
                <Subscribe site={site} variant="sidebar" />
                </div>
                <div className="flex flex-col gap-8 col-span-1 md:col-span-2">
                    <Card>
                        <Image src={article.cover} alt={article.title} width={1200} height={800} className="rounded-lg w-full aspect-video object-cover" />
                    </Card>
                    <Content page={article.id} />
                </div>
            </section>
        </>
    )
}