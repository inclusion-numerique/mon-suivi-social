export const takeAndSkipFromPagination = ({
  page,
  perPage,
}: {
  page: number
  perPage: number
}): { take: number; skip: number } => ({
  take: perPage,
  skip: (page - 1) * perPage,
})
