'use client'

import { HTMLInputTypeAttribute, ReactNode } from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'
import { FieldPath } from 'react-hook-form/dist/types/path'
import TextareaAutosize from 'react-textarea-autosize'
import {
  getFieldValueAs,
  GetFieldValueAsOptions,
} from '@mss/web/utils/getFieldValueAs'
import { dateAsIsoDay } from '@mss/web/utils/dateAsIsoDay'

type InputFormFieldType =
  | Exclude<HTMLInputTypeAttribute, 'checkbox' | 'radio'>
  | 'textarea'

const formatValueToInput = (
  value: number | string | Date | null | undefined,
  type: InputFormFieldType,
): string => {
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'number') {
    return value.toString(10)
  }

  if (type === 'date' && value instanceof Date) {
    return dateAsIsoDay(value)
  }
  if (type === 'datetime-local' && value instanceof Date) {
    return value?.toISOString()
  }

  return value as string
}

// View design options here https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/champ-de-saisie
export function InputFormField<T extends FieldValues>({
  label,
  path,
  control,
  placeholder,
  type = 'text',
  hint,
  disabled,
  required,
  valueAsNumber,
  valueAsDate,
  valueAsBoolean,
  max,
  min,
  step,
  autoFocus,
  className,
  minRows,
}: {
  control: Control<T>
  path: FieldPath<T>
  disabled?: boolean
  required?: boolean
  label?: ReactNode
  hint?: string
  type?: InputFormFieldType
  placeholder?: string
  min?: number
  max?: number
  step?: number
  autoFocus?: boolean
  className?: string
  minRows?: number
} & GetFieldValueAsOptions) {
  const id = `input-form-field__${path}`

  return (
    <Controller
      control={control}
      name={path}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { invalid, isTouched, error },
      }) => (
        <div
          className={`fr-input-group ${error ? 'fr-input-group--error' : ''} ${
            disabled ? 'fr-input-group--disabled' : ''
          } ${isTouched && !invalid ? 'fr-input-group--valid' : ''} ${
            className ?? ''
          }`}
        >
          <label className="fr-label" htmlFor={id}>
            {label}
            {required ? ' *' : null}
            {hint ? <span className="fr-hint-text">{hint}</span> : null}
          </label>
          {type === 'textarea' ? (
            <TextareaAutosize
              className="fr-input"
              aria-describedby={error ? `${id}__error` : undefined}
              disabled={disabled}
              id={id}
              placeholder={placeholder}
              minRows={minRows ?? 2}
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
              value={formatValueToInput(value, type)}
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
                    valueAsBoolean,
                  }),
                )
              }
              value={formatValueToInput(value, type)}
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
