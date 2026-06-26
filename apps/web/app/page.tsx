import { Landing } from '@/features/Landing/Landing'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { organizationSchema, websiteSchema } from '@/lib/seo/schema'

export default function Home() {
  return (
    <>
      {/* Site-level structured data lives on the home page. */}
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <Landing />
    </>
  )
}
