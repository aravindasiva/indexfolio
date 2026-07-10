import { LayoutGrid, Table } from 'lucide-react'
import { SegmentedControl } from '@/components/SegmentedControl/SegmentedControl'

export type TableView = 'table' | 'cards'

type ViewToggleProps = {
  value: TableView
  onChange: (value: TableView) => void
  className?: string
}

export function ViewToggle({ value, onChange, className }: ViewToggleProps) {
  return (
    <SegmentedControl
      ariaLabel="View"
      size="lg"
      options={[
        {
          value: 'table',
          icon: <Table className="size-4" />,
          ariaLabel: 'Table',
        },
        {
          value: 'cards',
          icon: <LayoutGrid className="size-4" />,
          ariaLabel: 'Cards',
        },
      ]}
      value={value}
      onChange={onChange}
      className={className}
    />
  )
}
