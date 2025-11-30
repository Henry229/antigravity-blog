import Link from "next/link"
import { Button } from "@/components/ui/Button"

export function HeroSection() {
  return (
    <section className="py-20 text-center sm:py-28">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4">
        {/* Headlines */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-tighter text-gray-900 dark:text-white sm:text-6xl">
            Write. Publish. Share.
          </h1>
          <p className="max-w-xl text-lg font-normal text-gray-600 dark:text-gray-400">
            Minimal Markdown blogging for developers. Everything you need to start your developer blog, and nothing you don&apos;t.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/blog">Read Blog</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
