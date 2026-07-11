import type { ReactNode } from 'react'
import { Panel } from '@/components/Panel/Panel'
import { ComingSoon } from '@/components/ComingSoon/ComingSoon'

// A section whose data has not landed yet: the slot is laid out, the header says "coming soon".
export function Placeholder({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
}) {
  return (
    <Panel tone="neutral" icon={icon} title={title} action={<ComingSoon />}>
      <p className="text-sm text-muted-foreground">{children}</p>
    </Panel>
  )
}
