'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Options } from '@mss/web/utils/options'
import { trpc } from '@mss/web/trpc'
import { useRouter } from 'next/navigation'
import { withTrpc } from '@mss/web/components/TrpcProvider'
import { Routes } from '@mss/web/app/routing/routes'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import { EditBeneficiaryGeneralInfoClient } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryGeneralInfo.client'
import { MutationInput } from '@mss/web/features/createMutation.client'
import { EditBeneficiaryFullDataClient } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryFullData.client'
import { useEffect, useRef } from 'react'
import { BeneficiaryFormFields } from './BeneficiaryFormFields'
import { FormButton, FormError } from '../Form'
import { showErrorsOnSubmit } from './showErrorsOnSubmit'

/**
 * This forms permits edition of beneficiaries, with full or general info
 */
export const BeneficiaryFormEdition = withTrpc(
  (
    properties: { agents: Options } & (
      | {
          full: false
          defaultInput: Serialized<
            MutationInput<EditBeneficiaryGeneralInfoClient>
          >
        }
      | {
          full: true
          defaultInput: Serialized<MutationInput<EditBeneficiaryFullDataClient>>
        }
    ),
  ) => {
    const router = useRouter()

    // Hooks can not be called conditionnaly by convention, no performance impact
    const editGeneralInfo = trpc.beneficiary.editGeneralInfo.useMutation()
    const editFullData = trpc.beneficiary.editFullData.useMutation()

    const mutation = properties.full ? editFullData : editGeneralInfo

    const client = properties.full
      ? EditBeneficiaryFullDataClient
      : EditBeneficiaryGeneralInfoClient

    const { agents } = properties

    const defaultValues = properties.full
      ? deserialize(properties.defaultInput)
      : deserialize(properties.defaultInput)

    const form = useForm<MutationInput<typeof client>>({
      resolver: zodResolver(client.inputValidation),
      defaultValues,
    })

    const { handleSubmit, control } = form

    // TODO Maybe create conditional handlers for strict typing while calling hook ?
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

    const { isLoading, isSuccess, error } = mutation

    const fieldsDisabled = isLoading || isSuccess

    return (
      <form ref={reference} onSubmit={handleSubmit(onSubmit)}>
        <BeneficiaryFormFields
          disabled={fieldsDisabled}
          control={control}
          agents={agents}
          full={properties.full}
        />

        <FormError message={error?.message} />

        <FormButton
          disabled={fieldsDisabled}
          label="Enregistrer le bénéficiaire"
        />
      </form>
    )
  },
)
