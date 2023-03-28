'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Options } from '@mss/web/utils/options'
import { trpc } from '@mss/web/trpc'
import { useRouter } from 'next/navigation'
import { withTrpc } from '@mss/web/components/TrpcProvider'
import { Routes } from '@mss/web/app/routing/routes'
import {
  BeneficiaryCreationInput,
  beneficiaryCreationSchema,
} from '@mss/web/schema'
import { FormButton, FormError } from '../Form'
import { BeneficiaryFormCreationFields } from './BeneficiaryFormCreationFields'

/**
 * This forms permits creation of beneficiaries, with full or general info
 */
export const BeneficiaryFormCreation = withTrpc(
  (properties: { agents: Options; structureId: string }) => {
    const router = useRouter()

    const mutation = trpc.beneficiary.create.useMutation()

    const { agents, structureId } = properties

    const form = useForm<BeneficiaryCreationInput>({
      resolver: zodResolver(beneficiaryCreationSchema),
      defaultValues: { structureId },
    })

    const { handleSubmit, control } = form

    const onSubmit = async (data: BeneficiaryCreationInput) => {
      try {
        const result = await mutation.mutateAsync(data as any) // Sorry TS gods
        router.push(
          Routes.Beneficiaires.Beneficiaire.Index.path(result.beneficiary),
        )
      } catch (error_) {
        console.log(error_)
        // Error message will be in hook result
      }
    }

    const { isLoading, isSuccess, error } = mutation

    const fieldsDisabled = isLoading || isSuccess

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <BeneficiaryFormCreationFields
          disabled={fieldsDisabled}
          control={control}
          agents={agents}
        />

        <FormError message={error?.message} />

        <FormButton disabled={fieldsDisabled} label="Ajouter le bénéficiaire" />
      </form>
    )
  },
)
