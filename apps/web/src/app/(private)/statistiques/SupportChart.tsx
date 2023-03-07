'use client'

import { Bar } from 'react-chartjs-2'
import { ChartData } from 'chart.js'
import { pick } from '@mss/web/utils/pick'
import { useCssProperties } from '@mss/web/hooks/useCssProperty'
import { BrowserOnly } from '@mss/web/utils/BrowserOnly'
import { GetSupportStatsReturn } from '@mss/web/query'

export function SupportChart({
  supportStats,
}: {
  supportStats: GetSupportStatsReturn
}) {
  const colors = useCssProperties([
    '--artwork-minor-pink-tuile',
    '--artwork-minor-blue-cumulus',
    '--artwork-minor-green-emeraude',
  ])

  const data: ChartData<'bar'> = {
    labels: [
      ...pick(supportStats.stats, 'name'),
      // 'Total'
    ],
    datasets: [
      {
        label: "Demandes d'aide",
        data: supportStats.stats.map(({ _count }) => _count.helpRequests),
        // supportStats.total.helpRequests,
        backgroundColor: colors[0],
      },
      {
        label: 'Entretiens',
        data: supportStats.stats.map(({ _count }) => _count.followups),
        // supportStats.total.followups,
        backgroundColor: colors[1],
      },
      {
        label: 'Total',
        data: supportStats.stats.map(
          ({ _count }) => _count.followups + _count.helpRequests,
        ),
        // supportStats.total.total,
        backgroundColor: colors[2],
      },
    ],
  }

  return (
    <BrowserOnly>
      <Bar data={data} options={{ indexAxis: 'y' }} />
    </BrowserOnly>
  )
}
