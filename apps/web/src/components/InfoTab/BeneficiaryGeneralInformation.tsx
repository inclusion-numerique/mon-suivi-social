import {
  beneficiaryAccomodationModeLabels,
  beneficiaryFamilySituationLabels,
  beneficiaryGenderLabels,
  beneficiaryMobilityLabels,
} from '@mss/web/constants/beneficiary'
import { beneficiaryDisplayName } from '@mss/web/utils/beneficiary'
import { AddBeneficiaryWithFullDataClient } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithFullData.client'
import { Beneficiary } from '@prisma/client'
import { AttributesList } from '@mss/web/components/Generic'
import { dateAsDay } from '@mss/web/utils/dateAsDay'
import { getAge } from '@mss/web/utils/age'
import { Nationalities } from '@mss/web/constants/nationality'
import { BeneficiaryAddress } from './BeneficiaryAddress'

export function BeneficiaryGeneralInformation({
  beneficiary,
  className,
}: {
  beneficiary: Beneficiary
  className?: string
}) {
  const { fieldLabels } = AddBeneficiaryWithFullDataClient
  const { street, addressComplement, zipcode, city, region } = beneficiary
  const hasAddress = street || addressComplement || zipcode || city || region

  return (
    <div className={`fr-col-12 fr-mb-2w fr-p-9v ${className}`}>
      <h3 className="fr-h4">Informations générales</h3> <hr />
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-12 fr-col-lg-6">
          <h4 className="fr-text--md fr-mb-1w">Identité du bénéficiaire</h4>
          <p>
            <strong>{beneficiaryDisplayName(beneficiary, true)}</strong>
          </p>
          <AttributesList
            items={[
              [
                fieldLabels.birthDate || '', // FIXME: Ici, on a un soucis de type
                beneficiary.birthDate
                  ? `${dateAsDay(beneficiary.birthDate)} (${getAge(
                      beneficiary.birthDate,
                    )} ans)`
                  : null,
              ],
              [fieldLabels.birthPlace || '', beneficiary.birthPlace],
              [fieldLabels.deathDate || '', dateAsDay(beneficiary.deathDate)],
              [
                fieldLabels.gender || '',
                beneficiary.gender
                  ? beneficiaryGenderLabels[beneficiary.gender]
                  : undefined,
              ],
              [
                fieldLabels.nationality || '',
                beneficiary.nationality
                  ? Nationalities[beneficiary.nationality]
                  : null,
              ],
            ]}
          />
        </div>
        <div className="fr-col-12 fr-col-lg-6">
          <h4 className="fr-text--md fr-mb-1w">Coordonnées</h4>
          <AttributesList
            items={[
              [fieldLabels.noPhone, beneficiary.noPhone || null],
              [fieldLabels.phone1 || '', beneficiary.phone1],
              [fieldLabels.phone2 || '', beneficiary.phone2],
              [fieldLabels.email || '', beneficiary.email],
            ]}
          />
          <h4 className="fr-text--md fr-mt-4w fr-mb-1w">Mobilité</h4>
          <AttributesList
            items={[
              [
                fieldLabels.mobility || '',
                beneficiary.mobility
                  ? beneficiaryMobilityLabels[beneficiary.mobility]
                  : null,
              ],
            ]}
          />
        </div>
      </div>
      <hr className="fr-mt-5w fr-mb-3w" />
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-12 fr-col-lg-6">
          <h4 className="fr-text--md fr-mb-1w">Adresse/Hébergement</h4>
          <AttributesList
            items={[
              [
                fieldLabels.accomodationMode || '',
                beneficiary.accomodationMode
                  ? beneficiaryAccomodationModeLabels[
                      beneficiary.accomodationMode
                    ]
                  : null,
              ],
              [
                fieldLabels.accomodationName || '',
                beneficiary.accomodationName,
              ],
              [
                fieldLabels.accomodationAdditionalInformation || '',
                beneficiary.accomodationAdditionalInformation,
              ],
              [
                'Adresse',
                hasAddress ? (
                  <BeneficiaryAddress key="address" beneficiary={beneficiary} />
                ) : null,
              ],
            ]}
          />
        </div>
        <div className="fr-col-12 fr-col-lg-6">
          <h4 className="fr-text--md fr-mb-1w">Situation familiale</h4>
          <AttributesList
            items={[
              [
                fieldLabels.familySituation || '',
                beneficiary.familySituation
                  ? beneficiaryFamilySituationLabels[
                      beneficiary.familySituation
                    ]
                  : null,
              ],
              [fieldLabels.caregiver, beneficiary.caregiver || null],
              [fieldLabels.minorChildren || '', beneficiary.minorChildren],
              [fieldLabels.majorChildren || '', beneficiary.majorChildren],
            ]}
          />
        </div>
      </div>
    </div>
  )
}
