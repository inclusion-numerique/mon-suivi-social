'use client'

import { DefaultValues, useForm } from 'react-hook-form'
import { trpc } from '@mss/web/trpc'
import { withTrpc } from '@mss/web/withTrpc'
import {
  SelectFormField,
  CheckboxFormField,
  TagsFormField,
} from '@mss/web/components/FormField'
import { zodResolver } from '@hookform/resolvers/zod'
import { MouseEventHandler, useRef } from 'react'
import { Spinner } from '@mss/web/components/Generic/Spinner'
import { MutationInput } from '@mss/web/features/createMutation.client'
import { EditDocumentClient } from '@mss/web/features/document/editDocument.client'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import { useRouter } from 'next/navigation'
import {
  documentTagOptions,
  documentTypeOptions,
} from '@mss/web/constants/document'

export const EditDocumentModalForm = withTrpc(
  ({
    dialogId,
    serializedDefaultValues,
  }: {
    dialogId: string
    serializedDefaultValues: Serialized<
      DefaultValues<MutationInput<EditDocumentClient>>
    >
  }) => {
    const editDocument = trpc.beneficiary.document.edit.useMutation()
    const closeReference = useRef<HTMLButtonElement>(null)
    const router = useRouter()

    const defaultValues = deserialize(serializedDefaultValues)

    const {
      control,
      handleSubmit,
      reset,
      formState: { isSubmitting },
    } = useForm<MutationInput<EditDocumentClient>>({
      defaultValues,
      resolver: zodResolver(EditDocumentClient.inputValidation),
    })

    const onSubmit = async (data: MutationInput<EditDocumentClient>) => {
      editDocument.mutate(data, {
        onSuccess: () => {
          closeReference.current?.click()
          router.refresh()
        },
      })
    }

    const isLoading = isSubmitting || editDocument.isLoading

    const onCancel: MouseEventHandler = () => {
      reset(defaultValues, { keepDefaultValues: true })
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="fr-modal__header">
          <button
            className="fr-link--close fr-link"
            aria-controls={dialogId}
            type="button"
            ref={closeReference}
          >
            Fermer
          </button>
        </div>
        <div className="fr-modal__content">
          <h1 id={`${dialogId}__title`} className="fr-modal__title">
            Modifier le document
          </h1>

          <SelectFormField
            control={control}
            label="Type de document"
            path="type"
            defaultOption
            options={documentTypeOptions}
            disabled={isLoading}
            required
          />

          <CheckboxFormField
            control={control}
            checkboxLabel="Confidentiel"
            path="confidential"
            disabled={isLoading}
          />

          <TagsFormField
            control={control}
            label="Thèmes"
            path="tags"
            options={documentTagOptions}
            disabled={isLoading}
          />

          {editDocument.isError ? (
            <p className="fr-error-text">
              {editDocument.error?.message ??
                'Une erreur est survenue, merci de réessayer.'}
            </p>
          ) : null}
        </div>
        <div className="fr-modal__footer">
          <ul className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
            <li>
              <button
                type="submit"
                disabled={isLoading}
                className="fr-btn fr-icon-file-add-line"
              >
                {isLoading ? <Spinner size="sm" /> : 'Enregistrer'}
              </button>
            </li>
            <li>
              <button
                disabled={isLoading}
                type="button"
                aria-controls={dialogId}
                className="fr-btn  fr-btn--secondary"
                onClick={onCancel}
              >
                Annuler
              </button>
            </li>
          </ul>
        </div>
      </form>
    )
  },
)
