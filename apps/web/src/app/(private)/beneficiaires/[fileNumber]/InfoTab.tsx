import { getAge } from '@mss/web/utils/age'
import { SessionUser } from '@mss/web/auth/sessionUser'
import type {
  BeneficiaryFollowupTypes,
  BeneficiaryPageInfo,
} from '@mss/web/app/(private)/beneficiaires/[fileNumber]/page'
import { AttributesList } from '@mss/web/ui/AttributesList'
import { beneficiaryTitleLabels } from '@mss/web/beneficiary/beneficiary'
import { dateAsDay } from '@mss/web/utils/dateAsDay'
import { isEmptyValue } from '@mss/web/utils/isEmptyValue'

export const InfoTab = ({
  beneficiary,
  followupTypes,
}: {
  user: SessionUser
  beneficiary: BeneficiaryPageInfo
  followupTypes: BeneficiaryFollowupTypes
}) => {
  const legals = followupTypes.filter(({ legallyRequired }) => legallyRequired)
  const optionals = followupTypes.filter(
    ({ legallyRequired }) => !legallyRequired,
  )

  return (
    <div className="fr-grid-row fr-grid-row--gutters">
      <div className="fr-col-12 fr-col-lg-6">
        <h5>Bénéficiaire</h5>
        <AttributesList
          items={[
            beneficiary.title
              ? ['Civilité', beneficiaryTitleLabels[beneficiary.title]]
              : undefined,
            ['Prénom', beneficiary.firstName],
            ['Nom usuel', beneficiary.usualName],
            ['Nom de naissance', beneficiary.birthName],
            [
              'Age',
              beneficiary.birthDate ? getAge(beneficiary.birthDate) : null,
            ],
            ['Date de naissance', dateAsDay(beneficiary.birthDate)],
          ]}
        />
        <p className="fr-mt-4v">🚧 en cours de développement</p>
      </div>
      <div className="fr-col-12 fr-col-lg-6">
        <h5>Types d&apos;accompagnement</h5>
        {legals.length > 0 ? (
          <>
            <p className="fr-mb-2v">Aides légales :</p>
            {legals.map(({ name }) => (
              <div key={name} className="fr-tag fr-mb-2v fr-mr-1w">
                {name}
              </div>
            ))}
          </>
        ) : null}
        {optionals.length > 0 ? (
          <>
            <p className="fr-mb-2v">Aides facultatives :</p>
            {optionals.map(({ name }) => (
              <div key={name} className="fr-tag fr-mb-2v fr-mr-1w">
                {name}
              </div>
            ))}
          </>
        ) : null}
        <h5 className="fr-mt-6v">Autres informations</h5>
        <p>
          {isEmptyValue(beneficiary.additionalInformation)
            ? 'Aucune information complémentaire renseignée.'
            : beneficiary.additionalInformation}
        </p>
      </div>
    </div>
  )
}
