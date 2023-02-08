import Link from 'next/link'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { prismaClient } from '@mss/web/prismaClient'
import { getUserDisplayName } from '@mss/web/utils/user'
import { PageConfig, PageTitle } from '@mss/web/app/(private)/PageTitle'
import {
  RoutePathParams,
  RoutePathSearchParams,
  Routes,
} from '@mss/web/app/routing/routes'
import { DocumentsTab } from '@mss/web/app/(private)/beneficiaires/[fileNumber]/DocumentsTab'
import { HistoryTab } from '@mss/web/app/(private)/beneficiaires/[fileNumber]/HistoryTab'
import { InfoTab } from '@mss/web/app/(private)/beneficiaires/[fileNumber]/InfoTab'
import { CSSProperties, PropsWithChildren } from 'react'
import {
  canDeleteBeneficiary,
  canEditBeneficiaryGeneralInfo,
} from '@mss/web/security/rules'
import { AttributesList } from '@mss/web/ui/AttributesList'

export const revalidate = 0

const getSupports = async ({
  beneficiaryId,
  agentId,
}: {
  beneficiaryId: string
  agentId: string
}) => {
  const result = await prismaClient.beneficiary.findUniqueOrThrow({
    where: { id: beneficiaryId },
    select: {
      id: true,
      followups: {
        include: {
          createdBy: true,
          types: true,
        },
        orderBy: {
          date: 'desc',
        },
      },
      helpRequests: {
        include: {
          createdBy: true,
          type: true,
        },
        orderBy: {
          openingDate: 'desc',
        },
      },
    },
  })

  // Remove private info
  const followups = result.followups.map((followup) => {
    if (followup.createdById !== agentId) {
      followup.privateSynthesis = null
    }

    return {
      ...followup,
      historyDate: followup.date,
      __type: 'followup' as const,
    }
  })
  const helpRequests = result.helpRequests.map((helpRequest) => {
    if (helpRequest.createdById !== agentId) {
      helpRequest.privateSynthesis = null
    }
    return {
      ...helpRequest,
      historyDate: helpRequest.openingDate,
      __type: 'helpRequest' as const,
    }
  })

  return [...followups, ...helpRequests].sort(
    (a, b) => b.historyDate.getTime() - a.historyDate.getTime(),
  )
}

export type BeneficiaryPageSupport = Awaited<ReturnType<typeof getSupports>>[0]

const getBeneficiary = ({
  fileNumber,
  structureId,
}: {
  structureId: string
  fileNumber: string
}) =>
  prismaClient.beneficiary.findFirstOrThrow({
    where: { structureId, fileNumber },
    include: {
      referents: true,
    },
  })
export type BeneficiaryPageInfo = Awaited<ReturnType<typeof getBeneficiary>>

const getDocuments = ({
  userId,
  beneficiaryId,
}: {
  userId: string
  beneficiaryId: string
}) =>
  prismaClient.document.findMany({
    where: { beneficiaryId },
  })

export type BeneficiaryPageDocuments = Awaited<ReturnType<typeof getDocuments>>

const BeneficiaryPage = async ({
  params: { fileNumber },
  searchParams: { tab, accompagnement } = {},
}: {
  params: RoutePathParams<
    typeof Routes.Structure.Beneficiaires.Beneficiaire.Index.path
  >
  searchParams?: RoutePathSearchParams<
    typeof Routes.Structure.Beneficiaires.Beneficiaire.Index.path
  >
}) => {
  const user = await getAuthenticatedAgent()
  // TODO use security rules instead of where filters
  const beneficiary = await getBeneficiary({
    fileNumber,
    structureId: user.structureId,
  })
  const supports = await getSupports({
    beneficiaryId: beneficiary.id,
    agentId: user.id,
  })

  const documents = await getDocuments({
    beneficiaryId: beneficiary.id,
    userId: user.id,
  })

  const { referents } = beneficiary

  const page: PageConfig = {
    icon: Routes.Structure.Beneficiaires.Beneficiaire.Index.icon,
    title: Routes.Structure.Beneficiaires.Beneficiaire.Index.title(beneficiary),
  }

  const canEdit = canEditBeneficiaryGeneralInfo(user, beneficiary)
  const canArchive = canDeleteBeneficiary(user, beneficiary)

  return (
    <>
      <PageTitle page={page} parents={[Routes.Structure.Beneficiaires.Index]} />
      <div className="fr-col-12 fr-col-lg-8 fr-col-xl-9">
        <AttributesList
          items={[
            [
              'N° dossier',
              <span className="fr-badge fr-badge--blue-cumulus">
                {fileNumber}
              </span>,
            ],
            [
              referents.length === 1 ? 'Agent référent' : 'Agents référents',
              referents.length === 0
                ? 'Aucun'
                : referents
                    .map(getUserDisplayName)
                    .map((name) => (
                      <span className="fr-tag fr-mr-2v">{name}</span>
                    )),
              { verticalAlign: 'center' },
            ],
          ]}
        />
      </div>
      <div className="fr-col-12 fr-mt-4v">
        <ul className="fr-btns-group  fr-btns-group--icon-left fr-btns-group--inline fr-btns-group--sm">
          {canEdit ? (
            <li>
              <Link
                href={Routes.Structure.Beneficiaires.Beneficiaire.Modifier.path(
                  {
                    fileNumber,
                  },
                )}
                className="fr-btn fr-icon-pencil-line fr-btn--primary"
              >
                Modifier le bénéficiaire
              </Link>
            </li>
          ) : null}
          <li>
            <Link
              href={Routes.Structure.Accompagnements.Entretien.Nouveau.path({
                dossier: fileNumber,
              })}
              className="fr-btn fr-icon-file-add-line fr-btn--secondary"
            >
              Synthèse d&apos;entretien
            </Link>
          </li>
          <li>
            <Link
              href={Routes.Structure.Accompagnements.DemandeDAide.Nouvelle.path(
                {
                  dossier: fileNumber,
                },
              )}
              className="fr-btn fr-icon-file-add-line fr-btn--secondary"
            >
              Demande d&apos;aide
            </Link>
          </li>{' '}
          {canArchive ? (
            <li>
              <Link
                href={Routes.Structure.Beneficiaires.Beneficiaire.Archiver.path(
                  {
                    fileNumber,
                  },
                )}
                className="fr-btn fr-btn--secondary fr-icon-archive-line fr-btn--primary"
              >
                Archiver le bénéficiaire
              </Link>
            </li>
          ) : null}
          <li>
            <Link
              href="https://www.mesdroitssociaux.gouv.fr/dd1pnds-ria/#destination/simu-foyer"
              target="_blank"
              className="fr-btn fr-btn--tertiary-no-outline"
            >
              Simulation de droits sociaux
            </Link>
          </li>
        </ul>
      </div>
      <div className="fr-tabs fr-mt-4v">
        <ul
          className="fr-tabs__list"
          role="tablist"
          aria-label="Informations bénéficiaire"
          style={
            {
              // TODO need this to match server rendered content
              '--tab-list-height': '48px;',
            } as CSSProperties
          }
        >
          <TabButton
            id="beneficiary-tab-info"
            icon="list-unordered"
            selected={!tab || tab === 'info'}
          >
            Info
          </TabButton>
          <TabButton
            id="beneficiary-tab-documents"
            icon="file-line"
            selected={tab === 'documents'}
          >
            Documents
          </TabButton>
          <TabButton
            id="beneficiary-tab-historique"
            icon="folder-2-line"
            selected={tab === 'historique'}
          >
            Historique
          </TabButton>
        </ul>
        <TabContainer
          id="beneficiary-tab-info"
          selected={!tab || tab === 'info'}
        >
          <InfoTab user={user} beneficiary={beneficiary} />
        </TabContainer>
        <TabContainer
          id="beneficiary-tab-documents"
          selected={tab === 'documents'}
        >
          <DocumentsTab
            user={user}
            documents={documents}
            beneficiary={beneficiary}
          />
        </TabContainer>
        <TabContainer
          id="beneficiary-tab-historique"
          selected={tab === 'historique'}
        >
          <HistoryTab user={user} supports={supports} />
        </TabContainer>
      </div>
    </>
  )
}

const TabButton = ({
  id,
  selected,
  children,
  icon,
}: PropsWithChildren<{ id: string; icon: string; selected?: boolean }>) => (
  <li role="presentation">
    <button
      id={id}
      className={`fr-tabs__tab fr-icon-${icon} fr-tabs__tab--icon-left`}
      tabIndex={-1}
      role="tab"
      aria-selected={selected ? 'true' : 'false'}
      aria-controls={`${id}_panel`}
    >
      {children}
    </button>
  </li>
)

const TabContainer = ({
  id,
  selected,
  children,
}: PropsWithChildren<{ id: string; selected?: boolean }>) => (
  <div
    id={`${id}_panel`}
    className={`fr-tabs__panel ${selected ? 'fr-tabs__panel--selected' : ''}`}
    style={{ backgroundColor: 'white' }}
    role="tabpanel"
    aria-labelledby={id}
    tabIndex={0}
  >
    {children}
  </div>
)

export default BeneficiaryPage
