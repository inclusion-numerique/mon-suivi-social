'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputFormField } from '@mss/web/form/InputFormField'
import {
  beneficiaryAccomodationModeOptions,
  beneficiaryFamilySituationOptions,
  beneficiaryGenderOptions,
  beneficiaryMobilityOptions,
  beneficiaryStatusOptions,
  beneficiaryTitleOptions,
} from '@mss/web/beneficiary/beneficiary'
import { Options } from '@mss/web/utils/options'
import { SelectFormField } from '@mss/web/form/SelectFormField'
import { CheckboxFormField } from '@mss/web/form/CheckboxFormField'
import { trpc } from '@mss/web/trpc'
import { useRouter } from 'next/navigation'
import { withTrpc } from '@mss/web/withTrpc'
import { Routes } from '@mss/web/app/routing/routes'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import { EditBeneficiaryGeneralInfoClient } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryGeneralInfo.client'
import { MutationInput } from '@mss/web/features/createMutation.client'
import { EditBeneficiaryFullDataClient } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryFullData.client'
import { AddBeneficiaryWithGeneralInfoClient } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithGeneralInfo.client'
import { AddBeneficiaryWithFullDataClient } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithFullData.client'
import { SelectTagsFormField } from '@mss/web/form/SelectTagsFormField'
import { nationalityOptions } from '@mss/web/features/beneficiary/nationality'
import { useEffect, useRef } from 'react'

const FieldLabels = EditBeneficiaryFullDataClient.fieldLabels

/**
 * This forms permits creation and edition of beneficiaries, with full or general info
 */
export const BeneficiaryForm = withTrpc(
  (
    props: { agents: Options } & (
      | {
          creation: true
          full: boolean
          defaultInput: { structureId: string }
        }
      | {
          creation?: false
          full: false
          defaultInput: Serialized<
            MutationInput<EditBeneficiaryGeneralInfoClient>
          >
        }
      | {
          creation?: false
          full: true
          defaultInput: Serialized<MutationInput<EditBeneficiaryFullDataClient>>
        }
    ),
  ) => {
    const router = useRouter()

    // Hooks can not be called conditionnaly by convention, no performance impact
    const addWithGeneralInfo = trpc.beneficiary.addWithGeneralInfo.useMutation()
    const addWithFullData = trpc.beneficiary.addWithFullData.useMutation()
    const editGeneralInfo = trpc.beneficiary.editGeneralInfo.useMutation()
    const editFullData = trpc.beneficiary.editFullData.useMutation()

    const mutation = props.creation
      ? // Creation
        props.full
        ? addWithFullData
        : addWithGeneralInfo
      : // Edition
      props.full
      ? editFullData
      : editGeneralInfo

    const client = props.creation
      ? // Creation
        props.full
        ? AddBeneficiaryWithFullDataClient
        : AddBeneficiaryWithGeneralInfoClient
      : // Edition
      props.full
      ? EditBeneficiaryFullDataClient
      : EditBeneficiaryGeneralInfoClient

    const { agents } = props

    const defaultValues = props.creation
      ? props.defaultInput ?? {}
      : props.full
      ? deserialize(props.defaultInput)
      : deserialize(props.defaultInput)

    const form = useForm<MutationInput<typeof client>>({
      resolver: zodResolver(client.inputValidation),
      defaultValues,
    })

    const { handleSubmit, control } = form

    // TODO Maybe create conditional handlers for strict typing while calling hook ?
    const onSubmit = async (data: MutationInput<typeof client>) => {
      try {
        const result = await mutation.mutateAsync(data as any) // Sorry TS gods
        router.push(
          Routes.Structure.Beneficiaires.Beneficiaire.Index.path(
            result.beneficiary,
          ),
        )
      } catch (err) {
        // Error message will be in hook result
      }
    }

    // Open sections with errors on submit
    // TODO create custom hook to cleanup this component
    const ref = useRef<HTMLFormElement>(null)
    useEffect(
      () => {
        if (form.formState.isSubmitted && !form.formState.isValid) {
          // Error callback
          if (!ref.current) {
            return
          }

          // Get form accordion sections
          const sections = ref.current.querySelectorAll('.fr-accordion')
          for (const section of sections) {
            const sectionButton = section.querySelector('.fr-accordion__btn')
            const errors = section.querySelector('.fr-error-text')
            if (!sectionButton || !errors) {
              continue
            }

            sectionButton.setAttribute('aria-expanded', 'true')
          }
        }
      },
      // This dependency is correctly defined to trigger at each submit
      [form.formState.submitCount],
    )

    // TODO before submit is intercepted and after error registrations, or on watch on error keys, expand accordions that contains inputs with an error class
    // TODO It is more robust than to maintain a list of fields and will not break

    const { isLoading } = mutation

    const fieldsDisabled = isLoading

    return (
      <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
        <SelectTagsFormField
          label={FieldLabels['referents']}
          disabled={fieldsDisabled}
          options={agents}
          control={control}
          defaultOptionLabel="Choisissez un référent"
          defaultOption
          path="referents"
        />
        <CheckboxFormField
          checkboxLabel={FieldLabels['aidantConnectAuthorized']}
          disabled={fieldsDisabled}
          control={control}
          path="aidantConnectAuthorized"
        />

        <section className="fr-accordion">
          <h3 className="fr-accordion__title">
            <button
              type="button"
              className="fr-accordion__btn"
              aria-expanded="false"
              aria-controls="beneficiary-form-general"
            >
              Informations générales
            </button>
          </h3>
          <div className="fr-collapse" id="beneficiary-form-general">
            <SelectFormField
              label={FieldLabels['status']}
              path="status"
              disabled={fieldsDisabled}
              control={control}
              options={beneficiaryStatusOptions}
              defaultOption
            />
            <SelectFormField
              label={FieldLabels['title']}
              path="title"
              disabled={fieldsDisabled}
              control={control}
              options={beneficiaryTitleOptions}
              defaultOption
            />
            <InputFormField
              label={FieldLabels['usualName']}
              path="usualName"
              disabled={fieldsDisabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels['birthName']}
              path="birthName"
              disabled={fieldsDisabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels['firstName']}
              path="firstName"
              disabled={fieldsDisabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels['birthDate']}
              path="birthDate"
              type="date"
              disabled={fieldsDisabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels['birthPlace']}
              path="birthPlace"
              disabled={fieldsDisabled}
              control={control}
            />
            <SelectFormField
              label={FieldLabels['gender']}
              path="gender"
              disabled={fieldsDisabled}
              control={control}
              options={beneficiaryGenderOptions}
              defaultOption
            />
            <SelectFormField
              label={FieldLabels['nationality']}
              path="nationality"
              disabled={fieldsDisabled}
              control={control}
              options={nationalityOptions}
              defaultOption
            />
            <SelectFormField
              label={FieldLabels['accomodationMode']}
              path="accomodationMode"
              disabled={fieldsDisabled}
              control={control}
              options={beneficiaryAccomodationModeOptions}
              defaultOption
            />
            <InputFormField
              label={FieldLabels['accomodationAdditionalInformation']}
              path="accomodationAdditionalInformation"
              disabled={fieldsDisabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels['zipcode']}
              path="zipcode"
              disabled={fieldsDisabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels['city']}
              path="city"
              disabled={fieldsDisabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels['region']}
              path="region"
              disabled={fieldsDisabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels['streetNumber']}
              path="streetNumber"
              disabled={fieldsDisabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels['street']}
              path="street"
              disabled={fieldsDisabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels['accomodationAdditionalInformation']}
              hint="Bâtiment, immeuble, escalier et numéro d’appartement"
              path="accomodationAdditionalInformation"
              disabled={fieldsDisabled}
              control={control}
            />
            <CheckboxFormField
              label={FieldLabels['noPhone']}
              path="noPhone"
              disabled={fieldsDisabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels['phone1']}
              path="phone1"
              disabled={fieldsDisabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels['phone2']}
              path="phone2"
              disabled={fieldsDisabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels['email']}
              path="email"
              disabled={fieldsDisabled}
              control={control}
            />
            <SelectFormField
              label={FieldLabels['familySituation']}
              path="familySituation"
              disabled={fieldsDisabled}
              control={control}
              options={beneficiaryFamilySituationOptions}
              defaultOption
            />
            <InputFormField
              label={FieldLabels['minorChildren']}
              path="minorChildren"
              disabled={fieldsDisabled}
              type="number"
              min={0}
              step={1}
              control={control}
            />
            <InputFormField
              label={FieldLabels['majorChildren']}
              path="majorChildren"
              disabled={fieldsDisabled}
              type="number"
              min={0}
              step={1}
              control={control}
            />
            <CheckboxFormField
              label={FieldLabels['caregiver']}
              path="caregiver"
              disabled={fieldsDisabled}
              control={control}
            />
            <SelectFormField
              label={FieldLabels['mobility']}
              path="mobility"
              disabled={fieldsDisabled}
              control={control}
              options={beneficiaryMobilityOptions}
              defaultOption
            />
          </div>
        </section>
        {props.full ? (
          <>
            <section className="fr-accordion">
              <h3 className="fr-accordion__title">
                <button
                  type="button"
                  className="fr-accordion__btn"
                  aria-expanded="false"
                  aria-controls="beneficiary-form-relatives"
                >
                  Entourage
                </button>
              </h3>
              <div className="fr-collapse" id="beneficiary-form-relatives">
                <h2>🐵</h2>
              </div>
            </section>
            <section className="fr-accordion">
              <h3 className="fr-accordion__title">
                <button
                  type="button"
                  className="fr-accordion__btn"
                  aria-expanded="false"
                  aria-controls="beneficiary-form-health"
                >
                  Santé
                </button>
              </h3>
              <div className="fr-collapse" id="beneficiary-form-health">
                <h2>🐵</h2>
              </div>
            </section>
            <section className="fr-accordion">
              <h3 className="fr-accordion__title">
                <button
                  type="button"
                  className="fr-accordion__btn"
                  aria-expanded="false"
                  aria-controls="beneficiary-form-activity"
                >
                  Activité et revenu
                </button>
              </h3>
              <div className="fr-collapse" id="beneficiary-form-activity">
                <h2>🐵</h2>
              </div>
            </section>
            <section className="fr-accordion">
              <h3 className="fr-accordion__title">
                <button
                  type="button"
                  className="fr-accordion__btn"
                  aria-expanded="false"
                  aria-controls="beneficiary-form-external"
                >
                  Structures extérieures
                </button>
              </h3>
              <div className="fr-collapse" id="beneficiary-form-external">
                <h2>🐵</h2>
              </div>
            </section>
          </>
        ) : null}

        <InputFormField
          className="fr-mt-4v"
          label={FieldLabels['additionalInformation']}
          hint="Il est fortement recommandé de ne stocker que les informations utiles au suivi du bénéficiaire et d'éviter le recueil d'informations sensibles (données de santé, mots de passe, etc)."
          disabled={fieldsDisabled}
          control={control}
          path="additionalInformation"
          type="textarea"
        />

        {mutation.isError ? (
          <p className="fr-error-text">{mutation.error.message}</p>
        ) : null}

        <div className="fr-grid-row fr-grid-row--center">
          <button className="fr-btn" type="submit" disabled={isLoading}>
            {props.creation
              ? 'Ajouter le bénéficiaire'
              : 'Enregistrer le bénéficiaire'}
          </button>
        </div>
      </form>
    )
  },
)
