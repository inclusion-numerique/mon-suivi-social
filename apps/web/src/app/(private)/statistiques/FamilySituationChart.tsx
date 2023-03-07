'use client'

import { Doughnut } from 'react-chartjs-2'
import { ChartData } from 'chart.js'
import { pick } from '@mss/web/utils/pick'
import { useCssProperties } from '@mss/web/hooks/useCssProperty'
import { getFamilySituationWording } from '@mss/web/constants/familySituation'
import { BrowserOnly } from '@mss/web/utils/BrowserOnly'
import { GetFamilyStatsReturn } from '@mss/web/query'

export function FamilySituationChart({
  familySituationStats,
}: {
  familySituationStats: GetFamilyStatsReturn
}) {
  const colors = useCssProperties([
    '--artwork-minor-green-emeraude',
    '--artwork-minor-blue-cumulus',
    '--artwork-minor-beige-gris-galet',
    '--artwork-minor-brown-cafe-creme',
  ])

  const data: ChartData<'doughnut'> = {
    labels: pick(familySituationStats.stats, 'familySituation').map(
      getFamilySituationWording,
    ),
    datasets: [
      {
        label: 'Répartition des situations familiales',
        data: pick(familySituationStats.stats, '_count'),
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
