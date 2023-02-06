'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputFormField } from '@mss/web/form/InputFormField'
import { trpc } from '@mss/web/trpc'
import { useRouter } from 'next/navigation'
import { withTrpc } from '@mss/web/withTrpc'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import { Option } from '@mss/web/utils/options'
import { TagsFormField } from '@mss/web/form/TagsFormField'
import { groupFollowupTypesByLegality } from '@mss/web/structure/groupFollowupTypes'
import { CreateFollowupTypeForm } from '@mss/web/app/(private)/structure/[id]/modifier/CreateFollowupTypeForm'
import { useMemo, useState } from 'react'
import { EditStructureServer } from '@mss/web/features/structure/editStructure/editStructure.server'
import {
  MutationInput,
  MutationServerState,
} from '@mss/web/features/createMutation'
import { EditStructureClient } from '@mss/web/features/structure/editStructure/editStructure.client'

const followupTypeToOption = ({
  id,
  name,
  _count: { followups, helpRequests },
}: MutationServerState<EditStructureServer>['followupTypes'][number]): Option => {
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

const scoreFollowupTypeForSorting = (
  initialValues: Set<string>,
  followupType: MutationServerState<EditStructureServer>['followupTypes'][number],
): number => {
  if (followupType._count.helpRequests + followupType._count.followups > 0) {
    return 2
  }

  if (initialValues.has(followupType.id)) {
    return 1
  }

  return 0
}

const sortFollowupTypes = (
  initialValues: Set<string>,
  followupTypes: MutationServerState<EditStructureServer>['followupTypes'],
): MutationServerState<EditStructureServer>['followupTypes'] => {
  return followupTypes.sort(
    (a, b) =>
      scoreFollowupTypeForSorting(initialValues, b) -
      scoreFollowupTypeForSorting(initialValues, a),
  )
}

export const StructureForm = withTrpc(
  (
    props:
      | {
          creation: true
          // TODO CREATION FEATURE
          serverState: Serialized<MutationServerState<EditStructureServer>>
        }
      | {
          creation?: false
          serverState: Serialized<MutationServerState<EditStructureServer>>
        },
  ) => {
    const router = useRouter()

    // Structure edition
    const editStructure = trpc.structure.edit.useMutation()

    const serverState = deserialize(props.serverState)
    const { structure, followupTypes } = serverState

    const defaultValues = props.creation
      ? // TODO
        { proposedFollowupTypes: [] }
      : EditStructureServer.dataFromServerState(serverState)

    const initiallySelectedFollowupIds = new Set(
      defaultValues.proposedFollowupTypes,
    )

    const form = useForm<MutationInput<EditStructureClient>>({
      resolver: zodResolver(EditStructureClient.inputValidation),
      defaultValues,
    })

    const { handleSubmit, control } = form

    const sortedFollowupTypes = useMemo(
      () => sortFollowupTypes(initiallySelectedFollowupIds, followupTypes),
      // Volontary missing deps to not recompute if server state has not changed
      [props.serverState],
    )

    const { legalFollowupTypes, optionalFollowupTypes } =
      groupFollowupTypesByLegality(sortedFollowupTypes)

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

    const onSubmit = async (data: MutationInput<EditStructureClient>) => {
      try {
        await editStructure.mutateAsync(data)
        setAddedFollowupTypes([])
        router.refresh()
      } catch (err) {
        // Error message will be in hook result
      }
    }

    const onCancel = () => {
      form.reset(defaultValues)
    }

    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>Informations</h3>
          <InputFormField
            label="Raison sociale"
            disabled={fieldsDisabled}
            control={control}
            path="name"
          />
          <InputFormField
            label="Adresse"
            disabled={fieldsDisabled}
            control={control}
            path="address"
          />
          <InputFormField
            label="Code postal"
            disabled={fieldsDisabled}
            control={control}
            path="zipcode"
          />
          <InputFormField
            label="Ville"
            disabled={fieldsDisabled}
            control={control}
            path="city"
          />
          <InputFormField
            label="Téléphone"
            disabled={fieldsDisabled}
            control={control}
            path="phone"
          />
          <InputFormField
            label="Email"
            disabled={fieldsDisabled}
            control={control}
            path="email"
            type="email"
          />

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
          <CreateFollowupTypeForm
            structure={structure}
            onCreated={onFollowupTypeCreated}
          />

          {editStructure.isError ? (
            <p className="fr-error-text">{editStructure.error.message}</p>
          ) : null}

          <div className="fr-grid-row fr-mt-12v">
            <div className="fr-col-12">
              <div className="fr-btns-group--inline fr-btns-group">
                <button
                  className="fr-btn fr-btn--secondary"
                  type="button"
                  disabled={isLoading}
                  onClick={onCancel}
                >
                  Annuler les modifications
                </button>
                <button className="fr-btn" type="submit" disabled={isLoading}>
                  {props.creation
                    ? 'Créer la structure'
                    : 'Enregistrer les modifications'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </>
    )
  },
)
