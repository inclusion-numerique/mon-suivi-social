'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  SelectFormField,
  InputFormField,
  CheckboxFormField,
} from '@mss/web/components/FormField'
import { trpc } from '@mss/web/trpc'
import { useRouter } from 'next/navigation'
import { withTrpc } from '@mss/web/withTrpc'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import type { MutationServerState } from '@mss/web/features/createMutation.server'
import type { MutationInput } from '@mss/web/features/createMutation.client'
import { EditUserServer } from '@mss/web/features/user/editUser/editUser.server'
import { EditUserClient } from '@mss/web/features/user/editUser/editUser.client'
import { Routes } from '@mss/web/app/routing/routes'
import {
  CreateUserClient,
  nonAdminUserRoleOptions,
} from '@mss/web/features/user/createUser/createUser.client'

const FieldLabels = EditUserClient.fieldLabels

export const UserForm = withTrpc(
  (
    properties:
      | {
          creation: true
          defaultInput: { structureId: string }
        }
      | {
          creation?: false
          serverState: Serialized<MutationServerState<EditUserServer>>
          defaultInput: Serialized<MutationInput<EditUserClient>>
        },
  ) => {
    const router = useRouter()

    const addUser = trpc.user.add.useMutation()
    const editUser = trpc.user.edit.useMutation()

    const defaultValues = properties.creation
      ? properties.defaultInput
      : deserialize(properties.defaultInput)

    const form = useForm<
      MutationInput<CreateUserClient> | MutationInput<EditUserClient>
    >({
      resolver: zodResolver(
        properties.creation
          ? CreateUserClient.inputValidation
          : EditUserClient.inputValidation,
      ),
      defaultValues,
    })

    const { handleSubmit, control } = form

    const isLoading = editUser.isLoading || addUser.isLoading
    const isSuccess = editUser.isSuccess || addUser.isSuccess
    const error = editUser.error || addUser.error
    const isError = !!error

    const fieldsDisabled = isLoading || isSuccess

    // TODO better typings for multiple onSubmit add/edit ?
    const onSubmit = async (
      data: MutationInput<CreateUserClient> | MutationInput<EditUserClient>,
    ) => {
      try {
        properties.creation
          ? await addUser.mutateAsync(data as MutationInput<CreateUserClient>)
          : await editUser.mutateAsync(data as MutationInput<EditUserClient>)

        router.push(Routes.Utilisateurs.Index.path)
      } catch {
        // Error message will be in hook result
      }
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Informations</h3>
        <InputFormField
          label={FieldLabels.firstName}
          disabled={fieldsDisabled}
          control={control}
          path="firstName"
          required
        />
        <InputFormField
          label={FieldLabels.lastName}
          disabled={fieldsDisabled}
          control={control}
          path="lastName"
          required
        />
        <InputFormField
          label={FieldLabels.email}
          disabled={fieldsDisabled}
          control={control}
          path="email"
          required
        />
        <SelectFormField
          label={FieldLabels.role}
          disabled={fieldsDisabled}
          control={control}
          path="role"
          defaultOption
          required
          options={nonAdminUserRoleOptions}
        />
        {properties.creation ? null : (
          <CheckboxFormField
            control={control}
            label={FieldLabels.enabled}
            checkboxLabel="Activé"
            path="enabled"
            disabled={isLoading}
          />
        )}

        {isError ? <p className="fr-error-text">{error.message}</p> : null}

        <div className="fr-grid-row fr-mt-12v">
          <div className="fr-col-12">
            <div className="fr-btns-group--inline fr-btns-group">
              <button
                className="fr-btn"
                type="submit"
                disabled={fieldsDisabled}
              >
                {properties.creation
                  ? "Ajouter l'utilisateur"
                  : 'Enregistrer les modifications'}
              </button>
            </div>
          </div>
        </div>
      </form>
    )
  },
)
