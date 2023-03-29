import { getUserDisplayName } from '@mss/web/utils/user'
import { nonBreakable } from '@mss/web/utils/nonBreakable'
import { TableColumnDefinition } from '@mss/web/components/Generic/table/TableColumnDefinition'
import { getAge } from '@mss/web/utils/age'
import { dateAsDay } from '@mss/web/utils/dateAsDay'
import { beneficiaryStatusLabels } from '@mss/web/constants/beneficiary'
import { BeneficiaryListItem } from '@mss/web/server/query'

export const beneficiaryColumns = [
  {
    label: 'Nom',
    sortable: (direction) => [
      { usualName: direction },
      { birthName: direction },
    ],
    content: (beneficiary: BeneficiaryListItem) =>
      beneficiary.usualName ? beneficiary.usualName : beneficiary.birthName,
  },
  {
    label: 'Prénom',
    sortable: (direction) => [{ firstName: direction }],
    content: ({ firstName }: BeneficiaryListItem) => firstName,
  },
  {
    label: 'Âge',
    content: ({ birthDate }: BeneficiaryListItem) =>
      birthDate ? getAge(birthDate) : null,
  },
  {
    label: 'Date de naissance',
    content: ({ birthDate }: BeneficiaryListItem) => dateAsDay(birthDate),
  },
  {
    label: 'Adresse',
    content: ({ streetNumber, street }: BeneficiaryListItem) =>
      `${streetNumber ?? ''} ${street ?? ''}`.trim(),
  },
  {
    label: 'Ville',
    content: ({ city }: BeneficiaryListItem) => city,
  },
  {
    label: 'Téléphone',
    content: ({ phone1, phone2 }: BeneficiaryListItem) =>
      phone1 ?? phone2 ?? '',
  },
  {
    label: 'Accompagnements',
    content: ({ followups, helpRequests }: BeneficiaryListItem) => {
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
    content: ({ referents }: BeneficiaryListItem) => (
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
    content: ({ status }: BeneficiaryListItem) =>
      beneficiaryStatusLabels[status],
  },
  {
    label: 'N° dossier',
    content: ({ fileNumber }: BeneficiaryListItem) => (
      <span className="fr-badge fr-badge--blue-cumulus">{fileNumber}</span>
    ),
  },
] satisfies TableColumnDefinition<BeneficiaryListItem>[]
