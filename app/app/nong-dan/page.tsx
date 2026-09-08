import { FarmerDesk } from "@/components/FarmerDesk"
import { SiteFooter, SiteHeader } from "@/components/SiteChrome"

export default function FarmerPage() {
  return (
    <div className="page">
      <SiteHeader current="/nong-dan" />
      <main>
        <FarmerDesk />
      </main>
      <SiteFooter />
    </div>
  )
}
