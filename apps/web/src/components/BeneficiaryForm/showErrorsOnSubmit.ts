import { UseFormReturn } from 'react-hook-form'

export const showErrorsOnSubmit = ({
  reference,
  form,
}: {
  reference: any
  form: UseFormReturn<any, any>
}) => {
  if (form.formState.isSubmitted && !form.formState.isValid) {
    // Error callback
    if (!reference.current) {
      return
    }

    // Get form accordion sections
    const sections = reference.current.querySelectorAll('.fr-accordion')
    for (const section of sections) {
      const sectionButton = section.querySelector('.fr-accordion__btn')
      const errors = section.querySelector('.fr-error-text')
      if (!sectionButton || !errors) {
        continue
      }

      sectionButton.setAttribute('aria-expanded', 'true')
    }
  }
}
