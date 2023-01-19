'use client'
import 'chart.js/auto'

import { Bar } from 'react-chartjs-2'
import { ChartData } from 'chart.js'
import { pick } from '@mss/web/utils/pick'
import { SupportStats } from '@mss/web/app/structure/statistiques/page'
import { useCssProperties } from '@mss/web/hooks/useCssProperty'

export const SupportChart = ({
  supportStats,
}: {
  supportStats: SupportStats
}) => {
  const colors = useCssProperties([
    '--artwork-minor-green-emeraude',
    '--artwork-minor-pink-tuile',
    '--artwork-major-blue-france',
  ])

  const data: ChartData<'bar'> = {
    labels: [...pick(supportStats.stats, 'name'), 'Total'],
    datasets: [
      {
        label: 'Suivis',
        data: [
          ...supportStats.stats.map(({ _count }) => _count.followups),
          supportStats.total.followups,
        ],
        backgroundColor: colors[0],
      },
      {
        label: "Demandes d'aide",
        data: [
          ...supportStats.stats.map(({ _count }) => _count.helpRequests),
          supportStats.total.helpRequests,
        ],
        backgroundColor: colors[1],
      },
      {
        label: 'Total',
        data: [
          ...supportStats.stats.map(
            ({ _count }) => _count.followups + _count.helpRequests,
          ),
          supportStats.total.total,
        ],
        backgroundColor: colors[2],
      },
    ],
  }

  return <Bar data={data} options={{ indexAxis: 'y' }} />
}
