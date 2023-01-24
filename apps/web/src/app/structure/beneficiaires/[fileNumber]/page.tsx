import Link from 'next/link'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { prismaClient } from '@mss/web/prismaClient'

import { beneficiaryDisplayName } from '@mss/web/beneficiary/beneficiary'
import { getUserDisplayName } from '@mss/web/utils/user'
import { LabelAndValue } from '@mss/web/ui/LabelAndValue'
import { getAge } from '@mss/web/utils/age'
import { PageConfig, PageTitle } from '@mss/web/app/structure/PageTitle'
import { Routes } from '@mss/web/app/routing/routes'

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
          agent: true,
          type: true,
        },
        orderBy: {
          date: 'desc',
        },
      },
      helpRequests: {
        include: {
          agent: true,
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
    if (followup.agentId !== agentId) {
      followup.privateSynthesis = null
    }

    return {
      ...followup,
      historyDate: followup.date,
      __type: 'followup' as const,
    }
  })
  const helpRequests = result.helpRequests.map((helpRequest) => {
    if (helpRequest.agentId !== agentId) {
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

const BeneficiaryPage = async ({
  params: { fileNumber },
  searchParams: { tab, accompagnement } = {},
}: {
  params: { fileNumber: string }
  searchParams?: {
    tab?: 'info' | 'fichiers' | 'historique'
    accompagnement?: string
  }
}) => {
  const user = await getAuthenticatedAgent()
  const beneficiary = await prismaClient.beneficiary.findFirstOrThrow({
    where: { organisationId: user.organisationId, fileNumber },
    include: {
      agent: true,
    },
  })
  const supports = await getSupports({
    beneficiaryId: beneficiary.id,
    agentId: user.id,
  })

  const { agent } = beneficiary

  const page: PageConfig = {
    icon: Routes.Structure.Beneficiaires.Beneficiaire.Index.icon,
    title: Routes.Structure.Beneficiaires.Beneficiaire.Index.title(beneficiary),
  }

  return (
    <>
      <PageTitle page={page} parents={[Routes.Structure.Beneficiaires.Index]} />
      <div className="fr-col-12 fr-col-lg-8 fr-col-xl-9">
        <ul className="fr-raw-list">
          <li>
            N° dossier :{' '}
            <span className="fr-badge fr-badge--blue-cumulus">
              {fileNumber}
            </span>
          </li>
          <li>
            Agent référent : <strong>{getUserDisplayName(agent)}</strong>
          </li>
        </ul>
      </div>
      <div className="fr-col-12 fr-mt-4v">
        <ul className="fr-btns-group  fr-btns-group--icon-left fr-btns-group--inline fr-btns-group--sm">
          <li>
            <Link
              href={Routes.Structure.Beneficiaires.Beneficiaire.Modifier.path({
                fileNumber,
              })}
              className="fr-btn fr-icon-pencil-line fr-btn--primary"
            >
              Modifier le bénéficiaire
            </Link>
          </li>
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
          </li>
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
        >
          <li role="presentation">
            <button
              id="tabpanel-404"
              className="fr-tabs__tab fr-icon-list-unordered fr-tabs__tab--icon-left"
              tabIndex={0}
              role="tab"
              aria-selected={!tab || tab === 'info' ? 'true' : 'false'}
              aria-controls="tabpanel-404-panel"
            >
              Info
            </button>
          </li>
          <li role="presentation">
            <button
              id="tabpanel-405"
              className="fr-tabs__tab fr-icon-file-line fr-tabs__tab--icon-left"
              tabIndex={-1}
              role="tab"
              aria-selected={tab === 'fichiers' ? 'true' : 'false'}
              aria-controls="tabpanel-405-panel"
            >
              Fichiers
            </button>
          </li>
          <li role="presentation">
            <button
              id="tabpanel-406"
              className="fr-tabs__tab fr-icon-folder-2-line fr-tabs__tab--icon-left"
              tabIndex={-1}
              role="tab"
              aria-selected={tab === 'historique' ? 'true' : 'false'}
              aria-controls="tabpanel-406-panel"
            >
              Historique
            </button>
          </li>
        </ul>
        <div
          id="tabpanel-404-panel"
          className={`fr-tabs__panel ${
            !tab || tab === 'info' ? 'fr-tabs__panel--selected' : ''
          }`}
          role="tabpanel"
          aria-labelledby="tabpanel-404"
          tabIndex={0}
        >
          <h4>Bénéficiaire</h4>
          <ul className="fr-raw-list">
            <LabelAndValue value={beneficiary.title}>Civilité</LabelAndValue>
            <LabelAndValue value={beneficiary.firstName}>Prénom</LabelAndValue>
            <LabelAndValue value={beneficiary.usualName}>
              Nom usuel
            </LabelAndValue>
            <LabelAndValue value={beneficiary.birthName}>
              Nom de naissance
            </LabelAndValue>
            <LabelAndValue value={beneficiary.birthDate?.toLocaleDateString()}>
              Date de naissance
            </LabelAndValue>
            <LabelAndValue
              value={
                beneficiary.birthDate ? getAge(beneficiary.birthDate) : null
              }
            >
              Age
            </LabelAndValue>
          </ul>
        </div>
        <div
          id="tabpanel-405-panel"
          className={`fr-tabs__panel ${
            tab === 'fichiers' ? 'fr-tabs__panel--selected' : ''
          }`}
          role="tabpanel"
          aria-labelledby="tabpanel-405"
          tabIndex={0}
        >
          <h4>Fichiers</h4>
          <p>Aucun fichier disponible</p>
        </div>
        <div
          id="tabpanel-406-panel"
          className={`fr-tabs__panel ${
            tab === 'historique' ? 'fr-tabs__panel--selected' : ''
          }`}
          role="tabpanel"
          aria-labelledby="tabpanel-406"
          tabIndex={0}
        >
          <h4>Historique</h4>

          <div>
            {supports.map((support) => {
              return (
                <div
                  key={support.id}
                  className="fr-grid-row fr-grid-row--gutters"
                >
                  <div className="fr-col-12 fr-col-md-2 fr-text-label--blue-france fr-text--bold">
                    {support.historyDate.toLocaleDateString()}
                  </div>
                  <div className="fr-col-12 fr-col-md-10">
                    <div className="fr-card">
                      <div className="fr-card__body fr-px-4w">
                        <div className="fr-card__content fr-py-4v">
                          <div className="fr-grid-row">
                            <div className="fr-col-12 fr-col-md-8">
                              <ul className="fr-raw-list">
                                <LabelAndValue
                                  value={
                                    support.__type === 'helpRequest'
                                      ? "Demande d'aide"
                                      : 'Entretien'
                                  }
                                >
                                  Type
                                </LabelAndValue>
                                <LabelAndValue value={support.type.name}>
                                  Accompagnement
                                </LabelAndValue>
                                <LabelAndValue value={support.status}>
                                  Statut
                                </LabelAndValue>

                                {support.__type === 'followup' ? (
                                  <>
                                    <LabelAndValue
                                      value={support.organisationName}
                                    >
                                      Redirigé vers
                                    </LabelAndValue>
                                  </>
                                ) : null}
                                {support.__type === 'helpRequest' ? (
                                  <>
                                    <LabelAndValue
                                      value={
                                        support.financialSupport ? 'Oui' : 'Non'
                                      }
                                    >
                                      Demande financière
                                    </LabelAndValue>
                                  </>
                                ) : null}
                              </ul>
                            </div>
                            <div
                              className={`fr-col-12 fr-col-md-4 fr-text--bold ${
                                support.agent.id === user.id
                                  ? 'fr-text-label--blue-france'
                                  : null
                              }`}
                            >
                              {getUserDisplayName(support.agent)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
export default BeneficiaryPage
