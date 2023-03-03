'use client'

import { Control, Controller, FieldValues } from 'react-hook-form'
import { FieldPath } from 'react-hook-form/dist/types/path'

export function UploadFormField<T extends FieldValues>({
  label,
  path,
  control,
  placeholder,
  hint,
  disabled,
  required,
  accept,
  autoFocus,
}: {
  control: Control<T>
  path: FieldPath<T>
  disabled?: boolean
  required?: boolean
  label?: string
  hint?: string
  placeholder?: string
  accept?: string
  autoFocus?: boolean
}) {
  const id = `upload-form-field__${path}`

  return (
    <Controller
      control={control}
      name={path}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { invalid, isTouched, error },
      }) => (
        <div
          className={`fr-fr-upload-group-group ${
            error ? 'fr-input-group--error' : ''
          } ${disabled ? 'fr-input-group--disabled' : ''} ${
            isTouched && !invalid ? 'fr-input-group--valid' : ''
          }`}
        >
          <label className="fr-label" htmlFor={id}>
            {label}
            {required ? ' *' : null}
            {hint ? <span className="fr-hint-text">{hint}</span> : null}
          </label>

          <input
            className="fr-upload fr-mt-2v"
            type="file"
            aria-describedby={error ? `${id}__error` : undefined}
            disabled={disabled}
            id={id}
            placeholder={placeholder}
            accept={accept}
            onBlur={onBlur}
            onChange={(event) => {
              // We want to emit a File from this onchange instead of the field value (that is the default implementation)
              const {files} = event.target
              if (!files) {
                onChange('')
                return
              }
              const file = files[0] ?? ''
              if (file) {
                ;(file as File & { filename: string }).filename =
                  event.target.value
              }
              onChange(file)
            }}
            value={value?.filename ?? ''}
            ref={ref}
            name={name}
            autoFocus={autoFocus}
          />

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
