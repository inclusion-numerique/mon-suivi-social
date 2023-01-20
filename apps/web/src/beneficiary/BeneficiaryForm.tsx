'use client'
import { DefaultValues, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputFormField } from '@mss/web/form/InputFormField'
import {
  BeneficiaryData,
  BeneficiaryDataValidation,
  beneficiaryStatusOptions,
} from '@mss/web/beneficiary/beneficiary'
import { Options } from '@mss/web/utils/options'
import { SelectFormField } from '@mss/web/form/SelectFormField'
import { CheckboxFormField } from '@mss/web/form/CheckboxFormField'
import { FunctionComponent } from 'react'
import { trpc } from '@mss/web/trpc'
import { useRouter } from 'next/navigation'
import { withTrpc } from '@mss/web/withTrpc'
import { Routes } from '@mss/web/app/routing/routes'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import { Beneficiary } from '@prisma/client'

const defaultValueFromBeneficiary = (beneficiary: Beneficiary) => {
  return beneficiary
}

export const BeneficiaryForm: FunctionComponent<
  { agents: Options } & (
    | {
        creation: true
        defaultValues?: Partial<BeneficiaryData>
      }
    | {
        creation: false
        serializedBeneficiary: Serialized<Beneficiary>
      }
  )
> = (props) => {
  const router = useRouter()

  const addBeneficiary = trpc.beneficiary.add.useMutation()

  const { agents } = props

  const defaultValues: DefaultValues<BeneficiaryData> = props.creation
    ? props.defaultValues
    : defaultValueFromBeneficiary(deserialize(props.serializedBeneficiary))

  if (!defaultValues.aidantConnectAuthorized) {
    defaultValues.aidantConnectAuthorized = false
  }

  const form = useForm<BeneficiaryData>({
    resolver: zodResolver(BeneficiaryDataValidation),
    defaultValues,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const {
    handleSubmit,
    register,
    control,

    formState: { errors },
  } = form

  const onSubmit = async (data: BeneficiaryData) => {
    try {
      const result = await addBeneficiary.mutateAsync(data)
      router.push(Routes.Structure.Beneficiaire.Index(result.beneficiary))
    } catch (err) {
      // Error message will be in hook result
    }
  }

  const { isLoading } = addBeneficiary

  const fieldsDisabled = isLoading

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SelectFormField
        label="Agent référent"
        disabled={fieldsDisabled}
        options={agents}
        control={control}
        defaultOption
        path="agentId"
      />
      <CheckboxFormField
        label="Mandat Aidant Connect"
        disabled={fieldsDisabled}
        register={register}
        errors={errors}
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

      {addBeneficiary.isError ? (
        <p className="fr-error-text">{addBeneficiary.error.message}</p>
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
}
// export default BeneficiaryForm
export default withTrpc(BeneficiaryForm)
