'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputFormField } from '@mss/web/form/InputFormField'
import { trpc } from '@mss/web/trpc'
import { useRouter } from 'next/navigation'
import { withTrpc } from '@mss/web/withTrpc'
import { Routes } from '@mss/web/app/routing/routes'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import { MutationInput } from '@mss/web/features/createMutation.client'
import { EditFollowupClient } from '@mss/web/features/followup/editFollowup.client'
import {
  AddFollowupClient,
  followupMediumOptions,
} from '@mss/web/features/followup/addFollowup.client'
import { dateToIsoDay } from '@mss/web/utils/dateToIsoDay'
import { SelectFormField } from '@mss/web/form/SelectFormField'
import { SelectTagsFormField } from '@mss/web/form/SelectTagsFormField'
import { CheckboxFormField } from '@mss/web/form/CheckboxFormField'
import { Options } from '@mss/web/utils/options'

const FieldLabels = EditFollowupClient.fieldLabels

/**
 * This forms permits creation and edition of followups
 */
export const FollowupForm = withTrpc(
  (
    props: {
      documentOptions: Options
      followupTypeOptions: Options
    } & (
      | {
          creation: true
          defaultInput: { beneficiaryId: string }
        }
      | {
          creation?: false
          defaultInput: Serialized<MutationInput<EditFollowupClient>>
        }
    ),
  ) => {
    const router = useRouter()

    // Hooks can not be called conditionnaly by convention, no performance impact
    const addFollowup = trpc.followup.add.useMutation()
    const editFollowup = trpc.followup.edit.useMutation()

    const mutation = props.creation
      ? // Creation
        addFollowup
      : // Edition
        editFollowup

    const client = props.creation
      ? // Creation
        AddFollowupClient
      : // Edition
        EditFollowupClient

    const defaultValues = props.creation
      ? { ...props.defaultInput, date: dateToIsoDay(new Date()) }
      : deserialize(props.defaultInput)

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
      } catch (err) {
        // Error message will be in hook result
      }
    }

    const { isLoading } = mutation

    const fieldsDisabled = isLoading

    const medium = form.watch('medium')

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputFormField
          label={FieldLabels['date']}
          disabled={fieldsDisabled}
          control={control}
          path="date"
          type="date"
        />
        <SelectFormField
          label={FieldLabels['medium']}
          disabled={fieldsDisabled}
          control={control}
          path="medium"
          defaultOption
          options={followupMediumOptions}
        />
        {medium === 'ThirdParty' ? (
          <InputFormField
            label={FieldLabels['thirdPersonName']}
            disabled={fieldsDisabled}
            control={control}
            path="thirdPersonName"
          />
        ) : null}
        {medium === 'ExternalAppointment' ? (
          <InputFormField
            label={FieldLabels['place']}
            disabled={fieldsDisabled}
            control={control}
            path="place"
          />
        ) : null}
        <SelectTagsFormField
          label={FieldLabels['types']}
          disabled={fieldsDisabled}
          options={props.followupTypeOptions}
          control={control}
          defaultOptionLabel="Choisissez un accompagnement"
          defaultOption
          path="types"
        />
        <InputFormField
          label={FieldLabels['structureName']}
          disabled={fieldsDisabled}
          control={control}
          path="structureName"
        />
        <InputFormField
          label={FieldLabels['dueDate']}
          disabled={fieldsDisabled}
          control={control}
          path="dueDate"
          type="date"
        />
        <InputFormField
          label={FieldLabels['syntesis']}
          hint="Il est fortement recommandé de ne stocker que les informations utiles au suivi du bénéficiaire et d'éviter le recueil d'informations sensibles (données de santé, mots de passe, etc)."
          disabled={fieldsDisabled}
          control={control}
          path="syntesis"
          type="textarea"
          minRows={15}
        />
        <InputFormField
          label={FieldLabels['privateSynthesis']}
          hint="Le compte rendu privé est uniquement visible et modifiable par l'agent qui crée la synthèse d'entretien."
          disabled={fieldsDisabled}
          control={control}
          path="privateSynthesis"
          type="textarea"
          minRows={4}
        />
        <CheckboxFormField
          checkboxLabel={FieldLabels['redirected']}
          control={control}
          path="redirected"
        />
        <CheckboxFormField
          checkboxLabel={FieldLabels['helpRequested']}
          control={control}
          path="helpRequested"
        />
        <SelectTagsFormField
          label={FieldLabels['documents']}
          disabled={fieldsDisabled}
          options={props.documentOptions}
          control={control}
          defaultOptionLabel="Associez un document"
          defaultOption
          path="documents"
        />
        {mutation.isError ? (
          <p className="fr-error-text">{mutation.error.message}</p>
        ) : null}
        <div className="fr-grid-row fr-grid-row--center">
          <button className="fr-btn" type="submit" disabled={isLoading}>
            Enregistrer l&apos;entretien
          </button>
        </div>
      </form>
    )
  },
)
