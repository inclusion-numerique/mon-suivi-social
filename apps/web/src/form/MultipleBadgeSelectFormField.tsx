'use client'

import { Control, Controller, FieldValues } from 'react-hook-form'
import { FieldPath } from 'react-hook-form/dist/types/path'
import { Option, Options, OptionsGroups } from '@mss/web/utils/options'
import { ChangeEventHandler, MouseEventHandler } from 'react'

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
export function MultipleBadgeSelectFormField<T extends FieldValues>({
  control,
  label,
  path,
  placeholder,
  hint,
  defaultOption,
  disabled,
  autoFocus,
  defaultOptionLabel = 'Sélectionnez une option',
  ...optionsProps
}: {
  control: Control<T>
  label: string
  path: FieldPath<T>
  disabled?: boolean
  defaultOption?: boolean
  defaultOptionLabel?: string
  hint?: string
  placeholder?: string
  autoFocus?: boolean
} & (
  | { groups?: false; options: Options }
  | { groups: true; optionGroups: OptionsGroups }
)) {
  const id = `select-form-field__${path}`

  const flattenedOptions: Options = optionsProps.groups
    ? Object.values(optionsProps.optionGroups).flat()
    : optionsProps.options

  // TODO Disabled styles classes
  return (
    <Controller
      control={control}
      name={path}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { invalid, isTouched, isDirty, error },
        formState,
      }) => {
        // Value is an array of option values
        const onSelectChange: ChangeEventHandler<HTMLSelectElement> = (
          event,
        ) => {
          onChange([...value, event.target.value])
        }

        const selectedOptions = flattenedOptions.filter((option) =>
          value?.includes(option.value),
        )

        // Remove value on badge click
        const onSelectedOptionClick = (option: Option) => {
          onChange(
            value.filter(
              (selectedValue: string) => selectedValue !== option.value,
            ),
          )
        }

        return (
          <div
            className={`fr-select-group ${
              error ? 'fr-select-group--error' : ''
            } ${disabled ? 'fr-select-group--disabled' : ''} ${
              isTouched && !invalid ? 'fr-select-group--valid' : ''
            }`}
          >
            <label className="fr-label" htmlFor={id}>
              {label}
              {hint ? <span className="fr-hint-text">{hint}</span> : null}
            </label>
            <select
              className="fr-select fr-select--error"
              aria-describedby="text-select-error-desc-error"
              id={id}
              placeholder={placeholder}
              disabled={disabled}
              onBlur={onBlur}
              onChange={onSelectChange}
              value={''}
              ref={ref}
              name={name}
              autoFocus={autoFocus}
            >
              {defaultOption ? (
                <option value="">{defaultOptionLabel}</option>
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
            <div className="fr-mt-4v">
              {selectedOptions.map((option, index) => (
                <SelectedOptionBadge
                  key={option.value}
                  option={option}
                  index={index}
                  onClick={() => onSelectedOptionClick(option)}
                />
              ))}
            </div>
            {error ? (
              <p id={`${id}__error`} className="fr-error-text">
                {error.message}
              </p>
            ) : null}
          </div>
        )
      }}
    />
  )
}

const optionBadgeColorClasses = [
  'fr-badge--pink-macaron',
  'fr-badge--yellow-tournesol',
  'fr-badge--brown-caramel',
  'fr-badge--orange-terre-battue',
]

const SelectedOptionBadge = ({
  option,
  onClick,
  index,
}: {
  index: number
  option: Option
  onClick: MouseEventHandler
}) => {
  const colorIndex = index % optionBadgeColorClasses.length
  return (
    <div
      key={option.value}
      className={`fr-badge fr-mt-2v ${optionBadgeColorClasses[colorIndex]}`}
      onClick={onClick}
      style={{ display: 'block', cursor: 'pointer' }}
    >
      {option.name} <span className="fr-icon-close-line fr-icon--sm" />
    </div>
  )
}
