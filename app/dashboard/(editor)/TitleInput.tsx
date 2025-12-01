"use client"

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TitleInput({ value, onChange }: TitleInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Your Post Title..."
      className="mb-6 w-full border-none bg-transparent p-0 text-3xl font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 dark:text-white md:text-4xl lg:text-5xl"
      autoFocus
    />
  )
}
