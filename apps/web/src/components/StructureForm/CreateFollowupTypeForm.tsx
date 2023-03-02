'use client'

import { trpc } from '@mss/web/trpc'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputFormField } from '@mss/web/form/InputFormField'
import { useState } from 'react'
import { CreateFollowupTypeClient } from '@mss/web/features/structure/createFollowupType/createFollowupType.client'
import { MutationInput } from '@mss/web/features/createMutation.client'

export function CreateFollowupTypeForm({
  structure: { id: structureId },
  onCreated,
}: {
  structure: { id: string }
  onCreated: (createdFollowupType: {
    id: string
    name: string
  }) => void | Promise<void>
}) {
  const createFollowupType = trpc.structure.createFollowupType.useMutation()
  const defaultValues = { structureId }

  const form = useForm<MutationInput<CreateFollowupTypeClient>>({
    resolver: zodResolver(CreateFollowupTypeClient.inputValidation),
    defaultValues,
  })

  const { handleSubmit, control } = form

  const onSubmit = async (data: MutationInput<CreateFollowupTypeClient>) => {
    try {
      const { followupType } = await createFollowupType.mutateAsync(data)
      form.reset(defaultValues)
      onCreated(followupType)
    } catch {
      // Error message will be in hook result
    }
  }

  const {isLoading} = createFollowupType

  const fieldsDisabled = isLoading

  const [isDisplayed, setIsDisplayed] = useState(false)

  const submitHandler = handleSubmit(onSubmit)

  if (isDisplayed) {
    return (
      <form onSubmit={submitHandler}>
        <div className="fr-grid-row fr-grid-row--bottom fr-grid-row--gutters fr-mt-8v">
          <div className="fr-col12 fr-col-md-8">
            <InputFormField
              disabled={fieldsDisabled}
              control={control}
              path="name"
              label="Créer un nouveau type d'accompagnement"
            />
          </div>
          <div className="fr-col-12 fr-col-md-4">
            <button
              type="submit"
              className="fr-btn fr-btn--tertiary fr-btn--icon-left fr-icon-add-line"
              disabled={fieldsDisabled}
              onClick={submitHandler}
            >
              Créer
            </button>
          </div>
        </div>
      </form>
    )
  }

  return (
    <>
      <p className="fr-hint-text fr-mt-8v">
        Aucun accompagnement ne correspond ?
      </p>
      <button
        onClick={() => {
          setIsDisplayed(true)
        }}
        className="fr-btn fr-btn--sm fr-btn--tertiary fr-btn--icon-left fr-icon-add-line"
      >
        Créer un nouveau type d&apos;accompagnement
      </button>
    </>
  )
}
