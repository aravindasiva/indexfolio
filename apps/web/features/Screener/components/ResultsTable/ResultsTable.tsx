import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { Etf } from '@/lib/api'
import { formatFundSize, formatTer, fundTypeLabel } from '../../utils/format'

/*
  Read-only ETF results table. Sorting, pagination, and filters arrive in PR2.
  Domicile and Exchange are hidden on small screens to keep the table readable.
*/
export function ResultsTable({ etfs }: { etfs: readonly Etf[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ticker</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="hidden md:table-cell">Domicile</TableHead>
          <TableHead className="hidden md:table-cell">Exchange</TableHead>
          <TableHead className="text-right">TER</TableHead>
          <TableHead className="text-right">Fund size</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {etfs.map((etf) => (
          <TableRow key={etf.id}>
            <TableCell className="font-medium">{etf.ticker}</TableCell>
            <TableCell className="text-muted-foreground">{etf.name}</TableCell>
            <TableCell className="hidden md:table-cell">
              {etf.domicile}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {etf.exchange}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatTer(etf.ter)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatFundSize(etf.fundSizeEur)}
            </TableCell>
            <TableCell>
              <Badge variant={etf.isAccumulating ? 'secondary' : 'outline'}>
                {fundTypeLabel(etf.isAccumulating)}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
