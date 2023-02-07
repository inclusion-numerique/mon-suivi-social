'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputFormField } from '@mss/web/form/InputFormField'
import { beneficiaryStatusOptions } from '@mss/web/beneficiary/beneficiary'
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
import { MultipleBadgeSelectFormField } from '@mss/web/form/MultipleBadgeSelectFormField'

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

    const { isLoading } = mutation

    const fieldsDisabled = isLoading

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <MultipleBadgeSelectFormField
          label="Agent référent"
          disabled={fieldsDisabled}
          options={agents}
          control={control}
          defaultOption
          path="referents"
        />
        <CheckboxFormField
          label="Mandat Aidant Connect"
          disabled={fieldsDisabled}
          control={control}
          checkboxLabel="Autorisé"
          path="aidantConnectAuthorized"
        />

        <SelectFormField
          label="Statut du dossier"
          path="status"
          disabled={fieldsDisabled}
          control={control}
          options={beneficiaryStatusOptions}
        />

        <InputFormField
          label="Informations complémentaires"
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
