import type { Metadata } from "next"
import { ClerkProvider } from '@clerk/nextjs'
import { Bayon, Kumbh_Sans } from "next/font/google"
import { PostHogProvider } from "@/components/PostHogProvider"
import "./globals.css"

const bayon = Bayon({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
})

const kumbhSans = Kumbh_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
})

export const metadata: Metadata = {
  title: "Seedlot Roaster — AI-Powered Roast Profiles for ROEST",
  description:
    "Build optimized roast profiles for your ROEST sample roaster using AI. Free tool by Seedlot.",
  openGraph: {
    title: "Seedlot Roaster — AI-Powered Roast Profiles for ROEST",
    description: "Build optimized roast profiles for your ROEST sample roaster using AI.",
    siteName: "Seedlot",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${bayon.variable} ${kumbhSans.variable} font-body antialiased`}
      >
        <ClerkProvider>
          <PostHogProvider>
            {children}
          </PostHogProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
