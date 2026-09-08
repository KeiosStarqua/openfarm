import { StoryArticle } from "@/components/StoryArticle"
import { SiteFooter, SiteHeader } from "@/components/SiteChrome"

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="page">
      <SiteHeader current="/cho" />
      <main>
        <StoryArticle id={id} />
      </main>
      <SiteFooter />
    </div>
  )
}
