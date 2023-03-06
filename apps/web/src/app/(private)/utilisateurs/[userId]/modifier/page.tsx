import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { PageConfig, PageTitle } from '@mss/web/components/PageTitle'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { serialize } from '@mss/web/utils/serialization'
import { notFound } from 'next/navigation'
import { EditUserClient } from '@mss/web/features/user/editUser/editUser.client'
import { EditUserServer } from '@mss/web/features/user/editUser/editUser.server'
import { UserForm } from '@mss/web/components/UserForm'
import { MutationLog } from '@mss/web/components/MutationLog'

export const revalidate = 0

const UserEditPage = async ({
  params: { userId },
}: {
  params: RoutePathParams<typeof Routes.Utilisateurs.Modifier.path>
}) => {
  const user = await getAuthenticatedAgent()

  // User to edit
  const serverState = await EditUserServer.getServerState({
    userId,
  })

  const { structureId } = serverState

  if (
    !structureId ||
    !EditUserClient.securityCheck(user, { structureId }, {})
  ) {
    notFound()
    return null
  }

  const defaultInput = EditUserServer.dataFromServerState(serverState)

  const page: PageConfig = {
    ...Routes.Utilisateurs.Modifier,
    title: Routes.Utilisateurs.Modifier.title(serverState),
  }

  return (
    <>
      <PageTitle page={page} parents={[Routes.Utilisateurs.Index]} />
      <div className="fr-grid-row fr-grid-row--center fr-pb-8v">
        <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
          <div className="fr-card">
            <div className="fr-card__body fr-py-8v">
              <UserForm
                serverState={serialize(serverState)}
                defaultInput={serialize(defaultInput)}
              />
            </div>
          </div>
        </div>
      </div>
      <MutationLog targetStructureId={structureId} targetUserId={userId} />
    </>
  )
}
export default UserEditPage
