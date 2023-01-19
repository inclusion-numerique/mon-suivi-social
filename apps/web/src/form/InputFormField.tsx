'use client'

import { HTMLInputTypeAttribute } from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'
import { FieldPath } from 'react-hook-form/dist/types/path'
import TextareaAutosize from 'react-textarea-autosize'

const getFieldValueAs = (
  value: string | null | undefined,
  {
    valueAsNumber,
    valueAsDate,
  }: { valueAsNumber?: boolean; valueAsDate?: boolean },
) =>
  value === undefined || value === null
    ? value
    : valueAsNumber
    ? value === ''
      ? NaN
      : +value
    : valueAsDate
    ? new Date(value)
    : value

// View design options here https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/champ-de-saisie
export function InputFormField<T extends FieldValues>({
  label,
  path,
  control,
  placeholder,
  type = 'text',
  hint,
  disabled,
  valueAsNumber,
  valueAsDate,
  max,
  min,
  step,
  autoFocus,
}: {
  control: Control<T>
  path: FieldPath<T>
  disabled?: boolean
  label?: string
  hint?: string
  type?: Exclude<HTMLInputTypeAttribute, 'checkbox' | 'radio'> | 'textarea'
  placeholder?: string
  valueAsNumber?: boolean
  valueAsDate?: boolean
  min?: number
  max?: number
  step?: number
  autoFocus?: boolean
}) {
  const id = `input-form-field__${path}`

  return (
    <Controller
      control={control}
      name={path}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { invalid, isTouched, isDirty, error },
        formState,
      }) => (
        <div
          className={`fr-input-group ${error ? 'fr-input-group--error' : ''} ${
            disabled ? 'fr-input-group--disabled' : ''
          } ${isTouched && !invalid ? 'fr-input-group--valid' : ''}`}
        >
          <label className="fr-label" htmlFor={id}>
            {label}
            {hint ? <span className="fr-hint-text">{hint}</span> : null}
          </label>
          {type === 'textarea' ? (
            <TextareaAutosize
              className="fr-input"
              aria-describedby={error ? `${id}__error` : undefined}
              disabled={disabled}
              id={id}
              placeholder={placeholder}
              minRows={2}
              onBlur={onBlur}
              onChange={onChange}
              value={value ?? ''}
              ref={ref}
              name={name}
              autoFocus={autoFocus}
            />
          ) : (
            <input
              className="fr-input"
              aria-describedby={error ? `${id}__error` : undefined}
              disabled={disabled}
              type={type}
              id={id}
              placeholder={placeholder}
              onBlur={onBlur}
              onChange={(event) =>
                onChange(
                  getFieldValueAs(event.target.value, {
                    valueAsDate,
                    valueAsNumber,
                  }),
                )
              }
              value={value ?? ''}
              ref={ref}
              name={name}
              min={min}
              max={max}
              step={step}
              autoFocus={autoFocus}
            />
          )}
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
