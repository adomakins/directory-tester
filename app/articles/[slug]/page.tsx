import Content from "@/components/content";
import notionQuery from "@/lib/query";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Subscribe from "@/components/subscribe";
import { getSiteData } from "@/lib/data";
import { Site } from "@/lib/data";

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
    )
}