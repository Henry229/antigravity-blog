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
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] dark:bg-stone-900 font-sans text-stone-900 dark:text-stone-100 selection:bg-[#D97706] selection:text-white">
      <Header variant="landing" />
      <main className="flex-grow">
        <HeroSection />
        <FeatureSection />
      </main>
      <Footer />
    </div>
  )
}
