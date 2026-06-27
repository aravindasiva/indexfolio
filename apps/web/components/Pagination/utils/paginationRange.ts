export type PageItem = number | 'ellipsis'

/*
  The page numbers to render, with 'ellipsis' gaps. Always shows the first and
  last page plus a window around the current one, so the control stays compact
  for large totals. e.g. paginationRange(5, 10) -> [1,'ellipsis',4,5,6,'ellipsis',10].
  Up to 7 pages are shown in full (no gaps).
*/
export function paginationRange(current: number, total: number): PageItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const items: PageItem[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) items.push('ellipsis')
  for (let page = start; page <= end; page++) items.push(page)
  if (end < total - 1) items.push('ellipsis')

  items.push(total)
  return items
}
