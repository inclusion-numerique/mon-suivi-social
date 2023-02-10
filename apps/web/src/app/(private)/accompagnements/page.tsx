import styles from './history.module.css'
import { prismaClient } from '@mss/web/prismaClient'

import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { FollowupRow } from '@mss/web/app/(private)/accompagnements/FollowupRow'
import { HelpRequestRow } from '@mss/web/app/(private)/accompagnements/HelpRequestRow'
import { PageTitle } from '@mss/web/app/(private)/PageTitle'
import { serialize } from '@mss/web/utils/serialization'
import { Routes } from '@mss/web/app/routing/routes'

const getFollowups = (structureId: string) =>
  prismaClient.followup.findMany({
    where: { structureId },
    include: { types: true, beneficiary: true, createdBy: true },
    orderBy: [{ date: 'desc' }, { created: 'desc' }],
  })
export type HistoryFollowup = Awaited<ReturnType<typeof getFollowups>>[0]

const getHelpRequests = (structureId: string) =>
  prismaClient.helpRequest.findMany({
    where: { structureId },
    include: { type: true, beneficiary: true, createdBy: true },
    orderBy: [{ openingDate: 'desc' }, { created: 'desc' }],
  })

export type HistoryHelpRequest = Awaited<ReturnType<typeof getHelpRequests>>[0]

const AccompagnementsPage = async () => {
  const user = await getAuthenticatedAgent()
  const { structureId } = user

  const [followups, helpRequests] = await Promise.all([
    getFollowups(structureId),
    getHelpRequests(structureId),
  ])

  return (
    <>
      <PageTitle page={Routes.Accompagnements.Index} />
      <div className="fr-tabs fr-mt-4v">
        <ul
          className="fr-tabs__list"
          role="tablist"
          aria-label="Informations bénéficiaire"
        >
          <li role="presentation">
            <button
              id="tabpanel-404"
              className="fr-tabs__tab"
              tabIndex={0}
              role="tab"
              aria-selected="true"
              aria-controls="tabpanel-404-panel"
            >
              Entretiens
            </button>
          </li>
          <li role="presentation">
            <button
              id="tabpanel-405"
              className="fr-tabs__tab"
              tabIndex={-1}
              role="tab"
              aria-selected="false"
              aria-controls="tabpanel-405-panel"
            >
              Demandes d&apos;aide
            </button>
          </li>
        </ul>
        <div
          id="tabpanel-404-panel"
          className={`fr-tabs__panel fr-tabs__panel--selected`}
          role="tabpanel"
          aria-labelledby="tabpanel-404"
          tabIndex={0}
        >
          <div className="fr-table fr-table--bordered">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Statut</th>
                  <th scope="col">Type</th>
                  <th scope="col">Accompagnement</th>
                  <th scope="col">N° dossier</th>
                  <th scope="col">Bénéficiaire</th>
                  <th scope="col">Agent</th>
                </tr>
              </thead>
              <tbody>
                {followups.map((followup) => (
                  <FollowupRow
                    key={followup.id}
                    serializedFollowup={serialize(followup)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div
          id="tabpanel-405-panel"
          className={`fr-tabs__panel`}
          role="tabpanel"
          aria-labelledby="tabpanel-405"
          tabIndex={0}
        >
          <div className="fr-table fr-table--bordered">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Statut</th>
                  <th scope="col">Accompagnement</th>
                  <th scope="col">N° dossier</th>
                  <th scope="col">Bénéficiaire</th>
                  <th scope="col">Agent</th>
                </tr>
              </thead>
              <tbody>
                {helpRequests.map((helpRequest) => (
                  <HelpRequestRow
                    key={helpRequest.id}
                    serializedHelpRequest={serialize(helpRequest)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
export default AccompagnementsPage
