'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@mss/web/trpc'
import { useRouter } from 'next/navigation'
import { withTrpc } from '@mss/web/withTrpc'
import { Routes } from '@mss/web/app/routing/routes'
import { MutationInput } from '@mss/web/features/createMutation.client'
import { Options } from '@mss/web/utils/options'
import { FollowupFormFields } from './FollowupFormFields'
import { FormButton, FormError } from '../Form'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import { EditFollowupClient } from '@mss/web/features/followup/editFollowup.client'

/**
 * This forms permits creation and edition of followups
 */
export const FollowupFormEdition = withTrpc(
  (properties: {
    documentOptions: Options
    followupTypeOptions: Options
    synthesisField: boolean
    privateSynthesisField: boolean
    defaultInput: Serialized<MutationInput<EditFollowupClient>>
  }) => {
    const router = useRouter()

    const mutation = trpc.followup.edit.useMutation()

    const client = EditFollowupClient

    const defaultValues = deserialize(properties.defaultInput)

    const form = useForm<MutationInput<typeof client>>({
      resolver: zodResolver(client.inputValidation),
      defaultValues,
    })

    const { handleSubmit, control } = form

    // TODO Maybe create conditional handlers for strict typing while calling hook ?
    const onSubmit = async (data: MutationInput<typeof client>) => {
      try {
        if (data.thirdPersonName && data.medium !== 'ThirdParty') {
          data.thirdPersonName = ''
        }
        if (data.place && data.medium !== 'ExternalAppointment') {
          data.place = ''
        }
        const result = await mutation.mutateAsync(data) // Sorry TS gods
        router.push(
          Routes.Beneficiaires.Beneficiaire.Index.path(
            { fileNumber: result.followup.beneficiary.fileNumber },
            { tab: 'historique', accompagnement: result.followup.id },
          ),
        )
      } catch {
        // Error message will be in hook result
      }
    }

    const { isLoading, isSuccess, error } = mutation

    const fieldsDisabled = isLoading || isSuccess

    const medium = form.watch('medium')
    const isMediumEqual = (value: string) => medium === value

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FollowupFormFields
          disabled={fieldsDisabled}
          control={control}
          documentOptions={properties.documentOptions}
          followupTypeOptions={properties.followupTypeOptions}
          displaySynthesis
          displayPrivateSynthesis
          isMediumEqual={isMediumEqual}
        />
        <FormError message={error?.message} />
        <FormButton label="Enregistrer l'entretien" disabled={fieldsDisabled} />
      </form>
    )
  },
)
