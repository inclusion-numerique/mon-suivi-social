'use client'

import { Doughnut } from 'react-chartjs-2'
import { ChartData } from 'chart.js'
import { pick } from '@mss/web/utils/pick'
import { getGenderWording } from '@mss/web/client/options/gender'
import { useCssProperties } from '@mss/web/client/hooks/useCssProperty'
import { BrowserOnly } from '@mss/web/utils/BrowserOnly'
import { GetGenderStatsReturn } from '@mss/web/server/query'

export function GenderChart({
  genderStats,
}: {
  genderStats: GetGenderStatsReturn
}) {
  const colors = useCssProperties([
    '--artwork-minor-green-emeraude',
    '--artwork-minor-blue-cumulus',
    '--artwork-minor-beige-gris-galet',
    '--artwork-minor-brown-cafe-creme',
  ])

  const data: ChartData<'doughnut'> = {
    labels: pick(genderStats.stats, 'gender').map(getGenderWording),
    datasets: [
      {
        label: 'Répartition des genres',
        data: pick(genderStats.stats, '_count'),
        backgroundColor: colors,
        hoverOffset: 4,
      },
    ],
  }
  return (
    <BrowserOnly>
      <Doughnut data={data} options={{}} />
    </BrowserOnly>
  )
}
