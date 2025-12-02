import { LucideIcon, MoveRight } from "lucide-react"

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  tag: string;
  elevated?: boolean;
}

export function FeatureCard({ icon: Icon, title, description, tag, elevated = false }: FeatureCardProps) {
  return (
    <div
      className={`
        group relative bg-white p-8 pt-12 min-h-[320px]
        border border-stone-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]
        hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-300
        flex flex-col justify-between
        dark:bg-stone-800 dark:border-stone-700
        ${elevated ? 'md:-translate-y-8' : ''}
      `}
    >
      {/* Colored Top Border accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-100 via-orange-300 to-orange-100 opacity-50"></div>

      {/* Tag style */}
      <div className="absolute top-0 left-6 -translate-y-1/2 bg-[#FAF9F6] border border-stone-200 px-3 py-1 shadow-sm text-[10px] uppercase font-bold tracking-widest text-stone-500 dark:bg-stone-900 dark:border-stone-700 dark:text-stone-400">
        {tag}
      </div>

      <div>
        {/* Icon */}
        <div className="w-12 h-12 mb-6 text-[#D97706] bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-[#D97706] group-hover:text-white transition-colors duration-300 dark:bg-orange-900/30">
          <Icon size={24} strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-serif text-[#1c1917] mb-4 group-hover:text-[#D97706] transition-colors dark:text-white">
          {title}
        </h3>

        {/* Description */}
        <p className="text-stone-600 leading-relaxed font-light text-sm dark:text-stone-400">
          {description}
        </p>
      </div>

      {/* Learn more link */}
      <div className="mt-8 pt-6 border-t border-stone-100 flex items-center text-[#D97706] text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 cursor-pointer dark:border-stone-700">
        Learn more <MoveRight size={14} className="ml-2" />
      </div>
    </div>
  )
}
