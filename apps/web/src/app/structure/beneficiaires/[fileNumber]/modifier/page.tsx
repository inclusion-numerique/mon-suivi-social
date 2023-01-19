import BeneficiaryForm from '@mss/web/beneficiary/BeneficiaryForm'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { getAgentOptions } from '@mss/web/app/structure/beneficiaires/getAgentOptions'
import { notFound } from 'next/navigation'
import { prismaClient } from '@mss/web/prismaClient'

import { serializeDate } from '@mss/web/utils/serializeDate'
export const revalidate = 0

const EditBeneficiaryPage = async ({
  params: { fileNumber },
}: {
  params: { fileNumber?: string }
}) => {
  if (!fileNumber) {
    return notFound()
  }

  const user = await getAuthenticatedAgent()
  const agents = await getAgentOptions(user)
  const beneficiary = await prismaClient.beneficiary.findUnique({
    where: { fileNumber },
  })

  if (!beneficiary || beneficiary.organisationId != user.organisationId) {
    return notFound()
  }

  const {
    birthDate,
    deathDate,
    created,
    updated,
    additionalInformation,
    ...rest
  } = beneficiary

  // Serialized for client component
  const serializedBeneficiary = {
    ...rest,
    birthDate: serializeDate(birthDate),
    deathDate: serializeDate(deathDate),
    created: serializeDate(created),
    updated: serializeDate(updated),
    additionalInformation: additionalInformation ?? '',
  }

  return (
    <>
      <div className="fr-grid-row">
        <h2>Modifier un·e bénéficiaire</h2>
      </div>
      <div className="fr-card">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <BeneficiaryForm
              agents={agents}
              defaultValues={serializedBeneficiary}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default EditBeneficiaryPage
