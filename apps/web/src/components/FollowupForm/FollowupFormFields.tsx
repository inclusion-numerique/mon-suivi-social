'use client'

import {
  InputFormField,
  SelectFormField,
  SelectTagsFormField,
  CheckboxFormField,
} from '@mss/web/components/FormField'
import { EditFollowupClient } from '@mss/web/features/followup/editFollowup.client'
import { Options } from '@mss/web/utils/options'
import {
  followupMediumOptions,
  followupStatusOptions,
} from '@mss/web/client/options/followup'
import { Control } from 'react-hook-form'

const FieldLabels = EditFollowupClient.fieldLabels

export const FollowupFormFields = ({
  disabled,
  control,
  documentOptions,
  followupTypeOptions,
  displaySynthesis,
  displayPrivateSynthesis,
  isMediumEqual,
}: {
  documentOptions: Options
  followupTypeOptions: Options
  disabled: boolean
  control: Control<any, any>
  displaySynthesis: boolean
  displayPrivateSynthesis: boolean
  isMediumEqual: (value: string) => boolean
}) => (
  <div>
    <InputFormField
      label={FieldLabels.date}
      disabled={disabled}
      control={control}
      path="date"
      type="date"
      valueAsDate
      required
    />
    <SelectFormField
      label={FieldLabels.medium}
      disabled={disabled}
      control={control}
      path="medium"
      defaultOption
      required
      options={followupMediumOptions}
    />
    {isMediumEqual('ThirdParty') ? (
      <InputFormField
        label={FieldLabels.thirdPersonName}
        disabled={disabled}
        control={control}
        path="thirdPersonName"
      />
    ) : null}
    {isMediumEqual('ExternalAppointment') ? (
      <InputFormField
        label={FieldLabels.place}
        disabled={disabled}
        control={control}
        path="place"
      />
    ) : null}
    <SelectTagsFormField
      label={FieldLabels.types}
      disabled={disabled}
      options={followupTypeOptions}
      control={control}
      defaultOptionLabel="Choisissez un accompagnement"
      defaultOption
      required
      path="types"
    />
    <InputFormField
      label={FieldLabels.structureName}
      disabled={disabled}
      control={control}
      path="structureName"
    />
    <SelectFormField
      label={FieldLabels.status}
      disabled={disabled}
      control={control}
      path="status"
      required
      defaultOption
      options={followupStatusOptions}
    />
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
      disabled={disabled}
      options={documentOptions}
      control={control}
      defaultOptionLabel="Associez un document"
      defaultOption
      path="documents"
    />
  </div>
)
