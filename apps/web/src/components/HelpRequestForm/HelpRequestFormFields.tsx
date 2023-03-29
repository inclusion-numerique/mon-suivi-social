'use client'

import { Control, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  InputFormField,
  SelectFormField,
  SelectTagsFormField,
  CheckboxFormField,
} from '@mss/web/components/FormField'
import { trpc } from '@mss/web/trpc'
import { useRouter } from 'next/navigation'
import { withTrpc } from '@mss/web/components/TrpcProvider'
import { Routes } from '@mss/web/app/routing/routes'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import { MutationInput } from '@mss/web/features/createMutation.client'
import { EditHelpRequestClient } from '@mss/web/features/helpRequest/editHelpRequest.client'
import { AddHelpRequestClient } from '@mss/web/features/helpRequest/addHelpRequest.client'
import { Options } from '@mss/web/utils/options'
import {
  externalOrganisationOptions,
  financialSupportOptions,
  helpRequestReasonOptions,
  helpRequestStatusOptions,
  paymentMethodOptions,
} from '@mss/web/client/options/helpRequest'

const FieldLabels = EditHelpRequestClient.fieldLabels

/**
 * This forms permits creation and edition of helpRequests
 */
export const HelpRequestFormFields = ({
  documentOptions,
  followupTypeOptions,
  disabled,
  control,
  displaySynthesis,
  displayPrivateSynthesis,
  isFinancialSupport,
  isInternal,
  isExternal,
}: {
  disabled: boolean
  control: Control<any, any>
  documentOptions: Options
  followupTypeOptions: Options
  displaySynthesis: boolean
  displayPrivateSynthesis: boolean
  isFinancialSupport: boolean
  isInternal: boolean
  isExternal: boolean
}) => (
  <div>
    <InputFormField
      label={FieldLabels.openingDate}
      disabled={disabled}
      control={control}
      path="openingDate"
      type="date"
      valueAsDate
      required
    />
    <SelectFormField
      label={FieldLabels.type}
      disabled={disabled}
      control={control}
      path="type"
      defaultOption
      options={followupTypeOptions}
      required
    />
    <InputFormField
      label={FieldLabels.prescribingOrganisation}
      disabled={disabled}
      control={control}
      path="prescribingOrganisation"
    />
    <SelectFormField
      label={FieldLabels.status}
      disabled={disabled}
      control={control}
      path="status"
      defaultOption
      options={helpRequestStatusOptions}
      required
    />
    <CheckboxFormField
      checkboxLabel={FieldLabels.fullFile}
      control={control}
      path="fullFile"
    />
    <SelectFormField
      label={FieldLabels.financialSupport}
      disabled={disabled}
      control={control}
      path="financialSupport"
      defaultOption
      options={financialSupportOptions}
    />
    {isFinancialSupport ? (
      <SelectFormField
        label={FieldLabels.reason}
        disabled={disabled}
        control={control}
        path="reason"
        defaultOption
        options={helpRequestReasonOptions}
      />
    ) : null}

    <SelectFormField
      label={FieldLabels.externalStructure}
      disabled={disabled}
      control={control}
      path="externalStructure"
      defaultOption
      options={externalOrganisationOptions}
    />

    {isFinancialSupport && isInternal ? (
      <>
        <InputFormField
          label={FieldLabels.askedAmount}
          disabled={disabled}
          control={control}
          path="askedAmount"
          type="number"
          min={0}
        />
        <InputFormField
          label={FieldLabels.examinationDate}
          disabled={disabled}
          control={control}
          path="examinationDate"
          type="date"
          valueAsDate
        />
        <InputFormField
          label={FieldLabels.decisionDate}
          disabled={disabled}
          control={control}
          path="decisionDate"
          type="date"
          valueAsDate
        />
        <InputFormField
          label={FieldLabels.allocatedAmount}
          disabled={disabled}
          control={control}
          path="allocatedAmount"
          type="number"
          min={0}
        />
        <SelectFormField
          label={FieldLabels.paymentMethod}
          disabled={disabled}
          control={control}
          path="paymentMethod"
          defaultOption
          options={paymentMethodOptions}
        />
        <InputFormField
          label={FieldLabels.paymentDate}
          disabled={disabled}
          control={control}
          path="paymentDate"
          type="date"
          valueAsDate
        />
        <InputFormField
          label={FieldLabels.handlingDate}
          disabled={disabled}
          control={control}
          path="handlingDate"
          type="date"
          valueAsDate
        />
        <InputFormField
          label={FieldLabels.decisionDate}
          disabled={disabled}
          control={control}
          path="decisionDate"
          type="date"
          valueAsDate
        />
      </>
    ) : null}

    {!isFinancialSupport && isExternal ? (
      <InputFormField
        label={FieldLabels.examiningOrganisation}
        disabled={disabled}
        control={control}
        path="examiningOrganisation"
      />
    ) : null}
    {isFinancialSupport && isExternal ? (
      <>
        <InputFormField
          label={FieldLabels.askedAmount}
          disabled={disabled}
          control={control}
          path="askedAmount"
          type="number"
          min={0}
        />
        <InputFormField
          label={FieldLabels.dispatchDate}
          disabled={disabled}
          control={control}
          path="dispatchDate"
          type="date"
          valueAsDate
        />
        <InputFormField
          label={FieldLabels.decisionDate}
          disabled={disabled}
          control={control}
          path="decisionDate"
          type="date"
          valueAsDate
        />
        <InputFormField
          label={FieldLabels.allocatedAmount}
          disabled={disabled}
          control={control}
          path="allocatedAmount"
          type="number"
          min={0}
        />
        <InputFormField
          label={FieldLabels.handlingDate}
          disabled={disabled}
          control={control}
          path="handlingDate"
          type="date"
          valueAsDate
        />
        <InputFormField
          label={FieldLabels.decisionDate}
          disabled={disabled}
          control={control}
          path="decisionDate"
          type="date"
          valueAsDate
        />
      </>
    ) : null}

    <InputFormField
      label={FieldLabels.dueDate}
      disabled={disabled}
      control={control}
      path="dueDate"
      type="date"
      valueAsDate
    />
    {displaySynthesis ? (
      <InputFormField
        label={FieldLabels.synthesis}
        hint="Il est fortement recommandé de ne stocker que les informations utiles au suivi du bénéficiaire et d'éviter le recueil d'informations sensibles (données de santé, mots de passe, etc)."
        disabled={disabled}
        control={control}
        path="synthesis"
        type="textarea"
        minRows={15}
      />
    ) : null}
    {displayPrivateSynthesis ? (
      <InputFormField
        label={
          <>
            <span className="fr-icon-lock-line fr-mr-1w" />
            {FieldLabels.privateSynthesis}
          </>
        }
        hint="Le compte rendu privé est uniquement visible et modifiable par l'agent qui crée la synthèse d'entretien."
        disabled={disabled}
        control={control}
        path="privateSynthesis"
        type="textarea"
        minRows={4}
      />
    ) : null}
    <SelectTagsFormField
      label={FieldLabels.documents}
      disabled={disabled}
      options={documentOptions}
      control={control}
      defaultOptionLabel="Associez un document"
      defaultOption
      path="documents"
    />
  </div>
)
