import { Routes } from '@mss/web/app/routing/routes'
import { PageLoading } from '@mss/web/app/(private)/PageLoading'
import { loadingBeneficiary } from '@mss/web/app/(private)/beneficiaires/loadingBeneficiary'

const Loading = () => (
  <PageLoading
    page={{
      ...Routes.Structure.Beneficiaires.Beneficiaire.Archiver,
      title:
        Routes.Structure.Beneficiaires.Beneficiaire.Archiver.title(
          loadingBeneficiary,
        ),
    }}
    parents={[
      Routes.Structure.Beneficiaires.Index,
      {
        title:
          Routes.Structure.Beneficiaires.Beneficiaire.Index.title(
            loadingBeneficiary,
          ),
        path: Routes.Structure.Beneficiaires.Beneficiaire.Index.path(
          loadingBeneficiary,
        ),
      },
    ]}
  />
)

export default Loading
