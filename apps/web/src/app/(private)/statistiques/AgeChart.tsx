'use client'

import { Bar } from 'react-chartjs-2'
import { ChartData, ChartOptions } from 'chart.js'
import { useCssProperties } from '@mss/web/hooks/useCssProperty'
import { AgeStats } from '@mss/web/stats/stats'
import { AgeGroupLabels } from '@mss/web/wording/ageGroup'
import { BrowserOnly } from '@mss/web/utils/BrowserOnly'

export const AgeChart = ({ ageStats }: { ageStats: AgeStats }) => {
  const colors = useCssProperties([
    '--artwork-minor-blue-cumulus',
    '--artwork-minor-beige-gris-galet',
  ])

  const labels = [...Object.values(AgeGroupLabels), 'Non renseigné']
  const backgroundColor = [
    ...Object.values(AgeGroupLabels).map(() => colors[0]),
    colors[1],
  ]
  const values = Object.values(ageStats.stats)

  const data: ChartData<'bar'> = {
    labels,
    datasets: [
      {
        label: 'Bénéficiaires',
        data: values,
        backgroundColor,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  return (
    <BrowserOnly>
      <Bar data={data} options={options} />
    </BrowserOnly>
  )
}
