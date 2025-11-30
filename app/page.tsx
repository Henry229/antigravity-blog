import { Metadata } from "next"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { HeroSection } from "./(home)/HeroSection"
import { FeatureSection } from "./(home)/FeatureSection"

export const metadata: Metadata = {
  title: "SimpleBlog - Write. Publish. Share.",
  description: "Minimal Markdown blogging for developers. Everything you need to start your developer blog, and nothing you don't.",
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f6f8] dark:bg-gray-900">
      <Header variant="landing" />
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
      </main>
      <Footer />
    </div>
  )
}
