import { ListBeneficiariesItem } from '@mss/web/features/beneficiary/listBeneficiaries/listBeneficiaries.server'
import { ReactNode } from 'react'
import { getUserDisplayName } from '@mss/web/utils/user'
import { nonBreakable } from '@mss/web/utils/nonBreakable'

// TODO move to generic
export type TableColumnDefinition<Item> = {
  label: string
  sortable?: unknown
  content: (item: Item) => ReactNode
}

export const beneficiariesListTableColumns = [
  {
    label: 'Nom',
    sortable: (direction: 'asc' | 'desc') => [
      { usualName: direction },
      { birthName: direction },
    ],
    content: (beneficiary: ListBeneficiariesItem) =>
      beneficiary.usualName ?? beneficiary.birthName,
  },
  {
    label: 'Prénom',
    sortable: (direction: 'asc' | 'desc') => [{ firstName: direction }],
    content: ({ firstName }: ListBeneficiariesItem) => firstName,
  },
  {
    label: 'Âge',
    content: ({ birthDate }: ListBeneficiariesItem) =>
      // TODO age computation
      birthDate?.toString(),
  },
  {
    label: 'Date de naissance',
    content: ({ birthDate }: ListBeneficiariesItem) =>
      // TODO format function
      birthDate?.toString(),
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
      console.log('DATA', followups[0], helpRequests[0])
      const deduplicatedTypesMap = new Map<string, string>(
        [
          ...followups.map((followup) => followup.type),
          ...helpRequests.map((helpRequest) => helpRequest.type),
        ].map(({ id, name }) => [id, name]),
      )

      return (
        <>
          {[...deduplicatedTypesMap.values()].sort().map((label) => (
            <div key={label} className="fr-tag fr-tag--sm">
              {nonBreakable(label)}
            </div>
          ))}
        </>
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
    // TODO labels for status
    content: ({ status }: ListBeneficiariesItem) => status,
  },
  {
    label: 'N° dossier',
    content: ({ fileNumber }: ListBeneficiariesItem) => fileNumber,
  },
] satisfies TableColumnDefinition<ListBeneficiariesItem>[]
