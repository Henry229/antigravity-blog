import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'feature' | 'post';
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const variantStyles = {
  default: "",
  feature: "hover:border-primary/50 transition-colors",
  post: "hover:shadow-md transition-shadow",
}

const paddingStyles = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
}

export function Card({
  className,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200/80 bg-white shadow-sm",
        "dark:border-gray-700 dark:bg-gray-800",
        variantStyles[variant],
        paddingStyles[padding],
        hoverable && "hover:shadow-md transition-shadow cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("pb-0", className)} {...props}>
      {children}
    </div>
  )
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("pt-0", className)} {...props}>
      {children}
    </div>
  )
}
