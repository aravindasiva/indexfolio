import { Rows3, Rows4 } from 'lucide-react'
import { SegmentedControl } from '@/components/SegmentedControl/SegmentedControl'

export type Density = 'comfortable' | 'compact'

type DensityToggleProps = {
  value: Density
  onChange: (value: Density) => void
  className?: string
}

export function DensityToggle({
  value,
  onChange,
  className,
}: DensityToggleProps) {
  return (
    <SegmentedControl
      ariaLabel="Row density"
      size="lg"
      options={[
        {
          value: 'comfortable',
          icon: <Rows3 className="size-4" />,
          ariaLabel: 'Comfortable',
        },
        {
          value: 'compact',
          icon: <Rows4 className="size-4" />,
          ariaLabel: 'Compact',
        },
      ]}
      value={value}
      onChange={onChange}
      className={className}
    />
  )
}
