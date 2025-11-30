import { PenLine, Rocket, Lock } from "lucide-react"
import { FeatureCard } from "./FeatureCard"

const features = [
  {
    icon: PenLine,
    title: "Markdown Editor",
    description: "A clean, intuitive writing environment that gets out of your way and lets you focus on your content."
  },
  {
    icon: Rocket,
    title: "Instant Publish",
    description: "Go from draft to live in seconds. Share your ideas with the world without any friction."
  },
  {
    icon: Lock,
    title: "Own Your Content",
    description: "You have full control over your data. Export your content anytime, no questions asked."
  }
]

export function FeatureSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
