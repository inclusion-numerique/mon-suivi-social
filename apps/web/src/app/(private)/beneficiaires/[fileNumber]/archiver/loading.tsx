import { Routes } from '@mss/web/app/routing/routes'
import { PageLoading } from '@mss/web/app/(private)/PageLoading'
import { loadingBeneficiary } from '@mss/web/app/(private)/beneficiaires/loadingBeneficiary'

const Loading = () => (
  <PageLoading
    page={{
      ...Routes.Beneficiaires.Beneficiaire.Archiver,
      title:
        Routes.Beneficiaires.Beneficiaire.Archiver.title(loadingBeneficiary),
    }}
    parents={[
      Routes.Beneficiaires.Index,
      {
        title:
          Routes.Beneficiaires.Beneficiaire.Index.title(loadingBeneficiary),
        path: Routes.Beneficiaires.Beneficiaire.Index.path(loadingBeneficiary),
      },
    ]}
  />
)

export default Loading
