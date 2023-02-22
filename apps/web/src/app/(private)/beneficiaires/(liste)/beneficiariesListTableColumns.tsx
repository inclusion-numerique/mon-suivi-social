import { ListBeneficiariesItem } from '@mss/web/features/beneficiary/listBeneficiaries/listBeneficiaries.server'
import { getUserDisplayName } from '@mss/web/utils/user'
import { nonBreakable } from '@mss/web/utils/nonBreakable'
import { TableColumnDefinition } from '@mss/web/ui/table/TableColumnDefinition'
import { getAge } from '@mss/web/utils/age'
import { dateAsDay } from '@mss/web/utils/dateAsDay'
import { beneficiaryStatusLabels } from '@mss/web/beneficiary/beneficiary'

export const beneficiariesListTableColumns = [
  {
    label: 'Nom',
    sortable: (direction) => [
      { usualName: direction },
      { birthName: direction },
    ],
    content: (beneficiary: ListBeneficiariesItem) =>
      beneficiary.usualName ? beneficiary.usualName : beneficiary.birthName,
  },
  {
    label: 'Prénom',
    sortable: (direction) => [{ firstName: direction }],
    content: ({ firstName }: ListBeneficiariesItem) => firstName,
  },
  {
    label: 'Âge',
    content: ({ birthDate }: ListBeneficiariesItem) =>
      birthDate ? getAge(birthDate) : null,
  },
  {
    label: 'Date de naissance',
    content: ({ birthDate }: ListBeneficiariesItem) => dateAsDay(birthDate),
  },
  {
    label: 'Adresse',
    content: ({ streetNumber, street }: ListBeneficiariesItem) =>
      `${streetNumber ?? ''} ${street ?? ''}`.trim(),
  },
  {
    label: 'Ville',
    content: ({ city }: ListBeneficiariesItem) => city,
  },
  {
    label: 'Téléphone',
    content: ({ phone1, phone2 }: ListBeneficiariesItem) =>
      phone1 ?? phone2 ?? '',
  },
  {
    label: 'Accompagnements',
    content: ({ followups, helpRequests }: ListBeneficiariesItem) => {
      const deduplicatedTypesMap = new Map<string, string>(
        [
          ...followups.map((followup) => followup.types).flat(),
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
    content: ({ referents }: ListBeneficiariesItem) => (
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
    content: ({ status }: ListBeneficiariesItem) =>
      beneficiaryStatusLabels[status],
  },
  {
    label: 'N° dossier',
    content: ({ fileNumber }: ListBeneficiariesItem) => (
      <span className="fr-badge fr-badge--blue-cumulus">{fileNumber}</span>
    ),
  },
] satisfies TableColumnDefinition<ListBeneficiariesItem>[]
