import { getAgeStats } from './getAgeStats'

import { getFamilyStats } from './getFamilyStats'
import { getGenderStats } from './getGenderStats'
import { getSupportStats } from './getSupportStats'

const StatisticQuery = {
  getAgeStats,
  getFamilyStats,
  getGenderStats,
  getSupportStats,
}

export { StatisticQuery }

export { type GetAgeStatsReturn } from './getAgeStats'
export { type GetFamilyStatsReturn } from './getFamilyStats'
export { type GetGenderStatsReturn } from './getGenderStats'
export { type GetSupportStatsReturn } from './getSupportStats'
