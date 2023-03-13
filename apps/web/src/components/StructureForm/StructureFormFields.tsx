'use client'

import { Control } from 'react-hook-form'
import {
  InputFormField,
  TagsFormField,
  SelectFormField,
} from '@mss/web/components/FormField'
import { CreateStructureClient } from '@mss/web/features/structure/createStructure/createStructure.client'
import { CreateFollowupTypeForm } from './CreateFollowupTypeForm'
import { Option } from '@mss/web/utils/options'
import { structureTypeOptions } from '@mss/web/constants/structure'

const FieldLabels = CreateStructureClient.fieldLabels

export const StructureFormFields = ({
  creation,
  disabled,
  control,
  legalFollowupTypeOptions,
  allOptionalFollowupTypeOptions,
  structure,
  onFollowupTypeCreated,
}: {
  creation: boolean
  disabled: boolean
  control: Control<any, any>
  legalFollowupTypeOptions: Option[]
  allOptionalFollowupTypeOptions: Option[]
  structure?: any
  onFollowupTypeCreated?: any
}) => (
  <div>
    <h3>Informations</h3>
    {creation ? (
      <SelectFormField
        label={FieldLabels.type}
        disabled={disabled}
        control={control}
        path="type"
        options={structureTypeOptions}
        defaultOption
        required
      />
    ) : null}
    <InputFormField
      label={FieldLabels.name}
      disabled={disabled}
      control={control}
      path="name"
      required
    />
    <InputFormField
      label={FieldLabels.address}
      disabled={disabled}
      control={control}
      path="address"
      required
    />
    <InputFormField
      label={FieldLabels.zipcode}
      disabled={disabled}
      control={control}
      path="zipcode"
      required
    />
    <InputFormField
      label={FieldLabels.city}
      disabled={disabled}
      control={control}
      path="city"
      required
    />
    <InputFormField
      label={FieldLabels.phone}
      disabled={disabled}
      control={control}
      path="phone"
      required
    />
    <InputFormField
      label={FieldLabels.email}
      disabled={disabled}
      control={control}
      path="email"
      type="email"
      required
    />

    <h3 className="fr-mt-8v">Accompagnements proposés</h3>

    <p className="fr-hint-text">
      Les accompagnements déjà associés à une synthèse d&apos;entretien ou une
      instruction de demande d&apos;aide ne peuvent pas être retirés.
    </p>

    <TagsFormField
      control={control}
      label="Accompagnements légaux"
      path="proposedFollowupTypes"
      options={legalFollowupTypeOptions}
    />

    <TagsFormField
      control={control}
      label="Accompagnements facultatifs"
      path="proposedFollowupTypes"
      options={allOptionalFollowupTypeOptions}
    />
    {/* Only possible to create owned followup types when structure has been created */}
    {structure ? (
      <CreateFollowupTypeForm
        structure={structure}
        onCreated={onFollowupTypeCreated}
      />
    ) : null}
  </div>
)
