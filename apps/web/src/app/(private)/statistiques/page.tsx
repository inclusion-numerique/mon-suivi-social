import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { GenderChart } from '@mss/web/app/(private)/statistiques/GenderChart'
import { SupportChart } from '@mss/web/app/(private)/statistiques/SupportChart'
import { PageTitle } from '@mss/web/components/PageTitle'
import { StatisticsQuery } from '@mss/web/server/query'
import { CSSProperties, PropsWithChildren, ReactNode } from 'react'
import { FamilySituationChart } from '@mss/web/app/(private)/statistiques/FamilySituationChart'
import { AgeChart } from '@mss/web/app/(private)/statistiques/AgeChart'
import { ChartJs } from '@mss/web/app/(private)/statistiques/ChartJs'
import { Routes } from '@mss/web/app/routing/routes'
import { canAccessStatsPage } from '@mss/web/security/rules'
import { notFound } from 'next/navigation'

const StatistiquesPage = async () => {
  const user = await getAuthenticatedAgent()

  if (!canAccessStatsPage(user)) {
    notFound()
    return null
  }

  const [genderStats, familySituationStats, ageStats, supportStats] =
    await Promise.all([
      StatisticsQuery.getGenderStats(user.structureId),
      StatisticsQuery.getFamilyStats(user.structureId),
      StatisticsQuery.getAgeStats(user.structureId),
      StatisticsQuery.getSupportStats(user.structureId),
    ])

  return (
    <>
      <ChartJs />
      <PageTitle page={Routes.Statistiques.Index} />
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
          contentStyle={{ minHeight: 400 }}
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

function SectionTitle({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`fr-grid-row fr-grid-row--gutters ${className ?? ''}`}>
      <div className="fr-col-12 fr-col-md-6">
        <h4 className="fr-mb-2v">{children}</h4>
      </div>
    </div>
  )
}

function StatCard({
  cols = {},
  title,
  children,
  contentStyle,
}: PropsWithChildren<{
  title: ReactNode
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  contentStyle?: CSSProperties
}>) {
  return (
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
              <div
                className="fr-grid-row fr-grid-row--center"
                style={contentStyle}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatistiquesPage
