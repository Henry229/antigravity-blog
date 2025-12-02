import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col pt-32 pb-20 overflow-hidden">
      {/* Main Background Gradient - Light orange at top fading to paper color */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF0E3] via-[#FAF8F3] to-[#FAF9F6] z-0"></div>

      {/* Background Grid - Visual texture */}
      <div className="absolute inset-0 grid-bg pointer-events-none z-0 mix-blend-multiply opacity-60"></div>

      {/* Bottom Blend Overlay - Ensures grid fades out into the paper background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAF9F6] to-transparent z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-xs font-semibold mb-8 uppercase tracking-wider shadow-sm">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          Pure Markdown
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-8xl font-serif text-[#1c1917] mb-8 leading-[1.1] tracking-tight drop-shadow-sm dark:text-white">
          Write. Publish. <br />
          <span className="italic text-stone-500 dark:text-stone-400">Curate your ideas.</span>
        </h1>

        {/* Subhead */}
        <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto mb-10 font-light leading-relaxed dark:text-stone-400">
          Minimal Markdown blogging designed for developers who value clarity.
          Everything you need to start your developer blog, and nothing you don&apos;t.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="/auth/signup"
            className="group relative bg-[#1c1917] text-white px-8 py-4 rounded-full text-base font-medium overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 dark:bg-white dark:text-[#1c1917]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Writing <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/blog"
            className="group flex items-center gap-2 px-8 py-4 rounded-full border border-stone-300 bg-white/60 backdrop-blur-sm text-stone-700 font-medium hover:border-stone-400 hover:bg-white transition-all shadow-sm hover:shadow-md dark:bg-stone-800/60 dark:text-stone-300 dark:border-stone-600 dark:hover:bg-stone-800"
          >
            <BookOpen size={18} />
            <span>Read the Blog</span>
          </Link>
        </div>

        {/* Abstract "Showcase" Visuals - Book cover style cards */}
        <div className="relative w-full h-64 md:h-96 mt-10">
          {/* Center Card (Main) */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-64 md:w-80 h-80 md:h-96 bg-white border border-stone-200 shadow-2xl rounded-sm p-6 transform hover:-translate-y-4 transition-transform duration-500 z-20 flex flex-col justify-between dark:bg-stone-800 dark:border-stone-700">
            <div className="w-full h-full border-2 border-stone-100 p-4 flex flex-col items-center justify-center text-center dark:border-stone-700">
              <h3 className="font-serif text-2xl mb-2 text-[#1c1917] dark:text-white">The Art of Code</h3>
              <p className="text-xs text-stone-400 font-mono uppercase tracking-widest">Draft #42</p>
              <div className="w-16 h-1 bg-[#D97706] mt-4 mb-8"></div>
              <div className="w-full space-y-2">
                <div className="h-1 w-full bg-stone-100 rounded dark:bg-stone-700"></div>
                <div className="h-1 w-5/6 bg-stone-100 rounded mx-auto dark:bg-stone-700"></div>
                <div className="h-1 w-4/6 bg-stone-100 rounded mx-auto dark:bg-stone-700"></div>
              </div>
            </div>
          </div>

          {/* Left Card */}
          <div className="absolute left-1/2 top-10 -translate-x-[110%] w-56 md:w-72 h-72 md:h-80 bg-[#f8f5f2] border border-stone-200 shadow-xl rounded-sm p-4 transform -rotate-6 hover:-rotate-3 transition-transform duration-500 z-10 hidden sm:block dark:bg-stone-900 dark:border-stone-700">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[10px] uppercase px-2 py-1 tracking-widest dark:bg-stone-600">Markdown</div>
            <div className="w-full h-full flex items-center justify-center text-stone-300">
              <pre className="text-xs font-mono text-left opacity-40 dark:opacity-60">
{`# Hello World
**Bold text**
- List item
- List item`}
              </pre>
            </div>
          </div>

          {/* Right Card */}
          <div className="absolute left-1/2 top-10 -translate-x-[-10%] w-56 md:w-72 h-72 md:h-80 bg-stone-800 border border-stone-700 shadow-xl rounded-sm p-4 transform rotate-6 hover:rotate-3 transition-transform duration-500 z-10 hidden sm:block">
            <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-red-500"></div>
            <div className="absolute top-4 right-9 w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="absolute top-4 right-14 w-3 h-3 rounded-full bg-green-500"></div>
            <div className="mt-8 text-stone-400 font-mono text-xs">
              <span className="text-purple-400">const</span> <span className="text-blue-400">publish</span> = <span className="text-yellow-300">true</span>;
              <br /><br />
              <span className="text-stone-500">{"// Instant deploy"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
