import { StoryMarket } from "@/components/StoryMarket"
import { SiteFooter, SiteHeader } from "@/components/SiteChrome"

export default function MarketPage() {
  return (
    <div className="page">
      <SiteHeader current="/cho" />
      <main>
        <StoryMarket />
      </main>
      <SiteFooter />
    </div>
  )
}
