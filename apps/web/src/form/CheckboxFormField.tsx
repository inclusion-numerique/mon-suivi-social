import { Control, Controller, FieldValues } from 'react-hook-form'
import { FieldPath } from 'react-hook-form/dist/types/path'

// View design options here https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/case-a-cocher/
export function CheckboxFormField<T extends FieldValues>({
  control,
  path,
  disabled,
  label,
  checkboxLabel,
  required,
  hint,
  autoFocus,
}: {
  control: Control<T>
  path: FieldPath<T>
  disabled?: boolean
  required?: boolean
  label?: string
  checkboxLabel?: string
  hint?: string
  autoFocus?: boolean
}) {
  const id = `checkbox-form-field__${path}`

  return (
    <Controller
      control={control}
      name={path}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { invalid, isTouched, error },
      }) => (
        <div className="fr-form-group">
          <fieldset
            className={`fr-fieldset ${error ? 'fr-fieldset--error' : ''} ${
              disabled ? 'fr-fieldset--disabled' : ''
            } ${isTouched && !invalid ? 'fr-fieldset--valid' : ''}`}
            aria-labelledby={`${id}__legend ${id}__error`}
            role="group"
          >
            <legend
              className="fr-fieldset__legend fr-text--regular"
              id={`${id}__legend`}
            >
              {label}
              {required ? ' *' : null}
              {hint ? (
                <span className="fr-hint-text fr-mt-0">{hint}</span>
              ) : null}
            </legend>
            <div className="fr-fieldset__content">
              <div
                className={`fr-checkbox-group ${
                  error ? 'fr-checkbox-group--error' : ''
                } ${disabled ? 'fr-checkbox-group--disabled' : ''} ${
                  isTouched && !invalid ? 'fr-checkbox-group--valid' : ''
                }`}
              >
                <input
                  aria-describedby={error ? `${id}__error` : undefined}
                  disabled={disabled}
                  type="checkbox"
                  id={id}
                  onBlur={onBlur}
                  onChange={(event) => {
                    onChange(event.target.checked)
                  }}
                  checked={value === true}
                  ref={ref}
                  name={name}
                  autoFocus={autoFocus}
                />
                <label className="fr-label" htmlFor={id}>
                  {checkboxLabel ?? ' '}
                </label>

                {error ? (
                  <p id={`${id}__error`} className="fr-error-text">
                    {error.message}
                  </p>
                ) : null}
              </div>
            </div>
          </fieldset>
        </div>
      )}
    />
  )
}
