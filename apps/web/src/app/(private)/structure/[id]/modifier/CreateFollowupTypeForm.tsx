'use client'

import { trpc } from '@mss/web/trpc'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateFollowupTypeFeatureClient } from '@mss/web/features/structure/createFollowupType/createFollowupType.client'
import { InputFormField } from '@mss/web/form/InputFormField'
import { useState } from 'react'

export const CreateFollowupTypeForm = ({
  structure: { id: structureId },
  onCreated,
}: {
  structure: { id: string }
  onCreated: (createdFollowupType: {
    id: string
    name: string
  }) => void | Promise<void>
}) => {
  const createFollowupType = trpc.structure.createFollowupType.useMutation()
  const defaultValues = { structureId }

  const form = useForm<CreateFollowupTypeFeatureClient.Data>({
    resolver: zodResolver(CreateFollowupTypeFeatureClient.dataValidation),
    defaultValues,
  })

  const { handleSubmit, control } = form

  const onSubmit = async (data: CreateFollowupTypeFeatureClient.Data) => {
    try {
      const { followupType } = await createFollowupType.mutateAsync(data)
      form.reset(defaultValues)
      onCreated(followupType)
    } catch (err) {
      // Error message will be in hook result
    }
  }

  const isLoading = createFollowupType.isLoading

  const fieldsDisabled = isLoading

  const [isDisplayed, setIsDisplayed] = useState(false)

  if (isDisplayed) {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
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
      <p className="fr-hint-text">Aucun accompagnement ne correspond ?</p>
      <button
        onClick={() => {
          setIsDisplayed(true)
        }}
        className="fr-btn fr-mt-8v fr-btn--sm fr-btn--tertiary fr-btn--icon-left fr-icon-add-line"
      >
        Créer un nouveau type d&apos;accompagnement
      </button>
    </>
  )
}
