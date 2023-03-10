import { Link } from '@mss/web/components/Generic/Link'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { getUserDisplayName } from '@mss/web/utils/user'
import { PageConfig, PageTitle } from '@mss/web/components/PageTitle'
import {
  RoutePathParams,
  RoutePathSearchParams,
  Routes,
} from '@mss/web/app/routing/routes'
import { DocumentsTab } from '@mss/web/components/DocumentsTab'
import { HistoryTab } from '@mss/web/components/HistoryTab'
import { InfoTab } from '@mss/web/components/InfoTab'
import {
  canDeleteBeneficiary,
  canEditBeneficiaryGeneralInfo,
  canCreateBeneficiaryHelpRequest,
} from '@mss/web/security/rules'
import { AttributesList, TabOptions, Tabs } from '@mss/web/components/Generic'
import { MutationLog } from '@mss/web/components/MutationLog'
import { dateAsDay } from '@mss/web/utils/dateAsDay'
import { BeneficiairesQuery } from '@mss/web/query'

export const revalidate = 0

const BeneficiaryPage = async ({
  params: { fileNumber },
  searchParams,
}: {
  params: RoutePathParams<typeof Routes.Beneficiaires.Beneficiaire.Index.path>
  searchParams?: RoutePathSearchParams<
    typeof Routes.Beneficiaires.Beneficiaire.Index.path
  >
}) => {
  const user = await getAuthenticatedAgent()
  // TODO use security rules instead of where filters

  const beneficiary = await BeneficiairesQuery.getBeneficiaryToView(fileNumber)
  const [supports, documents, followupTypes] = await Promise.all([
    BeneficiairesQuery.getSupports({
      beneficiaryId: beneficiary.id,
      agentId: user.id,
    }),
    BeneficiairesQuery.getDocuments({
      beneficiaryId: beneficiary.id,
      userId: user.id,
    }),
    BeneficiairesQuery.getFollowupTypes({
      beneficiaryId: beneficiary.id,
    }),
  ])

  const { referents } = beneficiary

  const page: PageConfig = {
    icon: Routes.Beneficiaires.Beneficiaire.Index.icon,
    title: Routes.Beneficiaires.Beneficiaire.Index.title(beneficiary),
  }

  const canEdit = canEditBeneficiaryGeneralInfo(user, beneficiary)
  const canArchive = canDeleteBeneficiary(user, beneficiary)
  const canCreateHelpRequest = canCreateBeneficiaryHelpRequest(
    user,
    beneficiary,
  )

  const tab = searchParams?.tab ?? 'info'
  const tabs = [
    {
      id: 'info',
      icon: 'list-unordered',
      title: 'Info',
      href: Routes.Beneficiaires.Beneficiaire.Index.path(
        { fileNumber },
        tab === 'info' ? searchParams : {},
      ),
      content: (
        <InfoTab
          user={user}
          beneficiary={beneficiary}
          followupTypes={followupTypes}
        />
      ),
    },
    {
      id: 'documents',
      icon: 'file-line',
      title: 'Documents',
      href: Routes.Beneficiaires.Beneficiaire.Index.path(
        { fileNumber },
        tab === 'documents' ? searchParams : { tab: 'documents' },
      ),
      content: (
        <DocumentsTab
          user={user}
          documents={documents}
          beneficiary={beneficiary}
        />
      ),
    },
    {
      id: 'historique',
      icon: 'folder-2-line',
      title: 'Historique',
      href: Routes.Beneficiaires.Beneficiaire.Index.path(
        { fileNumber },
        tab === 'historique' ? searchParams : { tab: 'historique' },
      ),
      content: (
        <HistoryTab
          user={user}
          supports={supports}
          beneficiary={beneficiary}
          scrollToItem={
            tab === 'historique' ? searchParams?.accompagnement : undefined
          }
        />
      ),
    },
  ] satisfies TabOptions<typeof tab>[]

  return (
    <>
      <PageTitle page={page} parents={[Routes.Beneficiaires.Index]} />
      {beneficiary.archived ? (
        <div className="fr-alert fr-alert--warning fr-mb-8v">
          <h3 className="fr-alert__title">B??n??ficiaire archiv??</h3>
          <p>
            Ce b??n??ficiaire a ??t?? archiv?? le {dateAsDay(beneficiary.archived)}
          </p>
          <p>
            Conform??ment ?? la RGPD, ses donn??es personnelles ont ??t??
            d??finitivement supprim??es.
          </p>
        </div>
      ) : null}
      <div className="fr-col-12 fr-col-lg-8 fr-col-xl-9">
        <AttributesList
          items={[
            [
              'N?? dossier',
              <span
                key="filenumber"
                className="fr-badge fr-badge--blue-cumulus"
              >
                {fileNumber}
              </span>,
            ],
            [
              referents.length === 1 ? 'Agent r??f??rent' : 'Agents r??f??rents',
              referents.length === 0
                ? 'Aucun'
                : referents.map(getUserDisplayName).map((name) => (
                    <span key={name} className="fr-tag fr-mr-1w">
                      {name}
                    </span>
                  )),
              { verticalAlign: 'center' },
            ],
          ]}
        />
      </div>
      <div className="fr-col-12 fr-mt-4v">
        {beneficiary.archived ? null : (
          <ul className="fr-btns-group  fr-btns-group--icon-left fr-btns-group--inline fr-btns-group--sm">
            {canEdit ? (
              <li>
                <Link
                  href={Routes.Beneficiaires.Beneficiaire.Modifier.path({
                    fileNumber,
                  })}
                  className="fr-btn fr-icon-pencil-line fr-btn--primary"
                >
                  Modifier le b??n??ficiaire
                </Link>
              </li>
            ) : null}
            <li>
              <Link
                href={Routes.Accompagnements.Entretien.Nouveau.path({
                  dossier: fileNumber,
                })}
                className="fr-btn fr-icon-file-add-line fr-btn--secondary"
              >
                Synth??se d&apos;entretien
              </Link>
            </li>
            {canCreateHelpRequest ? (
              <li>
                <Link
                  href={Routes.Accompagnements.DemandeDAide.Nouvelle.path({
                    dossier: fileNumber,
                  })}
                  className="fr-btn fr-icon-file-add-line fr-btn--secondary"
                >
                  Demande d&apos;aide
                </Link>
              </li>
            ) : null}
            {canArchive ? (
              <li>
                <Link
                  href={Routes.Beneficiaires.Beneficiaire.Archiver.path({
                    fileNumber,
                  })}
                  className="fr-btn fr-btn--secondary fr-icon-archive-line fr-btn--primary"
                >
                  Archiver le b??n??ficiaire
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
        )}
      </div>
      <Tabs
        ariaLabel="Informations du b??n??ficiaire"
        current={tab}
        tabs={tabs}
      />
      <MutationLog
        targetStructureId={beneficiary.structureId}
        targetBeneficiaryId={beneficiary.id}
        className="fr-my-8v"
      />
    </>
  )
}

export default BeneficiaryPage
