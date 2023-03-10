'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@mss/web/trpc'
import { useRouter } from 'next/navigation'
import { withTrpc } from '@mss/web/withTrpc'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import type { MutationServerState } from '@mss/web/features/createMutation.server'
import type { MutationInput } from '@mss/web/features/createMutation.client'
import { EditUserServer } from '@mss/web/features/user/editUser/editUser.server'
import { EditUserClient } from '@mss/web/features/user/editUser/editUser.client'
import { Routes } from '@mss/web/app/routing/routes'
import { UserFormFields } from './UserFormFields'
import { FormButton, FormError } from '../Form'

export const UserFormEdition = withTrpc(
  (properties: {
    serverState: Serialized<MutationServerState<EditUserServer>>
    defaultInput: Serialized<MutationInput<EditUserClient>>
  }) => {
    const router = useRouter()

    const editUser = trpc.user.edit.useMutation()

    const defaultValues = deserialize(properties.defaultInput)

    const form = useForm<MutationInput<EditUserClient>>({
      resolver: zodResolver(EditUserClient.inputValidation),
      defaultValues,
    })

    const { handleSubmit, control } = form

    const { isLoading, isSuccess, error } = editUser
    const isError = !!error

    const fieldsDisabled = isLoading || isSuccess

    const onSubmit = async (data: MutationInput<EditUserClient>) => {
      try {
        await editUser.mutateAsync(data)
        router.push(Routes.Utilisateurs.Index.path)
      } catch {
        // Error message will be in hook result
      }
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <UserFormFields
          fieldsDisabled={fieldsDisabled}
          control={control}
          creation
        />

        {isError ? <FormError message={error?.message} /> : ''}

        <FormButton
          disabled={fieldsDisabled}
          label={`Enregistrer l'utilisateur`}
        />
      </form>
    )
  },
)
