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
import { useMemo, useState } from 'react'
import type { EditStructureServer } from '@mss/web/features/structure/editStructure/editStructure.server'
import type { MutationServerState } from '@mss/web/features/createMutation.server'
import type { MutationInput } from '@mss/web/features/createMutation.client'
import { EditStructureClient } from '@mss/web/features/structure/editStructure/editStructure.client'
import type { FollowupTypesForStructureCreation } from '@mss/web/features/structure/createStructure/createStructure.server'
import { SelectFormField } from '@mss/web/form/SelectFormField'
import {
  CreateStructureClient,
  structureTypeOptions,
} from '@mss/web/features/structure/createStructure/createStructure.client'
import { CreateFollowupTypeForm } from '@mss/web/app/(private)/structure/CreateFollowupTypeForm'

const followupTypeToOption = (
  followupType:
    | MutationServerState<EditStructureServer>['followupTypes'][number]
    | FollowupTypesForStructureCreation[number],
): Option => {
  const { id, name } = followupType
  const usage =
    '_count' in followupType
      ? followupType._count.helpRequests + followupType._count.followups
      : 0

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

const FieldLabels = CreateStructureClient.fieldLabels

export const StructureForm = withTrpc(
  (
    props:
      | {
          creation: true
          availableFollowupTypes: Serialized<FollowupTypesForStructureCreation>
        }
      | {
          creation?: false
          serverState: Serialized<MutationServerState<EditStructureServer>>
          defaultInput: Serialized<MutationInput<EditStructureClient>>
        },
  ) => {
    const router = useRouter()

    const addStructure = trpc.structure.add.useMutation()
    const editStructure = trpc.structure.edit.useMutation()

    const { structure, followupTypes } = props.creation
      ? {
          structure: undefined,
          followupTypes: deserialize(props.availableFollowupTypes),
        }
      : deserialize(props.serverState)

    const defaultValues = props.creation
      ? { proposedFollowupTypes: [] }
      : deserialize(props.defaultInput)

    const initiallySelectedFollowupIds = new Set(
      defaultValues.proposedFollowupTypes,
    )

    const form = useForm<
      MutationInput<CreateStructureClient> | MutationInput<EditStructureClient>
    >({
      resolver: zodResolver(
        props.creation
          ? CreateStructureClient.inputValidation
          : EditStructureClient.inputValidation,
      ),
      defaultValues,
    })

    const { handleSubmit, control } = form

    const sortedFollowupTypes = useMemo(
      () =>
        structure === undefined
          ? followupTypes
          : sortFollowupTypes(initiallySelectedFollowupIds, followupTypes),
      // Volontary missing deps to not recompute if server state has not changed
      [props],
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
        },
      ])
    }

    // TODO better typings for multiple onSubmit add/edit ?
    const onSubmit = async (
      data:
        | MutationInput<CreateStructureClient>
        | MutationInput<EditStructureClient>,
    ) => {
      try {
        props.creation
          ? await addStructure.mutateAsync(
              data as MutationInput<CreateStructureClient>,
            )
          : await editStructure.mutateAsync(
              data as MutationInput<EditStructureClient>,
            )

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
          {props.creation ? (
            <SelectFormField
              label={FieldLabels['type']}
              disabled={fieldsDisabled}
              control={control}
              path="type"
              options={structureTypeOptions}
              defaultOption
              required
            />
          ) : null}
          <InputFormField
            label={FieldLabels['name']}
            disabled={fieldsDisabled}
            control={control}
            path="name"
            required
          />
          <InputFormField
            label={FieldLabels['address']}
            disabled={fieldsDisabled}
            control={control}
            path="address"
            required
          />
          <InputFormField
            label={FieldLabels['zipcode']}
            disabled={fieldsDisabled}
            control={control}
            path="zipcode"
            required
          />
          <InputFormField
            label={FieldLabels['city']}
            disabled={fieldsDisabled}
            control={control}
            path="city"
            required
          />
          <InputFormField
            label={FieldLabels['phone']}
            disabled={fieldsDisabled}
            control={control}
            path="phone"
            required
          />
          <InputFormField
            label={FieldLabels['email']}
            disabled={fieldsDisabled}
            control={control}
            path="email"
            type="email"
            required
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
          {/*Only possible to create owned followup types when structure has been created*/}
          {structure ? (
            <CreateFollowupTypeForm
              structure={structure}
              onCreated={onFollowupTypeCreated}
            />
          ) : null}
          {editStructure.isError ? (
            <p className="fr-error-text">{editStructure.error.message}</p>
          ) : null}

          <div className="fr-grid-row fr-mt-12v">
            <div className="fr-col-12">
              <div className="fr-btns-group--inline fr-btns-group">
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
