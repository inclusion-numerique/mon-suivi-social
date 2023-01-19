import { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'
import { FieldPath } from 'react-hook-form/dist/types/path'

// View design options here https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/case-a-cocher/
// TODO MSS Same interface as other InputField and Select field for control
export function CheckboxFormField<T extends FieldValues>({
  label,
  errors,
  register,
  path,
  placeholder,
  hint,
  disabled,
}: {
  register: UseFormRegister<T>
  errors: Partial<FieldErrorsImpl<T>>
  path: FieldPath<T>
  disabled?: boolean
  label?: string
  hint?: string
  placeholder?: string
}) {
  // We do not use language errors as record object, we cast to string
  const error = 'TODO'
  const id = `checkbox-form-field__${path}`
  const registerProps = register(path)

  return (
    <div
      className={`fr-checkbox-group ${
        error ? 'fr-checkbox-group--error' : ''
      } ${disabled ? 'fr-checkbox-group--disabled' : ''}`}
    >
      <input
        className="fr-input fr-input--error"
        aria-describedby="text-input-error-desc-error"
        type="checkbox"
        id={id}
        placeholder={placeholder}
        {...registerProps}
      />
      <label className="fr-label" htmlFor={id}>
        {label}
        {hint ? <span className="fr-hint-text">{hint}</span> : null}
      </label>
      {error ? <p className="fr-error-text">{error}</p> : null}
    </div>
  )
}
