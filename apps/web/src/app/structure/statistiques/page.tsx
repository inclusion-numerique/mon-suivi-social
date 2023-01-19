import { prismaClient } from '@mss/web/prismaClient'

import { sum } from '@mss/web/utils/sum'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { GenderChart } from '@mss/web/app/structure/statistiques/GenderChart'
import { SupportChart } from '@mss/web/app/structure/statistiques/SupportChart'
import { PageTitle } from '@mss/web/app/structure/PageTitle'

const getGenderStats = async (organisationId: string) => {
  const stats = await prismaClient.beneficiary.groupBy({
    by: ['gender'],
    where: {
      organisationId,
    },
    _count: true,
    orderBy: { gender: 'asc' },
  })
  const total = sum(stats, '_count')

  return { stats, total }
}

export type GenderStats = Awaited<ReturnType<typeof getGenderStats>>

const getSupportStats = async (organisationId: string) => {
  const stats = await prismaClient.followupType.findMany({
    where: {
      organisations: {
        some: { id: organisationId },
      },
    },
    include: {
      _count: {
        select: { followups: true, helpRequests: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  const total = stats.reduce(
    (
      result,
      { _count },
    ): { followups: number; helpRequests: number; total: number } => {
      result.followups += _count.followups
      result.helpRequests += _count.helpRequests
      result.total += _count.followups + _count.helpRequests

      return result
    },
    { total: 0, followups: 0, helpRequests: 0 },
  )

  return { stats, total }
}
export type SupportStats = Awaited<ReturnType<typeof getSupportStats>>

const StatistiquesPage = async () => {
  const { organisationId, organisation } = await getAuthenticatedAgent()
  const [genderStats, supportStats] = await Promise.all([
    getGenderStats(organisationId),
    getSupportStats(organisationId),
  ])

  return (
    <>
      <PageTitle icon="pie-chart-2-line">
        Statistiques {organisation.name}
      </PageTitle>
      <div className="fr-grid-row fr-mt-2v fr-grid-row--gutters">
        <div className="fr-col-12 fr-col-md-6">
          <div className="fr-card">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <h3 className="fr-card__title" style={{ textAlign: 'center' }}>
                  <span className="fr-icon-user-line fr-mr-1w" />
                  {genderStats.total} bénéficiaires
                </h3>
                <div className="fr-card__desc fr-pt-4v">
                  <GenderChart genderStats={genderStats} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="fr-col-12 fr-col-md-6">
          <div className="fr-card">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <h3 className="fr-card__title" style={{ textAlign: 'center' }}>
                  <span className="fr-icon-folder-2-line fr-mr-1w" />
                  {supportStats.total.total} accompagnements
                </h3>
                <div className="fr-card__desc fr-pt-4v">
                  <SupportChart supportStats={supportStats} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default StatistiquesPage
