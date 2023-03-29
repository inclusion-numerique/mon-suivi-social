'use client'

import {
  SelectFormField,
  InputFormField,
  CheckboxFormField,
} from '@mss/web/components/FormField'
import { EditUserClient } from '@mss/web/features/user/editUser/editUser.client'
import { nonAdminUserRoleOptions } from '@mss/web/client/options/user'
import { Control } from 'react-hook-form'

const FieldLabels = EditUserClient.fieldLabels

export const UserFormFields = ({
  fieldsDisabled,
  control,
  creation,
}: {
  fieldsDisabled: boolean
  control: Control<any, any>
  creation: boolean
}) => (
  <>
    <h3>Informations</h3>
    <InputFormField
      label={FieldLabels.firstName}
      disabled={fieldsDisabled}
      control={control}
      path="firstName"
      required
    />
    <InputFormField
      label={FieldLabels.lastName}
      disabled={fieldsDisabled}
      control={control}
      path="lastName"
      required
    />
    <InputFormField
      label={FieldLabels.email}
      disabled={fieldsDisabled}
      control={control}
      path="email"
      required
    />
    <SelectFormField
      label={FieldLabels.role}
      disabled={fieldsDisabled}
      control={control}
      path="role"
      defaultOption
      required
      options={nonAdminUserRoleOptions}
    />
    {creation ? null : (
      <CheckboxFormField
        control={control}
        label={FieldLabels.enabled}
        checkboxLabel="Activé"
        path="enabled"
      />
    )}
  </>
)
