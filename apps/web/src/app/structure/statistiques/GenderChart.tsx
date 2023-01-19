'use client'
import 'chart.js/auto'

import { Doughnut } from 'react-chartjs-2'
import { ChartData } from 'chart.js'
import { pick } from '@mss/web/utils/pick'
import { getGenderWording } from '@mss/web/wording/gender'
import type { GenderStats } from '@mss/web/app/structure/statistiques/page'
import { useCssProperties } from '@mss/web/hooks/useCssProperty'

export const GenderChart = ({ genderStats }: { genderStats: GenderStats }) => {
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
  return <Doughnut data={data} options={{}} />
}
