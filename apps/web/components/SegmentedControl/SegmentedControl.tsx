import type { ReactNode } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

export type SegmentedOption<T extends string> = {
  value: T
  label?: ReactNode
  icon?: ReactNode
  ariaLabel?: string
}

export type SegmentedControlProps<T extends string> = {
  options: readonly SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'outline'
  ariaLabel: string
  className?: string
}

// Single-select over Base UI's ToggleGroup, which is multi-select and emits [] on re-click; we
// control value and drop the empty result so the selection never clears.
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'default',
  variant = 'outline',
  ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  return (
    <ToggleGroup
      value={[value]}
      spacing={0}
      variant={variant}
      size={size}
      aria-label={ariaLabel}
      className={cn('overflow-hidden rounded-lg', className)}
      onValueChange={(next) => {
        const picked = next.find((v) => v !== value) ?? next[0]
        if (picked != null) onChange(picked as T)
      }}
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={option.ariaLabel}
          className="gap-1.5 text-muted-foreground data-pressed:bg-primary/10 data-pressed:text-primary"
        >
          {option.icon}
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
