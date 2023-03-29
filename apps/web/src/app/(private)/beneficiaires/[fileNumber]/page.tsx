import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { PageConfig, PageTitle } from '@mss/web/components/PageTitle'
import {
  RoutePathParams,
  RoutePathSearchParams,
  Routes,
} from '@mss/web/app/routing/routes'
import { DocumentsTab } from '@mss/web/components/DocumentsTab'
import { HistoryTab } from '@mss/web/components/HistoryTab'
import { InfoTab } from '@mss/web/components/InfoTab'
import { TabOptions, Tabs } from '@mss/web/components/Generic'
import { MutationLog } from '@mss/web/components/MutationLog'
import { dateAsDay } from '@mss/web/utils/dateAsDay'
import { BeneficiairesQuery } from '@mss/web/server/query'
import {
  BeneficiaryManageActions,
  BeneficiarySupportActions,
} from '@mss/web/components/BeneficiaryActions'
import { BeneficiaryMetaAttributes } from '@mss/web/components/BeneficiaryMetaAttributes'
import styles from './page.module.css'

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

  const page: PageConfig = {
    title: Routes.Beneficiaires.Beneficiaire.Index.title(beneficiary),
  }

  const tab = searchParams?.tab ?? 'info'
  const tabs = [
    {
      id: 'info',
      icon: 'info-fill',
      title: 'Informations',
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
      icon: 'folder-2-fill',
      title: 'Documents',
      href: Routes.Beneficiaires.Beneficiaire.Index.path(
        { fileNumber },
        tab === 'documents' ? searchParams : { tab: 'documents' },
      ),
      content: <DocumentsTab documents={documents} beneficiary={beneficiary} />,
    },
    {
      id: 'historique',
      icon: 'calendar-2-fill',
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

  // TODO: Responsive !
  return (
    <>
      <PageTitle page={page} parents={[Routes.Beneficiaires.Index]}>
        <BeneficiaryManageActions
          user={user}
          beneficiary={beneficiary}
          className="fr-ml-2w"
        />
      </PageTitle>

      {beneficiary.archived ? (
        <div className="fr-alert fr-alert--warning fr-mb-8v">
          <h3 className="fr-alert__title">Bénéficiaire archivé</h3>
          <p>
            Ce bénéficiaire a été archivé le {dateAsDay(beneficiary.archived)}
          </p>
          <p>
            Conformément à la RGPD, ses données personnelles ont été
            définitivement supprimées.
          </p>
        </div>
      ) : null}

      <div className="fr-col-12 fr-mt-1w">
        <BeneficiarySupportActions user={user} beneficiary={beneficiary} />
      </div>

      <hr className="fr-mt-3w" />

      <div className="fr-col-12">
        <BeneficiaryMetaAttributes
          beneficiary={beneficiary}
          className={styles.beneficiaryMetaAttributes}
        />
      </div>

      <hr className="fr-mt-2w" />

      <Tabs
        ariaLabel="Informations du bénéficiaire"
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
