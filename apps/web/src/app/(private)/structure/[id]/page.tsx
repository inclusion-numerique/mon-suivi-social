import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { PageConfig, PageTitle } from '@mss/web/app/(private)/PageTitle'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { notFound } from 'next/navigation'
import { canViewStructure } from '@mss/web/security/rules'
import { prismaClient } from '@mss/web/prismaClient'
import { groupFollowupTypesByLegality } from '@mss/web/structure/groupFollowupTypes'
import Link from 'next/link'
import { AttributeItem, AttributesList } from '@mss/web/ui/AttributesList'
import { EditStructureClient } from '@mss/web/features/structure/editStructure/editStructure.client'

export const revalidate = 0

const StructurePage = async ({
  params: { id: structureId },
}: {
  params: RoutePathParams<typeof Routes.Structure.Structure.Index.path>
}) => {
  const user = await getAuthenticatedAgent()

  // TODO ViewStructure feature ?
  if (!canViewStructure(user, { structureId })) {
    notFound()
    return null
  }

  const structure = await prismaClient.structure.findUniqueOrThrow({
    where: { id: structureId },
    include: {
      proposedFollowupTypes: {
        select: {
          followupType: {
            select: { id: true, name: true, legallyRequired: true },
          },
        },
      },
    },
  })

  const page: PageConfig = {
    ...Routes.Structure.Structure.Index,
    title: Routes.Structure.Structure.Index.title(structure),
  }

  const { type, address, email, phone, zipcode, city, proposedFollowupTypes } =
    structure

  const { legalFollowupTypes, optionalFollowupTypes } =
    groupFollowupTypesByLegality(
      proposedFollowupTypes.map(({ followupType }) => followupType),
    )

  const attributes: AttributeItem[] = [
    ['Type de structure', type],
    ['Adresse', address],
    ['Code postal', zipcode],
    ['Ville', city],
    ['N° de téléphone', phone],
    ['Adresse email', email],
    [
      'Accompagnements légaux proposés',

      legalFollowupTypes.length === 0 ? (
        'Aucun'
      ) : (
        <div className="fr-mt-2v">
          {legalFollowupTypes.map((followupType) => (
            <FollowupTypeBadge key={followupType.id} name={followupType.name} />
          ))}
        </div>
      ),
      { inline: false },
    ],
    [
      'Accompagnements optionnels proposés',
      optionalFollowupTypes.length === 0 ? (
        'Aucun'
      ) : (
        <div className="fr-mt-2v">
          {optionalFollowupTypes.map((followupType) => (
            <FollowupTypeBadge key={followupType.id} name={followupType.name} />
          ))}
        </div>
      ),
      { inline: false },
    ],
  ]

  return (
    <>
      <PageTitle page={page} />
      <div className="fr-col-12 fr-mt-4v">
        <ul className="fr-btns-group  fr-btns-group--icon-left fr-btns-group--inline fr-btns-group--sm">
          {EditStructureClient.securityCheck(
            user,
            {
              structureId,
            },
            {},
          ) ? (
            <li>
              <Link
                href={Routes.Structure.Structure.Modifier.path({
                  structureId: structure.id,
                })}
                className="fr-btn fr-icon-pencil-line fr-btn--primary"
              >
                Modifier la structure
              </Link>
            </li>
          ) : null}
        </ul>
      </div>
      <div className="fr-card">
        <div className="fr-card__body fr-py-8v">
          <AttributesList items={attributes} />
        </div>
      </div>
    </>
  )
}

const FollowupTypeBadge = ({ name }: { name: string }) => (
  <div className="fr-tag fr-mb-2v fr-mr-2v">{name}</div>
)

export default StructurePage
