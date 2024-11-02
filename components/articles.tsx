import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function ArticleGrid({ type, articles }: { type: 'featured' | 'all', articles: any[] }) {

  // Featured card component
  function FeaturedCard(article: any) {
    return (
      <Link href={`/articles/${article.slug}`} key={article.slug}>
        <Card className="flex flex-col gap-2 overflow-hidden h-full hover:bg-neutral-100 transition-all duration-300">
          <Image src={article.cover} alt={article.title} width={800} height={400} className="aspect-video w-full object-cover" />
          <CardContent className="flex flex-col gap-2 pt-2 flex-grow">
            <h3 className="text-xl font-bold">{article.title}</h3>
            <p className="text-sm text-muted-foreground">{article.summary}</p>
          </CardContent>
        </Card>
      </Link>
    )
  }

  // Normal card component
  function NormalCard(article: any) {
    return (
      <Link href={`/articles/${article.slug}`} key={article.slug}>
        <Card className="flex flex-col gap-2 overflow-hidden h-full hover:bg-neutral-100 transition-all duration-300">
          <Image src={article.cover} alt={article.title} width={600} height={400} className="aspect-video w-full object-cover" />
          <CardContent className="flex flex-col gap-2 flex-grow md:p-3">
            <h3 className="text-md md:text-lg font-bold">{article.title}</h3>
            <p className="text-xs text-muted-foreground mb-3">{article.summary}</p>
          </CardContent>
        </Card>
      </Link>
    )
  }

  // Return cards grid
  if (type === 'featured') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articles.filter(article => article.featured).map(FeaturedCard)}
      </div>
    )
  } else {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {articles.map(NormalCard)}
      </div>
    )
  }
}