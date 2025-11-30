import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  asChild?: boolean;
}

const variantStyles = {
  primary: "bg-primary text-white hover:bg-primary/90",
  secondary: "bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-800",
  ghost: "bg-transparent text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
  danger: "bg-red-600 text-white hover:bg-red-700",
}

const sizeStyles = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled,
    asChild = false,
    type = 'button',
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || loading

    // asChild일 때는 button 전용 props를 전달하지 않음
    const buttonProps = asChild
      ? {}
      : { ref, disabled: isDisabled, type }

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-bold transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          isDisabled && "opacity-50 pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...buttonProps}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"
