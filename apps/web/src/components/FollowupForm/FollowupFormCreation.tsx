'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@mss/web/trpc'
import { useRouter } from 'next/navigation'
import { withTrpc } from '@mss/web/withTrpc'
import { Routes } from '@mss/web/app/routing/routes'
import { MutationInput } from '@mss/web/features/createMutation.client'
import { AddFollowupClient } from '@mss/web/features/followup/addFollowup.client'
import { Options } from '@mss/web/utils/options'
import { FollowupFormFields } from './FollowupFormFields'
import { FormButton, FormError } from '../Form'

/**
 * This forms permits creation and edition of followups
 */
export const FollowupFormCreation = withTrpc(
  (properties: {
    documentOptions: Options
    followupTypeOptions: Options
    defaultInput: { beneficiaryId: string }
  }) => {
    const router = useRouter()

    const mutation = trpc.followup.add.useMutation()

    const client = AddFollowupClient

    const defaultValues = { ...properties.defaultInput, date: new Date() }

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
