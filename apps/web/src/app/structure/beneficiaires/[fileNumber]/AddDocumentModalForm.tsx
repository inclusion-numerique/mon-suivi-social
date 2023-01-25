'use client'

import { DefaultValues, useForm } from 'react-hook-form'
import {
  AddDocumentData,
  AddDocumentDataValidation,
  documentTagOptions,
  documentTypeOptions,
} from '@mss/web/app/structure/beneficiaires/[fileNumber]/AddDocumentData'
import { trpc } from '@mss/web/trpc'
import { withTrpc } from '@mss/web/withTrpc'
import { SelectFormField } from '@mss/web/form/SelectFormField'
import { CheckboxFormField } from '@mss/web/form/CheckboxFormField'
import { zodResolver } from '@hookform/resolvers/zod'
import { MultipleBadgeFormField } from '@mss/web/form/MultipleBadgeFormField'
import { MouseEventHandler } from 'react'

const defaultValues: DefaultValues<AddDocumentData> = {
  confidential: false,
  tags: [],
}

export const AddDocumentModalForm = withTrpc(({}: {}) => {
  const addDocument = trpc.beneficiary.document.add.useMutation()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<AddDocumentData>({
    defaultValues,
    resolver: zodResolver(AddDocumentDataValidation),
  })

  const onSubmit = (data: AddDocumentData) => {
    console.log('Submitted', data)
  }

  // TODO or is uploading
  const disableFields = addDocument.isLoading
  const disableButtons = disableFields

  const onCancel: MouseEventHandler = (event) => {
    reset(defaultValues, { keepDefaultValues: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="fr-modal__header">
        <button
          className="fr-link--close fr-link"
          aria-controls="fr-modal-add-document"
          data-fr-js-modal-button="true"
        >
          Fermer
        </button>
      </div>
      <div className="fr-modal__content">
        <h1 id="fr-modal-add-document-title" className="fr-modal__title">
          Ajouter un document
        </h1>

        <SelectFormField
          control={control}
          label="Type de document"
          path="type"
          defaultOption
          options={documentTypeOptions}
          disabled={disableFields}
        />

        <CheckboxFormField
          control={control}
          label="Confidentialité"
          checkboxLabel="Confidentiel"
          path="confidential"
          disabled={disableFields}
        />

        <MultipleBadgeFormField
          control={control}
          label="Thèmes"
          path="tags"
          options={documentTagOptions}
          disabled={disableFields}
        />

        {addDocument.isError ? (
          <p className="fr-error-text">
            {addDocument.error?.message ??
              'Une erreur est survenue, merci de réessayer.'}
          </p>
        ) : null}
      </div>
      <div className="fr-modal__footer">
        <ul className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
          <li>
            <button
              type="submit"
              disabled={disableButtons}
              className="fr-btn fr-icon-file-add-line"
            >
              Ajouter
            </button>
          </li>
          <li>
            <button
              disabled={disableButtons}
              aria-controls="fr-modal-add-document"
              className="fr-btn  fr-btn--secondary"
              onClick={onCancel}
              data-fr-js-modal-button="true"
            >
              Annuler
            </button>
          </li>
        </ul>
      </div>
    </form>
  )
})
