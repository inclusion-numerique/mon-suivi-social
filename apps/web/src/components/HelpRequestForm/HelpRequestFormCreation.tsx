'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@mss/web/trpc'
import { useRouter } from 'next/navigation'
import { withTrpc } from '@mss/web/withTrpc'
import { Routes } from '@mss/web/app/routing/routes'
import { MutationInput } from '@mss/web/features/createMutation.client'
import { AddHelpRequestClient } from '@mss/web/features/helpRequest/addHelpRequest.client'
import { Options } from '@mss/web/utils/options'
import { FormButton, FormError } from '../Form'
import { HelpRequestFormFields } from './HelpRequestFormFields'

/**
 * This forms permits creation and edition of helpRequests
 */
export const HelpRequestFormCreation = withTrpc(
  (properties: {
    documentOptions: Options
    followupTypeOptions: Options
    defaultInput: { beneficiaryId: string }
  }) => {
    const router = useRouter()

    const addHelpRequest = trpc.helpRequest.add.useMutation()

    const mutation = addHelpRequest

    const client = AddHelpRequestClient

    const defaultValues = {
      ...properties.defaultInput,
      fullFile: false,
      openingDate: new Date(),
    }

    const form = useForm<MutationInput<typeof client>>({
      resolver: zodResolver(client.inputValidation),
      defaultValues,
    })

    const { handleSubmit, control } = form

    // TODO Maybe create conditional handlers for strict typing while calling hook ?
    const onSubmit = async (data: MutationInput<typeof client>) => {
      try {
        // TODO Put here dynamic fields that should be removed if another field has a given value
        const result = await mutation.mutateAsync(data) // Sorry TS gods
        router.push(
          Routes.Beneficiaires.Beneficiaire.Index.path(
            { fileNumber: result.helpRequest.beneficiary.fileNumber },
            { tab: 'historique', accompagnement: result.helpRequest.id },
          ),
        )
      } catch {
        // Error message will be in hook result
      }
    }

    const financialSupport = form.watch('financialSupport')
    const externalStructure = form.watch('externalStructure')

    const isFinancialSupport = financialSupport === 'true'

    const isInternal = externalStructure === 'false'
    const isExternal = externalStructure === 'true'

    // TODO Field conditions depends on status and other fields
    // TODO use same logic for conditional display to nullify fields on edition

    const { isLoading, isSuccess, error } = mutation

    const fieldsDisabled = isLoading || isSuccess

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <HelpRequestFormFields
          disabled={fieldsDisabled}
          control={control}
          documentOptions={properties.documentOptions}
          followupTypeOptions={properties.followupTypeOptions}
          displaySynthesis
          displayPrivateSynthesis
          isFinancialSupport={isFinancialSupport}
          isInternal={isInternal}
          isExternal={isExternal}
        />
        <FormError message={error?.message} />
        <FormButton label="Enregistrer l'entretien" disabled={fieldsDisabled} />
      </form>
    )
  },
)
