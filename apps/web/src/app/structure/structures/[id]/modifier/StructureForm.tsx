'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputFormField } from '@mss/web/form/InputFormField'
import { trpc } from '@mss/web/trpc'
import { useRouter } from 'next/navigation'
import { withTrpc } from '@mss/web/withTrpc'
import { Routes } from '@mss/web/app/routing/routes'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import { EditStructureFeatureClient } from '@mss/web/features/editStructure/editStructure.client'
import { Option } from '@mss/web/utils/options'
import { TagsFormField } from '@mss/web/form/TagsFormField'
import { groupFollowupTypesByLegality } from '@mss/web/structure/groupFollowupTypes'

const followupTypeToOption = ({
  id,
  name,
  _count: { followups, helpRequests },
}: EditStructureFeatureClient.ExistingState['followupTypes'][0]): Option => {
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
          existingState: Serialized<EditStructureFeatureClient.ExistingState>
        }
      | {
          creation?: false
          existingState: Serialized<EditStructureFeatureClient.ExistingState>
        },
  ) => {
    const router = useRouter()

    const editStructure = trpc.structure.edit.useMutation()

    const existingState = deserialize(props.existingState)
    const { structure, followupTypes } = existingState

    const defaultValues = props.creation
      ? // TODO
        {}
      : EditStructureFeatureClient.dataFromExistingState(existingState)

    const form = useForm<EditStructureFeatureClient.Data>({
      resolver: zodResolver(EditStructureFeatureClient.dataValidation),
      defaultValues,
      reValidateMode: 'onChange',
      mode: 'all',
    })

    const { handleSubmit, control } = form

    const { legalFollowupTypes, optionalFollowupTypes } =
      groupFollowupTypesByLegality(followupTypes)

    const onSubmit = async (data: EditStructureFeatureClient.Data) => {
      try {
        await editStructure.mutateAsync(data)
        router.refresh()
      } catch (err) {
        // Error message will be in hook result
      }
    }

    const isLoading = editStructure.isLoading

    const fieldsDisabled = isLoading

    return (
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
          options={optionalFollowupTypes.map(followupTypeToOption)}
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
    )
  },
)
