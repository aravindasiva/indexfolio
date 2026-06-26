import { useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SlidersHorizontal } from 'lucide-react'
import type { EtfFilters } from '@/lib/api'
import { Surface } from '@/components/Surface/Surface'
import { Chip } from '@/components/Chip/Chip'
import { Pill } from '@/components/Pill/Pill'
import { SearchField } from '@/components/SearchField/SearchField'
import { fadeUpItem, staggerContainer, tactile } from '@/lib/motion'
import type { ScreenerFilters, SetScreenerFilters } from '../../utils/filters'
import {
  assetClassLabel,
  FUND_SIZE_PRESETS,
  TER_PRESETS,
} from '../../utils/options'

type ActivePill = { key: string; label: string; clear: () => void }

/*
  The screener's filter toolbar: a frosted control panel with search + chip
  groups + animated active-filter pills. On mobile the chip groups collapse
  behind a "Filters" toggle so they do not dominate the screen.
*/
export function FilterBar({
  filters,
  setFilters,
  options,
}: {
  filters: ScreenerFilters
  setFilters: SetScreenerFilters
  options: EtfFilters | undefined
}) {
  const [open, setOpen] = useState(false)

  // Any filter change resets to page 1.
  const update = (patch: Partial<ScreenerFilters>) =>
    void setFilters({ ...patch, page: 1 })

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

  const pills = buildPills(filters, update)

  const groups = (
    <>
      {options && options.assetClass.length > 0 && (
        <ChipGroup label="Asset">
          <Chip
            active={!filters.assetClass}
            onClick={() => update({ assetClass: '' })}
          >
            All
          </Chip>
          {options.assetClass.map((option) => (
            <Chip
              key={option.value}
              active={filters.assetClass === option.value}
              onClick={() => update({ assetClass: option.value })}
            >
              {assetClassLabel(option.value)} <Count n={option.count} />
            </Chip>
          ))}
        </ChipGroup>
      )}

      <ChipGroup label="Type">
        <Chip active={!filters.type} onClick={() => update({ type: null })}>
          All
        </Chip>
        <Chip
          active={filters.type === 'acc'}
          onClick={() => update({ type: 'acc' })}
        >
          Acc
        </Chip>
        <Chip
          active={filters.type === 'dist'}
          onClick={() => update({ type: 'dist' })}
        >
          Dist
        </Chip>
      </ChipGroup>

      {options && options.domicile.length > 0 && (
        <ChipGroup label="Domicile">
          {options.domicile.map((option) => (
            <Chip
              key={option.value}
              active={filters.domicile.includes(option.value)}
              onClick={() =>
                update({ domicile: toggle(filters.domicile, option.value) })
              }
            >
              {option.value} <Count n={option.count} />
            </Chip>
          ))}
        </ChipGroup>
      )}

      {options && options.exchange.length > 0 && (
        <ChipGroup label="Exchange">
          {options.exchange.map((option) => (
            <Chip
              key={option.value}
              active={filters.exchange.includes(option.value)}
              onClick={() =>
                update({ exchange: toggle(filters.exchange, option.value) })
              }
            >
              {option.value} <Count n={option.count} />
            </Chip>
          ))}
        </ChipGroup>
      )}

      <ChipGroup label="TER">
        <Chip
          active={filters.maxTer == null}
          onClick={() => update({ maxTer: null })}
        >
          Any
        </Chip>
        {TER_PRESETS.map((preset) => (
          <Chip
            key={preset.value}
            active={filters.maxTer === preset.value}
            onClick={() => update({ maxTer: preset.value })}
          >
            {preset.label}
          </Chip>
        ))}
      </ChipGroup>

      <ChipGroup label="Fund size">
        <Chip
          active={filters.minFundSize == null}
          onClick={() => update({ minFundSize: null })}
        >
          Any
        </Chip>
        {FUND_SIZE_PRESETS.map((preset) => (
          <Chip
            key={preset.value}
            active={filters.minFundSize === preset.value}
            onClick={() => update({ minFundSize: preset.value })}
          >
            {preset.label}
          </Chip>
        ))}
      </ChipGroup>
    </>
  )

  return (
    <Surface className="space-y-4 p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <SearchField
          value={filters.search}
          onChange={(search) => update({ search })}
          placeholder="Search name, ticker or ISIN"
          className="flex-1 sm:max-w-sm"
        />
        <motion.button
          type="button"
          onClick={() => setOpen((value) => !value)}
          {...tactile}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-3.5 py-2 text-sm font-medium md:hidden"
        >
          <SlidersHorizontal className="size-4" />
          Filters
          {pills.length > 0 && (
            <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
              {pills.length}
            </span>
          )}
        </motion.button>
      </div>

      {/* Desktop: always visible, cascading in on load */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="hidden flex-wrap gap-x-6 gap-y-4 md:flex"
      >
        {groups}
      </motion.div>

      {/* Mobile: collapsible, cascading in when opened */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="overflow-hidden md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="flex flex-wrap gap-x-6 gap-y-4 pt-1"
            >
              {groups}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {pills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <AnimatePresence initial={false}>
            {pills.map((pill) => (
              <motion.div
                key={pill.key}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
              >
                <Pill onRemove={pill.clear}>{pill.label}</Pill>
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => void setFilters(null)}
            className="ml-1 text-xs font-medium text-primary hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </Surface>
  )
}

function buildPills(
  filters: ScreenerFilters,
  update: (patch: Partial<ScreenerFilters>) => void,
): ActivePill[] {
  const pills: ActivePill[] = []

  if (filters.search.trim()) {
    pills.push({
      key: 'search',
      label: `Search: ${filters.search}`,
      clear: () => update({ search: '' }),
    })
  }
  if (filters.assetClass) {
    pills.push({
      key: 'asset',
      label: assetClassLabel(filters.assetClass),
      clear: () => update({ assetClass: '' }),
    })
  }
  if (filters.type) {
    pills.push({
      key: 'type',
      label: filters.type === 'acc' ? 'Accumulating' : 'Distributing',
      clear: () => update({ type: null }),
    })
  }
  for (const value of filters.domicile) {
    pills.push({
      key: `dom-${value}`,
      label: value,
      clear: () =>
        update({ domicile: filters.domicile.filter((v) => v !== value) }),
    })
  }
  for (const value of filters.exchange) {
    pills.push({
      key: `exc-${value}`,
      label: value,
      clear: () =>
        update({ exchange: filters.exchange.filter((v) => v !== value) }),
    })
  }
  if (filters.maxTer != null) {
    pills.push({
      key: 'ter',
      label: `TER ≤ ${filters.maxTer.toFixed(2)}%`,
      clear: () => update({ maxTer: null }),
    })
  }
  if (filters.minFundSize != null) {
    const preset = FUND_SIZE_PRESETS.find(
      (p) => p.value === filters.minFundSize,
    )
    pills.push({
      key: 'size',
      label: preset ? preset.label : `> ${filters.minFundSize}`,
      clear: () => update({ minFundSize: null }),
    })
  }

  return pills
}

function ChipGroup({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <motion.div variants={fadeUpItem} className="space-y-2">
      <span className="text-xs font-semibold text-foreground">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </motion.div>
  )
}

function Count({ n }: { n: number }) {
  return <span className="text-xs opacity-50">{n}</span>
}
