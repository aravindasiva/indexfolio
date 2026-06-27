// Two distinct gap tokens (not one 'ellipsis') so each maps to a stable, unique
// React key without falling back to the array index.
export type PageItem = number | 'ellipsis-left' | 'ellipsis-right'

/*
  The page numbers to render, with gap markers. Always shows the first and last
  page plus a window around the current one, so the control stays compact for
  large totals. e.g. paginationRange(5, 10) ->
  [1,'ellipsis-left',4,5,6,'ellipsis-right',10]. Up to 7 pages show in full.
*/
export function paginationRange(current: number, total: number): PageItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const items: PageItem[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) items.push('ellipsis-left')
  for (let page = start; page <= end; page++) items.push(page)
  if (end < total - 1) items.push('ellipsis-right')

  items.push(total)
  return items
}
