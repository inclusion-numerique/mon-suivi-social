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
export function MultipleBadgeFormField<T extends FieldValues>({
  control,
  label,
  path,
  placeholder,
  hint,
  defaultOption,
  disabled,
  autoFocus,
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
  const id = `multiple-badge-form-field__${path}`

  const flattenedOptions: Options = optionsProps.groups
    ? Object.values(optionsProps.optionGroups).flat()
    : optionsProps.options

  // TODO Aria labeled by from id
  return (
    <Controller
      control={control}
      name={path}
      render={({
        field: { onChange, value },
        fieldState: { invalid, isTouched, error },
      }) => {
        const valuesSet = new Set<string>(value ?? [])

        // Remove value on badge click
        const onOptionBadgeClick = (option: Option, selected: boolean) => {
          if (selected) {
            onChange(
              value.filter(
                (selectedValue: string) => selectedValue !== option.value,
              ),
            )
            return
          }
          onChange([...value, option.value])
        }

        return (
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
                {hint ? (
                  <span className="fr-hint-text fr-mt-0">{hint}</span>
                ) : null}
              </legend>
              <div className="fr-fieldset__content">
                {flattenedOptions.map((option) => {
                  const selected = valuesSet.has(option.value)
                  return (
                    <OptionBadge
                      key={option.value}
                      option={option}
                      selected={selected}
                      disabled={disabled}
                      onClick={() => onOptionBadgeClick(option, selected)}
                    />
                  )
                })}
                {error ? (
                  <p id={`${id}__error`} className="fr-error-text">
                    {error.message}
                  </p>
                ) : null}
              </div>
            </fieldset>
          </div>
        )
      }}
    />
  )
}

const baseOptionBadgeClass = 'fr-badge--icon-left fr-icon-add-line'
const selectedOptionBadgeClass =
  'fr-badge--icon-left fr-icon-success-fill fr-badge--blue-cumulus'

const baseDisabledOptionBadgeClass = 'fr-badge--icon-left fr-icon-add-line'
const selectedDisabledOptionBadgeClass =
  'fr-badge--icon-left fr-icon-success-fill'

// TODO Css module with class
const OptionBadge = ({
  option,
  onClick,
  selected,
  disabled,
}: {
  option: Option
  onClick: MouseEventHandler
  selected?: boolean
  disabled?: boolean
}) => {
  const badgeClass = disabled
    ? selected
      ? selectedDisabledOptionBadgeClass
      : baseDisabledOptionBadgeClass
    : selected
    ? selectedOptionBadgeClass
    : baseOptionBadgeClass
  return (
    <div
      key={option.value}
      className={`fr-badge fr-mb-2v fr-mr-2v ${badgeClass}`}
      onClick={disabled ? undefined : onClick}
      aria-selected={selected ? 'true' : 'false'}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.67 : undefined,
      }}
    >
      {option.name}
    </div>
  )
}
