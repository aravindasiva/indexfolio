import type { JsonLd as JsonLdData } from '@/lib/seo/schema'

// JSON-LD <script> for structured data. '<' is escaped so a payload can't break
// out of the tag.
export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
