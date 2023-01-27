import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { PageConfig, PageTitle } from '@mss/web/app/(private)/PageTitle'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { notFound } from 'next/navigation'
import { canViewOrganisation } from '@mss/web/security/rules'
import { prismaClient } from '@mss/web/prismaClient'
import { groupFollowupTypesByLegality } from '@mss/web/structure/groupFollowupTypes'
import Link from 'next/link'
import { EditStructureFeatureClient } from '@mss/web/features/editStructure/editStructure.client'

export const revalidate = 0

const StructurePage = async ({
  params: { id: organisationId },
}: {
  params: RoutePathParams<typeof Routes.Structure.Structure.Index.path>
}) => {
  const user = await getAuthenticatedAgent()

  // TODO ViewStructure feature ?
  if (!canViewOrganisation(user, { organisationId })) {
    notFound()
    return null
  }

  const structure = await prismaClient.organisation.findUniqueOrThrow({
    where: { id: organisationId },
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

  return (
    <>
      <PageTitle page={page} />
      <div className="fr-col-12 fr-mt-4v">
        <ul className="fr-btns-group  fr-btns-group--icon-left fr-btns-group--inline fr-btns-group--sm">
          {EditStructureFeatureClient.securityCheck(user, {
            organisationId,
          }) ? (
            <li>
              <Link
                href={Routes.Structure.Structure.Modifier.path({
                  organisationId: structure.id,
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
          <ul className="fr-raw-list">
            {/*TODO Representation of fields and labels with component with value as a child and label as prop. Handle undefined as empty */}
            <li>
              Type de structure&nbsp;: <strong>{type}</strong>
            </li>
            <li>
              Adresse&nbsp;: <strong>{address}</strong>
            </li>
            <li>
              Code postal&nbsp;: <strong>{zipcode}</strong>
            </li>
            <li>
              Ville&nbsp;: <strong>{city}</strong>
            </li>
            <li>
              N° de téléphone&nbsp;: <strong>{phone}</strong>
            </li>
            <li>
              Adresse email&nbsp;: <strong>{email}</strong>
            </li>
            <li>
              Types d&apos;accompagnements légaux proposés&nbsp;:{' '}
              {legalFollowupTypes.length === 0 ? <strong>Aucun</strong> : null}
            </li>
            <li>
              {legalFollowupTypes.map((followupType) => (
                <FollowupTypeBadge
                  key={followupType.id}
                  name={followupType.name}
                />
              ))}
            </li>
            <li>
              Types d&apos;accompagnements optionnels proposés&nbsp;:{' '}
              {optionalFollowupTypes.length === 0 ? (
                <strong>Aucun</strong>
              ) : null}
            </li>
            <li>
              {optionalFollowupTypes.map((followupType) => (
                <FollowupTypeBadge
                  key={followupType.id}
                  name={followupType.name}
                />
              ))}
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

const FollowupTypeBadge = ({ name }: { name: string }) => (
  <div className="fr-tag">{name}</div>
)

export default StructurePage
