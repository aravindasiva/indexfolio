import { AnimatePresence, motion } from 'framer-motion'
import type { EtfFilters } from '@/lib/api'
import { Surface } from '@/components/Surface/Surface'
import { Chip } from '@/components/Chip/Chip'
import { SearchField } from '@/components/SearchField/SearchField'
import { FilterSelect } from '@/components/FilterSelect/FilterSelect'
import { SegmentedControl } from '@/components/SegmentedControl/SegmentedControl'
import { assetClassLabel } from '@/lib/etf/labels'
import type { ScreenerFilters, SetScreenerFilters } from '../../utils/filters'
import { FUND_SIZE_PRESETS, TER_PRESETS } from '../../utils/options'

type ActivePill = { key: string; label: string; clear: () => void }

// "All" is a real option, mapped to null at the call site (SegmentedControl never emits null).
const TYPE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'acc', label: 'Acc' },
  { value: 'dist', label: 'Dist' },
] as const

// Search, dropdown filters, and a segmented Type; active filters read back as removable pills.
export function FilterBar({
  filters,
  setFilters,
  options,
}: {
  filters: ScreenerFilters
  setFilters: SetScreenerFilters
  options: EtfFilters | undefined
}) {
  const update = (patch: Partial<ScreenerFilters>) =>
    setFilters({ ...patch, page: 1 })

  const pills = buildPills(filters, update)

  return (
    <Surface className="space-y-4 p-4 sm:p-5">
      <SearchField
        value={filters.search}
        onChange={(search) => update({ search })}
        placeholder="Search name, ticker or ISIN"
        className="w-full sm:max-w-sm"
      />

      <div className="flex flex-wrap items-center gap-2">
        {options && options.assetClass.length > 0 && (
          <FilterSelect
            mode="single"
            label="Asset"
            searchable={false}
            options={options.assetClass.map((o) => ({
              value: o.value,
              label: assetClassLabel(o.value),
              count: o.count,
            }))}
            value={filters.assetClass || null}
            onChange={(v) => update({ assetClass: v ?? '' })}
          />
        )}
        {options && options.domicile.length > 0 && (
          <FilterSelect
            mode="multi"
            label="Domicile"
            options={options.domicile}
            value={filters.domicile}
            onChange={(domicile) => update({ domicile })}
          />
        )}
        {options && options.exchange.length > 0 && (
          <FilterSelect
            mode="multi"
            label="Exchange"
            options={options.exchange}
            value={filters.exchange}
            onChange={(exchange) => update({ exchange })}
          />
        )}
        {options && options.currency.length > 0 && (
          <FilterSelect
            mode="multi"
            label="Currency"
            options={options.currency}
            value={filters.currency}
            onChange={(currency) => update({ currency })}
          />
        )}
        <FilterSelect
          mode="single"
          label="TER"
          searchable={false}
          anyLabel="Any TER"
          options={TER_PRESETS.map((p) => ({
            value: String(p.value),
            label: p.label,
          }))}
          value={filters.maxTer != null ? String(filters.maxTer) : null}
          onChange={(v) => update({ maxTer: v == null ? null : Number(v) })}
        />
        <FilterSelect
          mode="single"
          label="Fund size"
          searchable={false}
          anyLabel="Any size"
          options={FUND_SIZE_PRESETS.map((p) => ({
            value: String(p.value),
            label: p.label,
          }))}
          value={
            filters.minFundSize != null ? String(filters.minFundSize) : null
          }
          onChange={(v) =>
            update({ minFundSize: v == null ? null : Number(v) })
          }
        />

        <SegmentedControl
          ariaLabel="Distribution type"
          size="lg"
          options={TYPE_OPTIONS}
          value={filters.type ?? 'all'}
          onChange={(v) => update({ type: v === 'all' ? null : v })}
        />
      </div>

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
                <Chip mode="removable" onRemove={pill.clear}>
                  {pill.label}
                </Chip>
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setFilters(null)}
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
  for (const value of filters.currency) {
    pills.push({
      key: `cur-${value}`,
      label: value,
      clear: () =>
        update({ currency: filters.currency.filter((v) => v !== value) }),
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
