'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Options } from '@mss/web/utils/options'
import { trpc } from '@mss/web/trpc'
import { useRouter } from 'next/navigation'
import { withTrpc } from '@mss/web/withTrpc'
import { Routes } from '@mss/web/app/routing/routes'
import { MutationInput } from '@mss/web/features/createMutation.client'
import { AddBeneficiaryWithGeneralInfoClient } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithGeneralInfo.client'
import { AddBeneficiaryWithFullDataClient } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithFullData.client'
import { useEffect, useRef } from 'react'
import { FormButton, FormError } from '../Form'
import { BeneficiaryFormFields } from './BeneficiaryFormFields'
import { showErrorsOnSubmit } from './showErrorsOnSubmit'

/**
 * This forms permits creation of beneficiaries, with full or general info
 */
export const BeneficiaryFormCreation = withTrpc(
  (
    properties: { agents: Options } & {
      full: boolean
      defaultInput: { structureId: string }
    },
  ) => {
    const router = useRouter()

    // Hooks can not be called conditionnaly by convention, no performance impact
    const addWithGeneralInfo = trpc.beneficiary.addWithGeneralInfo.useMutation()
    const addWithFullData = trpc.beneficiary.addWithFullData.useMutation()

    const mutation = properties.full ? addWithFullData : addWithGeneralInfo

    const client = properties.full
      ? AddBeneficiaryWithFullDataClient
      : AddBeneficiaryWithGeneralInfoClient

    const { agents } = properties

    const defaultValues = properties.defaultInput

    const form = useForm<MutationInput<typeof client>>({
      resolver: zodResolver(client.inputValidation),
      defaultValues,
    })

    const { handleSubmit, control } = form

    const onSubmit = async (data: MutationInput<typeof client>) => {
      try {
        const result = await mutation.mutateAsync(data as any) // Sorry TS gods
        router.push(
          Routes.Beneficiaires.Beneficiaire.Index.path(result.beneficiary),
        )
      } catch {
        // Error message will be in hook result
      }
    }

    // Open sections with errors on submit
    const reference = useRef<HTMLFormElement>(null)
    useEffect(
      () => showErrorsOnSubmit({ form, reference }),
      // This dependency is correctly defined to trigger at each submit
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [form.formState.submitCount],
    )

    const { isLoading, isSuccess } = mutation

    const fieldsDisabled = isLoading || isSuccess

    return (
      <form ref={reference} onSubmit={handleSubmit(onSubmit)}>
        <BeneficiaryFormFields
          disabled={fieldsDisabled}
          control={control}
          agents={agents}
          full={properties.full}
        />

        {mutation.isError ? (
          <FormError message={mutation.error.message} />
        ) : null}

        <FormButton disabled={fieldsDisabled} label="Ajouter le bénéficiaire" />
      </form>
    )
  },
)
