'use client'

import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'

export type FilterOption = { value: string; label?: string; count?: number }

type FilterSelectBase = {
  label: string
  options: readonly FilterOption[]
  searchable?: boolean
  align?: 'start' | 'center' | 'end'
  className?: string
}

// A dropdown filter. `multi` shows checkboxes and stays open; `single` shows radio dots + an "Any"
// row and closes on pick.
export type FilterSelectProps =
  | (FilterSelectBase & {
      mode: 'multi'
      value: string[]
      onChange: (next: string[]) => void
    })
  | (FilterSelectBase & {
      mode: 'single'
      value: string | null
      onChange: (next: string | null) => void
      anyLabel?: string
    })

function Indicator({
  active,
  shape,
}: {
  active: boolean
  shape: 'square' | 'dot'
}) {
  return (
    <span
      className={cn(
        'flex size-4 shrink-0 items-center justify-center border',
        shape === 'square' ? 'rounded' : 'rounded-full',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border',
      )}
    >
      {active && shape === 'square' && <Check className="size-3" />}
    </span>
  )
}

export function FilterSelect(props: FilterSelectProps) {
  const {
    label,
    options,
    searchable = true,
    align = 'start',
    className,
  } = props
  const [open, setOpen] = useState(false)

  const shape = props.mode === 'multi' ? 'square' : 'dot'
  const isActive = (value: string | null) =>
    props.mode === 'multi'
      ? value != null && props.value.includes(value)
      : props.value === value

  // Owns the toggle math; the parent just receives the next value.
  const select = (value: string | null) => {
    if (props.mode === 'multi') {
      const id = value as string
      props.onChange(
        props.value.includes(id)
          ? props.value.filter((v) => v !== id)
          : [...props.value, id],
      )
    } else {
      props.onChange(value)
      setOpen(false)
    }
  }

  const selectedLabel =
    props.mode === 'single' && props.value != null
      ? (options.find((o) => o.value === props.value)?.label ?? props.value)
      : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          'inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-transparent px-3 text-sm text-foreground transition-colors hover:border-primary/50',
          className,
        )}
      >
        {label}
        {selectedLabel && (
          <span className="text-muted-foreground">· {selectedLabel}</span>
        )}
        {props.mode === 'multi' && props.value.length > 0 && (
          <span className="rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground tabular-nums">
            {props.value.length}
          </span>
        )}
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align={align} className="w-60 gap-0 p-0">
        <Command>
          {searchable && (
            <CommandInput placeholder={`Filter ${label.toLowerCase()}`} />
          )}
          <CommandList>
            <CommandEmpty>No matches.</CommandEmpty>
            <CommandGroup>
              {props.mode === 'single' && (
                <CommandItem
                  value={props.anyLabel ?? `Any ${label}`}
                  onSelect={() => select(null)}
                  className="gap-2.5"
                >
                  <Indicator active={props.value == null} shape="dot" />
                  <span className="flex-1 truncate text-muted-foreground">
                    {props.anyLabel ?? `Any ${label}`}
                  </span>
                </CommandItem>
              )}
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label ?? option.value}
                  onSelect={() => select(option.value)}
                  className="gap-2.5"
                >
                  <Indicator active={isActive(option.value)} shape={shape} />
                  <span className="flex-1 truncate">
                    {option.label ?? option.value}
                  </span>
                  {option.count != null && (
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {option.count}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
