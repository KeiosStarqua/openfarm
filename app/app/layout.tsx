import type { Metadata } from "next"
import { Be_Vietnam_Pro, Fraunces } from "next/font/google"
import { FarmProvider } from "@/components/FarmProvider"
import "./globals.css"

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be",
})

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-fraunces",
})

export const metadata: Metadata = {
  title: "OpenFarm — Từ ruộng đến bàn ăn",
  description:
    "Nông dân ghi nhật ký trồng trọt trên Sui. Người mua đọc Harvest Story trước khi tin.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${sans.variable} ${display.variable} h-full`}>
      <body>
        <FarmProvider>{children}</FarmProvider>
      </body>
    </html>
  )
}
