import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { breadcrumbSchema } from '@/lib/seo/schema'
import { SITE_URL } from '@/lib/constants'

export type Crumb = { label: string; href: string }

// Visual breadcrumb trail + matching BreadcrumbList JSON-LD. Crumbs run from the
// site root; the last is the current page (rendered as text, not a link).
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <JsonLd
        data={breadcrumbSchema(
          items.map((item) => ({
            name: item.label,
            url: new URL(item.href, SITE_URL).toString(),
          })),
        )}
      />
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  className="size-3.5 opacity-50"
                  aria-hidden="true"
                />
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-medium text-foreground"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
