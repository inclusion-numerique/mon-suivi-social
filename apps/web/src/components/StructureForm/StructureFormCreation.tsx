'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { trpc } from '@mss/web/trpc'
import { useRouter } from 'next/navigation'
import { withTrpc } from '@mss/web/withTrpc'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import { groupFollowupTypesByLegality } from '@mss/web/helper/groupFollowupTypes'
import { useState } from 'react'
import type { MutationInput } from '@mss/web/features/createMutation.client'
import type { FollowupTypesForStructureCreation } from '@mss/web/features/structure/createStructure/createStructure.server'
import { CreateStructureClient } from '@mss/web/features/structure/createStructure/createStructure.client'
import { FormButton, FormError } from '../Form'
import { StructureFormFields } from './StructureFormFields'
import { followupTypeToOption } from './followupTypeToOption'

export const StructureFormCreation = withTrpc(
  (properties: {
    availableFollowupTypes: Serialized<FollowupTypesForStructureCreation>
  }) => {
    const router = useRouter()

    const addStructure = trpc.structure.add.useMutation()
    const sortedFollowupTypes = deserialize(properties.availableFollowupTypes)

    const defaultValues = { proposedFollowupTypes: [] }

    const form = useForm<MutationInput<CreateStructureClient>>({
      resolver: zodResolver(CreateStructureClient.inputValidation),
      defaultValues,
    })

    const { handleSubmit, control } = form

    const { legalFollowupTypes, optionalFollowupTypes } =
      groupFollowupTypesByLegality(sortedFollowupTypes)

    const { isLoading, isSuccess, error } = addStructure

    const fieldsDisabled = isLoading || isSuccess

    // TODO better typings for multiple onSubmit add/edit ?
    const onSubmit = async (data: MutationInput<CreateStructureClient>) => {
      try {
        await addStructure.mutateAsync(data)
        router.refresh()
      } catch {
        // Error message will be in hook result
      }
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <StructureFormFields
          creation
          control={control}
          disabled={fieldsDisabled}
          legalFollowupTypeOptions={legalFollowupTypes.map(
            followupTypeToOption,
          )}
          allOptionalFollowupTypeOptions={optionalFollowupTypes.map(
            followupTypeToOption,
          )}
        />
        <FormError message={error?.message} />
        <FormButton label="Créer la structure" disabled={fieldsDisabled} />
      </form>
    )
  },
)
