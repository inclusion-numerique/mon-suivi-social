import { Control, Controller, FieldValues } from 'react-hook-form'
import { FieldPath } from 'react-hook-form/dist/types/path'
import { Options } from '@mss/web/utils/options'

// View design options here https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/boutons-radio/
export function RadioFormField<T extends FieldValues>({
  label,
  path,
  options,
  control,
  hint,
  disabled,
}: {
  control: Control<T>
  path: FieldPath<T>
  options: Options
  disabled?: boolean
  label?: string
  hint?: string
}) {
  const id = `input-form-field__${path}`

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
            aria-labelledby={`${id}__legend ${error ? `${id}__error` : ''}`}
            role="group"
          >
            <legend className="fr-fieldset__legend" id={`${id}__legend`}>
              {label}
              {hint ? <span className="fr-hint-text">{hint}</span> : null}
            </legend>
            <div className="fr-fieldset__content">
              {options.map((option, index) => (
                <div key={option.value} className="fr-radio-group">
                  <input
                    type="radio"
                    id={`${id}__${index}`}
                    disabled={disabled}
                    onBlur={onBlur}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onChange(option.value)
                      }
                    }}
                    value={option.value}
                    name={name}
                    ref={ref}
                  />
                  <label className="fr-label" htmlFor={`${id}__${index}`}>
                    {option.name}
                  </label>
                </div>
              ))}
            </div>
            {error ? (
              <p id={`${id}__error`} className="fr-error-text">
                {error.message}
              </p>
            ) : null}
          </fieldset>
        </div>
      )}
    />
  )
}
