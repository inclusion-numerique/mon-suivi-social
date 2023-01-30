'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputFormField } from '@mss/web/form/InputFormField'
import { trpc } from '@mss/web/trpc'
import { useRouter } from 'next/navigation'
import { withTrpc } from '@mss/web/withTrpc'
import { Routes } from '@mss/web/app/routing/routes'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import { EditStructureFeatureClient } from '@mss/web/features/structure/editStructure/editStructure.client'
import { Option } from '@mss/web/utils/options'
import { TagsFormField } from '@mss/web/form/TagsFormField'
import { groupFollowupTypesByLegality } from '@mss/web/structure/groupFollowupTypes'
import { CreateFollowupTypeFeatureClient } from '@mss/web/features/structure/createFollowupType/createFollowupType.client'
import { CreateFollowupTypeForm } from '@mss/web/app/(private)/structure/[id]/modifier/CreateFollowupTypeForm'
import { useState } from 'react'

const followupTypeToOption = ({
  id,
  name,
  _count: { followups, helpRequests },
}: EditStructureFeatureClient.ServerState['followupTypes'][0]): Option => {
  const usage = helpRequests + followups
  if (usage === 0) {
    return {
      name,
      value: id,
    }
  }
  return {
    name: `${name} (${usage})`,
    value: id,
    disabled: true,
  }
}

export const StructureForm = withTrpc(
  (
    props:
      | {
          creation: true
          // TODO CREATION FEATURE
          serverState: Serialized<EditStructureFeatureClient.ServerState>
        }
      | {
          creation?: false
          serverState: Serialized<EditStructureFeatureClient.ServerState>
        },
  ) => {
    const router = useRouter()

    // Structure edition
    const editStructure = trpc.structure.edit.useMutation()

    const serverState = deserialize(props.serverState)
    const { structure, followupTypes } = serverState

    const defaultValues = props.creation
      ? // TODO
        {}
      : EditStructureFeatureClient.dataFromServerState(serverState)

    const form = useForm<EditStructureFeatureClient.Data>({
      resolver: zodResolver(EditStructureFeatureClient.dataValidation),
      defaultValues,
    })

    const { handleSubmit, control } = form

    const { legalFollowupTypes, optionalFollowupTypes } =
      groupFollowupTypesByLegality(followupTypes)

    const isLoading = editStructure.isLoading

    const fieldsDisabled = isLoading

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
          _count: { followups: 0, helpRequests: 0 },
        },
      ])
    }

    const onSubmit = async (data: EditStructureFeatureClient.Data) => {
      try {
        await editStructure.mutateAsync(data)
        setAddedFollowupTypes([])
        router.refresh()
      } catch (err) {
        // Error message will be in hook result
      }
    }

    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>Informations</h3>
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-4">
              <InputFormField
                label="Raison sociale"
                disabled={fieldsDisabled}
                control={control}
                path="name"
              />
            </div>
            <div className="fr-col-12 fr-col-md-4">
              <InputFormField
                label="Code postal"
                disabled={fieldsDisabled}
                control={control}
                path="zipcode"
              />
            </div>
            <div className="fr-col-12 fr-col-md-4">
              <InputFormField
                label="Ville"
                disabled={fieldsDisabled}
                control={control}
                path="city"
              />
            </div>
          </div>
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-8">
              <InputFormField
                label="Adresse"
                disabled={fieldsDisabled}
                control={control}
                path="address"
              />
            </div>
            <div className="fr-col-12 fr-col-md-4">
              <InputFormField
                label="Téléphone"
                disabled={fieldsDisabled}
                control={control}
                path="phone"
              />
            </div>
          </div>
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-lg-8">
              <InputFormField
                label="Email"
                disabled={fieldsDisabled}
                control={control}
                path="email"
                type="email"
              />
            </div>
          </div>

          <h3 className="fr-mt-8v">Accompagnements proposés</h3>

          <p className="fr-hint-text">
            Les accompagnements déjà associés à une synthèse d&apos;entretien ou
            une instruction de demande d&apos;aide ne peuvent pas être retirés.
          </p>

          <TagsFormField
            control={control}
            label="Accompagnements légaux"
            path="proposedFollowupTypes"
            options={legalFollowupTypes.map(followupTypeToOption)}
          />

          <TagsFormField
            control={control}
            label="Accompagnements facultatifs"
            path="proposedFollowupTypes"
            options={allOptionalFollowupTypes.map(followupTypeToOption)}
          />

          {editStructure.isError ? (
            <p className="fr-error-text">{editStructure.error.message}</p>
          ) : null}

          <div className="fr-grid-row fr-grid-row--center">
            <button className="fr-btn" type="submit" disabled={isLoading}>
              {props.creation
                ? 'Créer la structure'
                : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>

        <CreateFollowupTypeForm
          structure={structure}
          onCreated={onFollowupTypeCreated}
        />
      </>
    )
  },
)
