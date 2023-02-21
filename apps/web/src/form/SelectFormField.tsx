'use client'

import { Control, Controller, FieldValues } from 'react-hook-form'
import { FieldPath } from 'react-hook-form/dist/types/path'
import { Options, OptionsGroups } from '@mss/web/utils/options'
import {
  getFieldValueAs,
  GetFieldValueAsOptions,
} from '@mss/web/utils/getFieldValueAs'

const OptionsList = ({ options }: { options: Options }) => (
  <>
    {options.map(({ name, value }) => (
      <option key={value} value={value}>
        {name}
      </option>
    ))}
    )
  </>
)

// View design options here https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/liste-deroulante/
export function SelectFormField<T extends FieldValues>({
  control,
  label,
  path,
  placeholder,
  hint,
  defaultOption,
  disabled,
  required,
  autoFocus,
  boolean,
  valueAsBoolean,
  valueAsNumber,
  valueAsDate,
  ...optionsProps
}: {
  control: Control<T>
  label?: string
  path: FieldPath<T>
  disabled?: boolean
  required?: boolean
  defaultOption?: boolean
  hint?: string
  placeholder?: string
  autoFocus?: boolean
  // Cast value as boolean
  boolean?: boolean
} & (
  | { groups?: false; options: Options }
  | { groups: true; optionGroups: OptionsGroups }
) &
  GetFieldValueAsOptions) {
  const id = `select-form-field__${path}`

  // TODO Disabled styles classes
  return (
    <Controller
      control={control}
      name={path}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { invalid, isTouched, error },
      }) => (
        <div
          className={`fr-select-group ${
            error ? 'fr-select-group--error' : ''
          } ${disabled ? 'fr-select-group--disabled' : ''} ${
            isTouched && !invalid ? 'fr-select-group--valid' : ''
          }`}
        >
          <label className="fr-label" htmlFor={id}>
            {label}
            {required ? ' *' : null}
            {hint ? <span className="fr-hint-text">{hint}</span> : null}
          </label>
          <select
            className="fr-select fr-select--error"
            aria-describedby="text-select-error-desc-error"
            id={id}
            placeholder={placeholder}
            disabled={disabled}
            onBlur={onBlur}
            onChange={(event) =>
              onChange(
                getFieldValueAs(event.target.value, {
                  valueAsDate,
                  valueAsNumber,
                  valueAsBoolean,
                }),
              )
            }
            value={value ?? ''}
            ref={ref}
            name={name}
            autoFocus={autoFocus}
          >
            {defaultOption ? (
              <option value="">Sélectionnez une option</option>
            ) : null}
            {optionsProps.groups ? (
              Object.entries(optionsProps.optionGroups).map(
                ([groupLabel, options]) => (
                  <optgroup key={groupLabel} label={groupLabel}>
                    <OptionsList options={options} />
                  </optgroup>
                ),
              )
            ) : (
              <OptionsList options={optionsProps.options} />
            )}
          </select>
          {error ? (
            <p id={`${id}__error`} className="fr-error-text">
              {error.message}
            </p>
          ) : null}
        </div>
      )}
    />
  )
}
