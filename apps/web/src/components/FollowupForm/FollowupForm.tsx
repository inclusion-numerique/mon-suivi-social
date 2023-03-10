'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  InputFormField,
  SelectFormField,
  SelectTagsFormField,
  CheckboxFormField,
} from '@mss/web/components/FormField'
import { trpc } from '@mss/web/trpc'
import { useRouter } from 'next/navigation'
import { withTrpc } from '@mss/web/withTrpc'
import { Routes } from '@mss/web/app/routing/routes'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import { MutationInput } from '@mss/web/features/createMutation.client'
import { EditFollowupClient } from '@mss/web/features/followup/editFollowup.client'
import { AddFollowupClient } from '@mss/web/features/followup/addFollowup.client'
import { Options } from '@mss/web/utils/options'
import {
  followupMediumOptions,
  followupStatusOptions,
} from '@mss/web/constants/followup'

const FieldLabels = EditFollowupClient.fieldLabels

/**
 * This forms permits creation and edition of followups
 */
export const FollowupForm = withTrpc(
  (
    properties: {
      documentOptions: Options
      followupTypeOptions: Options
    } & (
      | {
          creation: true
          defaultInput: { beneficiaryId: string }
        }
      | {
          creation?: false
          synthesisField: boolean
          privateSynthesisField: boolean
          defaultInput: Serialized<MutationInput<EditFollowupClient>>
        }
    ),
  ) => {
    const router = useRouter()

    // Hooks can not be called conditionnaly by convention, no performance impact
    const addFollowup = trpc.followup.add.useMutation()
    const editFollowup = trpc.followup.edit.useMutation()

    const mutation = properties.creation
      ? // Creation
        addFollowup
      : // Edition
        editFollowup

    const client = properties.creation
      ? // Creation
        AddFollowupClient
      : // Edition
        EditFollowupClient

    const defaultValues = properties.creation
      ? { ...properties.defaultInput, date: new Date() }
      : deserialize(properties.defaultInput)

    const form = useForm<MutationInput<typeof client>>({
      resolver: zodResolver(client.inputValidation),
      defaultValues,
    })

    const { handleSubmit, control } = form

    // TODO Maybe create conditional handlers for strict typing while calling hook ?
    const onSubmit = async (data: MutationInput<typeof client>) => {
      try {
        if (data.thirdPersonName && data.medium !== 'ThirdParty') {
          data.thirdPersonName = ''
        }
        if (data.place && data.medium !== 'ExternalAppointment') {
          data.place = ''
        }
        const result = await mutation.mutateAsync(data as any) // Sorry TS gods
        router.push(
          Routes.Beneficiaires.Beneficiaire.Index.path(
            { fileNumber: result.followup.beneficiary.fileNumber },
            { tab: 'historique', accompagnement: result.followup.id },
          ),
        )
      } catch {
        // Error message will be in hook result
      }
    }

    const { isLoading, isSuccess } = mutation

    const fieldsDisabled = isLoading || isSuccess

    const medium = form.watch('medium')

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputFormField
          label={FieldLabels.date}
          disabled={fieldsDisabled}
          control={control}
          path="date"
          type="date"
          valueAsDate
          required
        />
        <SelectFormField
          label={FieldLabels.medium}
          disabled={fieldsDisabled}
          control={control}
          path="medium"
          defaultOption
          required
          options={followupMediumOptions}
        />
        {medium === 'ThirdParty' ? (
          <InputFormField
            label={FieldLabels.thirdPersonName}
            disabled={fieldsDisabled}
            control={control}
            path="thirdPersonName"
          />
        ) : null}
        {medium === 'ExternalAppointment' ? (
          <InputFormField
            label={FieldLabels.place}
            disabled={fieldsDisabled}
            control={control}
            path="place"
          />
        ) : null}
        <SelectTagsFormField
          label={FieldLabels.types}
          disabled={fieldsDisabled}
          options={properties.followupTypeOptions}
          control={control}
          defaultOptionLabel="Choisissez un accompagnement"
          defaultOption
          required
          path="types"
        />
        <InputFormField
          label={FieldLabels.structureName}
          disabled={fieldsDisabled}
          control={control}
          path="structureName"
        />
        <SelectFormField
          label={FieldLabels.status}
          disabled={fieldsDisabled}
          control={control}
          path="status"
          required
          defaultOption
          options={followupStatusOptions}
        />
        <InputFormField
          label={FieldLabels.dueDate}
          disabled={fieldsDisabled}
          control={control}
          path="dueDate"
          type="date"
          valueAsDate
        />
        {properties.creation || properties.synthesisField ? (
          <InputFormField
            label={FieldLabels.synthesis}
            hint="Il est fortement recommandé de ne stocker que les informations utiles au suivi du bénéficiaire et d'éviter le recueil d'informations sensibles (données de santé, mots de passe, etc)."
            disabled={fieldsDisabled}
            control={control}
            path="synthesis"
            type="textarea"
            minRows={15}
          />
        ) : null}
        {properties.creation || properties.privateSynthesisField ? (
          <InputFormField
            label={
              <>
                <span className="fr-icon-lock-line fr-mr-1w" />
                {FieldLabels.privateSynthesis}
              </>
            }
            hint="Le compte rendu privé est uniquement visible et modifiable par l'agent qui crée la synthèse d'entretien."
            disabled={fieldsDisabled}
            control={control}
            path="privateSynthesis"
            type="textarea"
            minRows={4}
          />
        ) : null}
        <CheckboxFormField
          checkboxLabel={FieldLabels.redirected}
          control={control}
          path="redirected"
        />
        <CheckboxFormField
          checkboxLabel={FieldLabels.helpRequested}
          control={control}
          path="helpRequested"
        />
        <SelectTagsFormField
          label={FieldLabels.documents}
          disabled={fieldsDisabled}
          options={properties.documentOptions}
          control={control}
          defaultOptionLabel="Associez un document"
          defaultOption
          path="documents"
        />
        {mutation.isError ? (
          <p className="fr-error-text">{mutation.error.message}</p>
        ) : null}
        <div className="fr-grid-row">
          <button className="fr-btn" type="submit" disabled={isLoading}>
            Enregistrer l&apos;entretien
          </button>
        </div>
      </form>
    )
  },
)
