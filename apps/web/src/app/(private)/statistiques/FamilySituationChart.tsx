'use client'

import { Doughnut } from 'react-chartjs-2'
import { ChartData } from 'chart.js'
import { pick } from '@mss/web/utils/pick'
import { useCssProperties } from '@mss/web/hooks/useCssProperty'
import { FamilySituationStats } from '@mss/web/stats/stats'
import { getFamilySituationWording } from '@mss/web/wording/familySituation'
import { BrowserOnly } from '@mss/web/utils/BrowserOnly'

export function FamilySituationChart({
  familySituationStats,
}: {
  familySituationStats: FamilySituationStats
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
