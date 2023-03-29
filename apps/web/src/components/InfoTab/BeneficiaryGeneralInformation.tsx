import {
  beneficiaryAccomodationModeLabels,
  beneficiaryFamilySituationLabels,
  beneficiaryGenderLabels,
  beneficiaryMobilityLabels,
} from '@mss/web/client/options/beneficiary'
import { beneficiaryDisplayName } from '@mss/web/utils/beneficiary'
import { Beneficiary } from '@prisma/client'
import { AttributesList } from '@mss/web/components/Generic'
import { dateAsDay } from '@mss/web/utils/dateAsDay'
import { getAge } from '@mss/web/utils/age'
import { Nationalities } from '@mss/web/client/options/nationality'
import { BeneficiaryAddress } from './BeneficiaryAddress'
import { beneficiaryFieldLabels } from '@mss/web/client/labels'

export function BeneficiaryGeneralInformation({
  beneficiary,
  className,
}: {
  beneficiary: Beneficiary
  className?: string
}) {
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
                beneficiaryFieldLabels.birthDate || '', // FIXME: Ici, on a un soucis de type
                beneficiary.birthDate
                  ? `${dateAsDay(beneficiary.birthDate)} (${getAge(
                      beneficiary.birthDate,
                    )} ans)`
                  : null,
              ],
              [beneficiaryFieldLabels.birthPlace || '', beneficiary.birthPlace],
              [
                beneficiaryFieldLabels.deathDate || '',
                dateAsDay(beneficiary.deathDate),
              ],
              [
                beneficiaryFieldLabels.gender || '',
                beneficiary.gender
                  ? beneficiaryGenderLabels[beneficiary.gender]
                  : undefined,
              ],
              [
                beneficiaryFieldLabels.nationality || '',
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
              [beneficiaryFieldLabels.noPhone, beneficiary.noPhone || null],
              [beneficiaryFieldLabels.phone1 || '', beneficiary.phone1],
              [beneficiaryFieldLabels.phone2 || '', beneficiary.phone2],
              [beneficiaryFieldLabels.email || '', beneficiary.email],
            ]}
          />
          <h4 className="fr-text--md fr-mt-4w fr-mb-1w">Mobilité</h4>
          <AttributesList
            items={[
              [
                beneficiaryFieldLabels.mobility || '',
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
                beneficiaryFieldLabels.accomodationMode || '',
                beneficiary.accomodationMode
                  ? beneficiaryAccomodationModeLabels[
                      beneficiary.accomodationMode
                    ]
                  : null,
              ],
              [
                beneficiaryFieldLabels.accomodationName || '',
                beneficiary.accomodationName,
              ],
              [
                beneficiaryFieldLabels.accomodationAdditionalInformation || '',
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
                beneficiaryFieldLabels.familySituation || '',
                beneficiary.familySituation
                  ? beneficiaryFamilySituationLabels[
                      beneficiary.familySituation
                    ]
                  : null,
              ],
              [beneficiaryFieldLabels.caregiver, beneficiary.caregiver || null],
              [
                beneficiaryFieldLabels.minorChildren || '',
                beneficiary.minorChildren,
              ],
              [
                beneficiaryFieldLabels.majorChildren || '',
                beneficiary.majorChildren,
              ],
            ]}
          />
        </div>
      </div>
    </div>
  )
}
