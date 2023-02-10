import { Routes } from '@mss/web/app/routing/routes'
import { PageLoading } from '@mss/web/app/(private)/PageLoading'
import { loadingBeneficiary } from '@mss/web/app/(private)/beneficiaires/loadingBeneficiary'

const Loading = () => (
  <PageLoading
    page={{
      ...Routes.Beneficiaires.Beneficiaire.Index,
      title: Routes.Beneficiaires.Beneficiaire.Index.title(loadingBeneficiary),
    }}
    parents={[Routes.Beneficiaires.Index]}
  />
)

export default Loading
