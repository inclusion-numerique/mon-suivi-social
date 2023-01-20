import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { GenderChart } from '@mss/web/app/structure/statistiques/GenderChart'
import { SupportChart } from '@mss/web/app/structure/statistiques/SupportChart'
import { PageTitle } from '@mss/web/app/structure/PageTitle'
import {
  getAgeStats,
  getFamilyStats,
  getGenderStats,
  getSupportStats,
} from '@mss/web/stats/stats'
import { PropsWithChildren, ReactNode } from 'react'
import { FamilySituationChart } from '@mss/web/app/structure/statistiques/FamilySituationChart'
import { AgeChart } from '@mss/web/app/structure/statistiques/AgeChart'
import { ChartJs } from '@mss/web/app/structure/statistiques/ChartJs'

const StatistiquesPage = async () => {
  const { organisationId, organisation } = await getAuthenticatedAgent()
  const [genderStats, familySituationStats, ageStats, supportStats] =
    await Promise.all([
      getGenderStats(organisationId),
      getFamilyStats(organisationId),
      getAgeStats(organisationId),
      getSupportStats(organisationId),
    ])

  return (
    <>
      <ChartJs />
      <PageTitle icon="pie-chart-2-line" title="Statistiques" />
      <SectionTitle>
        <span className="fr-icon-user-line" /> {genderStats.total} bénéficiaires
      </SectionTitle>
      <div className="fr-grid-row fr-grid-row--gutters">
        <StatCard
          cols={{ md: 6, xl: 4 }}
          title={
            <>
              <span className="fr-icon-user-line" /> Genres
            </>
          }
        >
          <GenderChart genderStats={genderStats} />
        </StatCard>
        <StatCard
          cols={{ md: 6, xl: 4 }}
          title={
            <>
              <span className="fr-icon-user-line" /> Situations familiales
            </>
          }
        >
          <FamilySituationChart familySituationStats={familySituationStats} />
        </StatCard>
        <StatCard
          cols={{ md: 6, xl: 4 }}
          title={
            <>
              <span className="fr-icon-user-line" /> Tranches d&apos;âge
            </>
          }
        >
          <AgeChart ageStats={ageStats} />
        </StatCard>
      </div>
      <SectionTitle className="fr-mt-4v">
        <span className="fr-icon-folder-2-line" /> {supportStats.total.total}{' '}
        accompagnements
      </SectionTitle>
      <div className="fr-grid-row fr-grid-row--gutters">
        <StatCard
          cols={{ xl: 6 }}
          title={
            <>
              <span className="fr-icon-folder-2-line fr-mr-1w" />
              Types d&apos;accompagnements
            </>
          }
        >
          <SupportChart supportStats={supportStats} />
        </StatCard>
      </div>
    </>
  )
}

const SectionTitle = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <div className={`fr-grid-row fr-grid-row--gutters ${className ?? ''}`}>
    <div className="fr-col-12 fr-col-md-6">
      <h4 className="fr-mb-2v">{children}</h4>
    </div>
  </div>
)

const StatCard = ({
  cols = {},
  title,
  children,
}: PropsWithChildren<{
  title: ReactNode
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}>) => (
  <div
    className={`fr-col-${cols?.default ?? 12} ${
      cols?.sm ? `fr-col-sm-${cols.sm}` : ''
    } ${cols?.md ? `fr-col-md-${cols.md}` : ''} ${
      cols?.lg ? `fr-col-lg-${cols.lg}` : ''
    } ${cols?.xl ? `fr-col-xl-${cols.xl}` : ''}`}
  >
    <div className="fr-card">
      <div className="fr-card__body">
        <div className="fr-card__content">
          <h3 className="fr-card__title" style={{ textAlign: 'center' }}>
            {title}
          </h3>
          <div className="fr-card__desc fr-pt-4v">
            <div className="fr-grid-row fr-grid-row--center"> {children}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default StatistiquesPage
