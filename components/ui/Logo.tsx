import Link from "next/link"
import { FileText, PenLine } from "lucide-react"
import { cn } from "@/lib/utils"

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  icon?: 'article' | 'edit';
  showText?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { icon: 20, text: "text-base", gap: "gap-1.5" },
  md: { icon: 24, text: "text-lg", gap: "gap-2" },
  lg: { icon: 32, text: "text-xl", gap: "gap-2.5" },
}

export function Logo({
  size = 'md',
  icon = 'article',
  showText = true,
  className
}: LogoProps) {
  const config = sizeConfig[size]
  const IconComponent = icon === 'article' ? FileText : PenLine

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center",
        config.gap,
        className
      )}
    >
      <IconComponent
        size={config.icon}
        className="text-primary"
      />
      {showText && (
        <span className={cn(
          "font-bold text-gray-900 dark:text-white",
          config.text
        )}>
          SimpleBlog
        </span>
      )}
    </Link>
  )
}
