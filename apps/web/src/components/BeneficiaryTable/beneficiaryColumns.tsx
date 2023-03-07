import { getUserDisplayName } from '@mss/web/utils/user'
import { nonBreakable } from '@mss/web/utils/nonBreakable'
import { TableColumnDefinition } from '@mss/web/components/Generic/table/TableColumnDefinition'
import { getAge } from '@mss/web/utils/age'
import { dateAsDay } from '@mss/web/utils/dateAsDay'
import { beneficiaryStatusLabels } from '@mss/web/constants/beneficiary'
import { IterateBeneficiariesReturn } from '@mss/web/query'

type IterateBeneficiariesItem =
  IterateBeneficiariesReturn['beneficiaries'][number]

export const beneficiaryColumns = [
  {
    label: 'Nom',
    sortable: (direction) => [
      { usualName: direction },
      { birthName: direction },
    ],
    content: (beneficiary: IterateBeneficiariesItem) =>
      beneficiary.usualName ? beneficiary.usualName : beneficiary.birthName,
  },
  {
    label: 'Prénom',
    sortable: (direction) => [{ firstName: direction }],
    content: ({ firstName }: IterateBeneficiariesItem) => firstName,
  },
  {
    label: 'Âge',
    content: ({ birthDate }: IterateBeneficiariesItem) =>
      birthDate ? getAge(birthDate) : null,
  },
  {
    label: 'Date de naissance',
    content: ({ birthDate }: IterateBeneficiariesItem) => dateAsDay(birthDate),
  },
  {
    label: 'Adresse',
    content: ({ streetNumber, street }: IterateBeneficiariesItem) =>
      `${streetNumber ?? ''} ${street ?? ''}`.trim(),
  },
  {
    label: 'Ville',
    content: ({ city }: IterateBeneficiariesItem) => city,
  },
  {
    label: 'Téléphone',
    content: ({ phone1, phone2 }: IterateBeneficiariesItem) =>
      phone1 ?? phone2 ?? '',
  },
  {
    label: 'Accompagnements',
    content: ({ followups, helpRequests }: IterateBeneficiariesItem) => {
      const deduplicatedTypesMap = new Map<string, string>(
        [
          ...followups.flatMap((followup) => followup.types),
          ...helpRequests.map((helpRequest) => helpRequest.type),
        ].map(({ id, name }) => [id, name]),
      )

      return (
        <div style={{ marginTop: '-0.25rem', marginLeft: '-0.25rem' }}>
          {[...deduplicatedTypesMap.values()].sort().map((label) => (
            <div key={label} className="fr-tag fr-tag--sm fr-mt-1v fr-ml-1v">
              {nonBreakable(label)}
            </div>
          ))}
        </div>
      )
    },
  },
  {
    label: 'Référents',
    content: ({ referents }: IterateBeneficiariesItem) => (
      <>
        {referents.map((referent) => (
          <div key={referent.id} className="fr-tag fr-tag--sm">
            {nonBreakable(getUserDisplayName(referent))}
          </div>
        ))}
      </>
    ),
  },
  {
    label: 'Statut du dossier',
    content: ({ status }: IterateBeneficiariesItem) =>
      beneficiaryStatusLabels[status],
  },
  {
    label: 'N° dossier',
    content: ({ fileNumber }: IterateBeneficiariesItem) => (
      <span className="fr-badge fr-badge--blue-cumulus">{fileNumber}</span>
    ),
  },
] satisfies TableColumnDefinition<IterateBeneficiariesItem>[]
