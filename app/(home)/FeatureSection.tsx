import { PenLine, Zap, Lock } from "lucide-react"
import { FeatureCard } from "./FeatureCard"

const features = [
  {
    icon: PenLine,
    title: "Markdown Editor",
    description: "A clean, intuitive writing environment that gets out of your way. No distractions, just you and your words.",
    tag: "The Craft"
  },
  {
    icon: Zap,
    title: "Instant Publish",
    description: "Go from draft to live in seconds. Share your ideas with the world without any friction or complex pipelines.",
    tag: "Velocity"
  },
  {
    icon: Lock,
    title: "Own Your Content",
    description: "You have full control over your data. Export your content anytime, no questions asked. No lock-in.",
    tag: "Sovereignty"
  }
]

export function FeatureSection() {
  return (
    <section className="relative py-32 bg-white border-t border-stone-100 dark:bg-stone-900 dark:border-stone-800" id="features">
      {/* Background vertical lines */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #f5f5f4 1px, transparent 1px)',
          backgroundSize: '80px 100%'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-24">
          <span className="text-[#D97706] font-semibold tracking-widest text-xs uppercase mb-4 block">
            The Toolkit
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#1c1917] mb-6 dark:text-white">
            Everything you need to <br />write deeper.
          </h2>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              tag={feature.tag}
              elevated={index === 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
