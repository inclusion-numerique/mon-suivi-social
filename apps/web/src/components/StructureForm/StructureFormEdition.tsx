'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { trpc } from '@mss/web/trpc'
import { useRouter } from 'next/navigation'
import { withTrpc } from '@mss/web/withTrpc'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import { groupFollowupTypesByLegality } from '@mss/web/helper/groupFollowupTypes'
import { useMemo, useState } from 'react'
import type { EditStructureServer } from '@mss/web/features/structure/editStructure/editStructure.server'
import type { MutationServerState } from '@mss/web/features/createMutation.server'
import type { MutationInput } from '@mss/web/features/createMutation.client'
import { EditStructureClient } from '@mss/web/features/structure/editStructure/editStructure.client'
import { StructureFormFields } from './StructureFormFields'
import { FormButton, FormError } from '../Form'
import { followupTypeToOption } from './followupTypeToOption'
import { sortFollowupTypes } from './sortFollowupTypes'

export const StructureFormEdition = withTrpc(
  (properties: {
    serverState: Serialized<MutationServerState<EditStructureServer>>
    defaultInput: Serialized<MutationInput<EditStructureClient>>
  }) => {
    const router = useRouter()

    const editStructure = trpc.structure.edit.useMutation()

    const { structure, followupTypes } = deserialize(properties.serverState)

    const defaultValues = deserialize(properties.defaultInput)

    const initiallySelectedFollowupIds = new Set(
      defaultValues.proposedFollowupTypes,
    )

    const form = useForm<MutationInput<EditStructureClient>>({
      resolver: zodResolver(EditStructureClient.inputValidation),
      defaultValues,
    })

    const { handleSubmit, control } = form

    const sortedFollowupTypes = useMemo(
      () =>
        structure === undefined
          ? followupTypes
          : sortFollowupTypes(initiallySelectedFollowupIds, followupTypes),
      // Volontary missing deps to NOT recompute if server state has not changed
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [properties],
    )

    const { legalFollowupTypes, optionalFollowupTypes } =
      groupFollowupTypesByLegality(sortedFollowupTypes)

    const { isLoading, isSuccess, error } = editStructure

    const fieldsDisabled = isLoading || isSuccess

    const [addedFollowupTypes, setAddedFollowupTypes] = useState<
      typeof optionalFollowupTypes
    >([])

    const allOptionalFollowupTypes = [
      ...optionalFollowupTypes,
      ...addedFollowupTypes,
    ]

    const onFollowupTypeCreated = ({
      id,
      name,
    }: {
      id: string
      name: string
    }) => {
      const selected = form.getValues().proposedFollowupTypes
      form.setValue('proposedFollowupTypes', [...selected, id])
      setAddedFollowupTypes([
        ...addedFollowupTypes,
        {
          id,
          name,
          legallyRequired: false,
          _count: {
            helpRequests: 0,
            followups: 0,
          },
        },
      ])
    }

    // TODO better typings for multiple onSubmit add/edit ?
    const onSubmit = async (data: MutationInput<EditStructureClient>) => {
      try {
        await editStructure.mutateAsync(data)

        setAddedFollowupTypes([])
        router.refresh()
      } catch {
        // Error message will be in hook result
      }
    }
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <StructureFormFields
          creation={false}
          control={control}
          disabled={fieldsDisabled}
          legalFollowupTypeOptions={legalFollowupTypes.map(
            followupTypeToOption,
          )}
          allOptionalFollowupTypeOptions={allOptionalFollowupTypes.map(
            followupTypeToOption,
          )}
          structure={structure}
          onFollowupTypeCreated={onFollowupTypeCreated}
        />
        <FormError message={error?.message} />
        <FormButton
          label="Enregistrer la structure"
          disabled={fieldsDisabled}
        />
      </form>
    )
  },
)
