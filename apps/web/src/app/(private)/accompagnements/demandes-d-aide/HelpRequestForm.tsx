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
import { EditHelpRequestClient } from '@mss/web/features/helpRequest/editHelpRequest.client'
import {
  AddHelpRequestClient,
  externalOrganisationOptions,
  financialSupportOptions,
  helpRequestReasonOptions,
  helpRequestStatusOptions,
  paymentMethodOptions,
} from '@mss/web/features/helpRequest/addHelpRequest.client'
import { SelectFormField } from '@mss/web/form/SelectFormField'
import { SelectTagsFormField } from '@mss/web/form/SelectTagsFormField'
import { CheckboxFormField } from '@mss/web/form/CheckboxFormField'
import { Options } from '@mss/web/utils/options'

const FieldLabels = EditHelpRequestClient.fieldLabels

/**
 * This forms permits creation and edition of helpRequests
 */
export const HelpRequestForm = withTrpc(
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
          synthesisField: boolean
          privateSynthesisField: boolean
          defaultInput: Serialized<MutationInput<EditHelpRequestClient>>
        }
    ),
  ) => {
    const router = useRouter()

    // Hooks can not be called conditionnaly by convention, no performance impact
    const addHelpRequest = trpc.helpRequest.add.useMutation()
    const editHelpRequest = trpc.helpRequest.edit.useMutation()

    const mutation = props.creation
      ? // Creation
        addHelpRequest
      : // Edition
        editHelpRequest

    const client = props.creation
      ? // Creation
        AddHelpRequestClient
      : // Edition
        EditHelpRequestClient

    const defaultValues = props.creation
      ? {
          ...props.defaultInput,
          fullFile: false,
          openingDate: new Date(),
        }
      : deserialize(props.defaultInput)

    const form = useForm<MutationInput<typeof client>>({
      resolver: zodResolver(client.inputValidation),
      defaultValues,
    })

    const { handleSubmit, control } = form

    // TODO Maybe create conditional handlers for strict typing while calling hook ?
    const onSubmit = async (data: MutationInput<typeof client>) => {
      try {
        // TODO Put here dynamic fields that should be removed if another field has a given value
        const result = await mutation.mutateAsync(data as any) // Sorry TS gods
        router.push(
          Routes.Beneficiaires.Beneficiaire.Index.path(
            { fileNumber: result.helpRequest.beneficiary.fileNumber },
            { tab: 'historique', accompagnement: result.helpRequest.id },
          ),
        )
      } catch (err) {
        // Error message will be in hook result
      }
    }

    const financialSupport = form.watch('financialSupport')
    const externalStructure = form.watch('externalStructure')

    const isFinancialSupport = financialSupport === 'true'

    const isInternal = externalStructure === 'false'
    const isExternal = externalStructure === 'true'

    // TODO Field conditions depends on status and other fields
    // TODO use same logic for conditional display to nullify fields on edition

    const { isLoading, isSuccess } = mutation

    const fieldsDisabled = isLoading || isSuccess

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputFormField
          label={FieldLabels['openingDate']}
          disabled={fieldsDisabled}
          control={control}
          path="openingDate"
          type="date"
          valueAsDate
          required
        />
        <SelectFormField
          label={FieldLabels['type']}
          disabled={fieldsDisabled}
          control={control}
          path="type"
          defaultOption
          options={props.followupTypeOptions}
          required
        />
        <InputFormField
          label={FieldLabels['prescribingOrganisation']}
          disabled={fieldsDisabled}
          control={control}
          path="prescribingOrganisation"
        />
        <SelectFormField
          label={FieldLabels['status']}
          disabled={fieldsDisabled}
          control={control}
          path="status"
          defaultOption
          options={helpRequestStatusOptions}
          required
        />
        <CheckboxFormField
          checkboxLabel={FieldLabels['fullFile']}
          control={control}
          path="fullFile"
        />
        <SelectFormField
          label={FieldLabels['financialSupport']}
          disabled={fieldsDisabled}
          control={control}
          path="financialSupport"
          defaultOption
          options={financialSupportOptions}
        />
        {isFinancialSupport ? (
          <SelectFormField
            label={FieldLabels['reason']}
            disabled={fieldsDisabled}
            control={control}
            path="reason"
            defaultOption
            options={helpRequestReasonOptions}
          />
        ) : null}

        <SelectFormField
          label={FieldLabels['externalStructure']}
          disabled={fieldsDisabled}
          control={control}
          path="externalStructure"
          defaultOption
          options={externalOrganisationOptions}
        />

        {isFinancialSupport && isInternal ? (
          <>
            <InputFormField
              label={FieldLabels['askedAmount']}
              disabled={fieldsDisabled}
              control={control}
              path="askedAmount"
              type="number"
              min={0}
            />
            <InputFormField
              label={FieldLabels['examinationDate']}
              disabled={fieldsDisabled}
              control={control}
              path="examinationDate"
              type="date"
              valueAsDate
            />
            <InputFormField
              label={FieldLabels['decisionDate']}
              disabled={fieldsDisabled}
              control={control}
              path="decisionDate"
              type="date"
              valueAsDate
            />
            <InputFormField
              label={FieldLabels['allocatedAmount']}
              disabled={fieldsDisabled}
              control={control}
              path="allocatedAmount"
              type="number"
              min={0}
            />
            <SelectFormField
              label={FieldLabels['paymentMethod']}
              disabled={fieldsDisabled}
              control={control}
              path="paymentMethod"
              defaultOption
              options={paymentMethodOptions}
            />
            <InputFormField
              label={FieldLabels['paymentDate']}
              disabled={fieldsDisabled}
              control={control}
              path="paymentDate"
              type="date"
              valueAsDate
            />
            <InputFormField
              label={FieldLabels['handlingDate']}
              disabled={fieldsDisabled}
              control={control}
              path="handlingDate"
              type="date"
              valueAsDate
            />
            <InputFormField
              label={FieldLabels['decisionDate']}
              disabled={fieldsDisabled}
              control={control}
              path="decisionDate"
              type="date"
              valueAsDate
            />
          </>
        ) : null}

        {!isFinancialSupport && isExternal ? (
          <>
            <InputFormField
              label={FieldLabels['examiningOrganisation']}
              disabled={fieldsDisabled}
              control={control}
              path="examiningOrganisation"
            />
          </>
        ) : null}
        {isFinancialSupport && isExternal ? (
          <>
            <InputFormField
              label={FieldLabels['askedAmount']}
              disabled={fieldsDisabled}
              control={control}
              path="askedAmount"
              type="number"
              min={0}
            />
            <InputFormField
              label={FieldLabels['dispatchDate']}
              disabled={fieldsDisabled}
              control={control}
              path="dispatchDate"
              type="date"
              valueAsDate
            />
            <InputFormField
              label={FieldLabels['decisionDate']}
              disabled={fieldsDisabled}
              control={control}
              path="decisionDate"
              type="date"
              valueAsDate
            />
            <InputFormField
              label={FieldLabels['allocatedAmount']}
              disabled={fieldsDisabled}
              control={control}
              path="allocatedAmount"
              type="number"
              min={0}
            />
            <InputFormField
              label={FieldLabels['handlingDate']}
              disabled={fieldsDisabled}
              control={control}
              path="handlingDate"
              type="date"
              valueAsDate
            />
            <InputFormField
              label={FieldLabels['decisionDate']}
              disabled={fieldsDisabled}
              control={control}
              path="decisionDate"
              type="date"
              valueAsDate
            />
          </>
        ) : null}

        <InputFormField
          label={FieldLabels['dueDate']}
          disabled={fieldsDisabled}
          control={control}
          path="dueDate"
          type="date"
          valueAsDate
        />
        {props.creation || props.synthesisField ? (
          <InputFormField
            label={FieldLabels['synthesis']}
            hint="Il est fortement recommandé de ne stocker que les informations utiles au suivi du bénéficiaire et d'éviter le recueil d'informations sensibles (données de santé, mots de passe, etc)."
            disabled={fieldsDisabled}
            control={control}
            path="synthesis"
            type="textarea"
            minRows={15}
          />
        ) : null}
        {props.creation || props.privateSynthesisField ? (
          <InputFormField
            label={
              <>
                <span className="fr-icon-lock-line fr-mr-1w" />
                {FieldLabels['privateSynthesis']}
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
        <button className="fr-btn" type="submit" disabled={isLoading}>
          Enregistrer l&apos;entretien
        </button>
      </form>
    )
  },
)
