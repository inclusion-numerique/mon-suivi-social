'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@mss/web/trpc'
import { useRouter } from 'next/navigation'
import { withTrpc } from '@mss/web/withTrpc'
import type { MutationInput } from '@mss/web/features/createMutation.client'
import { Routes } from '@mss/web/app/routing/routes'
import { UserFormFields } from './UserFormFields'
import { CreateUserClient } from '@mss/web/features/user/createUser/createUser.client'
import { FormButton, FormError } from '../Form'

export const UserFormCreation = withTrpc(
  (properties: { defaultInput: { structureId: string } }) => {
    const router = useRouter()

    const addUser = trpc.user.add.useMutation()

    const defaultValues = properties.defaultInput

    const form = useForm<MutationInput<CreateUserClient>>({
      resolver: zodResolver(CreateUserClient.inputValidation),
      defaultValues,
    })

    const { handleSubmit, control } = form

    const { isLoading, isSuccess, error } = addUser
    const isError = !!error

    const fieldsDisabled = isLoading || isSuccess

    const onSubmit = async (data: MutationInput<CreateUserClient>) => {
      try {
        await addUser.mutateAsync(data)

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

        <FormButton disabled={fieldsDisabled} label={`Ajouter l'utilisateur`} />
      </form>
    )
  },
)
