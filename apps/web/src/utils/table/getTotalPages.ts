export const getTotalPages = ({
  perPage,
  count,
}: {
  perPage: number
  count: number
}): number => Math.ceil(count / perPage) || 1
