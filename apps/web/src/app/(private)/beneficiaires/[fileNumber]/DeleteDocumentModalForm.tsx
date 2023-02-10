'use client'

import { DefaultValues, useForm } from 'react-hook-form'
import { trpc } from '@mss/web/trpc'
import { withTrpc } from '@mss/web/withTrpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { MouseEventHandler, useRef } from 'react'
import { Spinner } from '@mss/web/ui/Spinner'
import { MutationInput } from '@mss/web/features/createMutation.client'
import { DeleteDocumentClient } from '@mss/web/features/document/deleteDocument.client'

export const DeleteDocumentModalForm = withTrpc(
  ({ documentKey, dialogId }: { documentKey: string; dialogId: string }) => {
    const deleteDocument = trpc.beneficiary.document.delete.useMutation()
    const closeRef = useRef<HTMLButtonElement>(null)

    const defaultValues: DefaultValues<MutationInput<DeleteDocumentClient>> = {
      documentKey,
    }

    const {
      control,
      handleSubmit,
      reset,
      setError,
      formState: { isSubmitting },
    } = useForm<MutationInput<DeleteDocumentClient>>({
      defaultValues,
      resolver: zodResolver(DeleteDocumentClient.inputValidation),
    })

    const onSubmit = async (data: MutationInput<DeleteDocumentClient>) => {
      deleteDocument.mutate(data, {
        onSuccess: () => {
          closeRef.current?.click()
          reset(defaultValues)
        },
      })
    }

    const isLoading = isSubmitting || deleteDocument.isLoading

    const onCancel: MouseEventHandler = (event) => {
      reset(defaultValues, { keepDefaultValues: true })
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="fr-modal__header">
          <button
            className="fr-link--close fr-link"
            aria-controls={dialogId}
            type="button"
            ref={closeRef}
          >
            Fermer
          </button>
        </div>
        <div className="fr-modal__content">
          <h1 id={`${dialogId}__title`} className="fr-modal__title">
            Supprimer le document
          </h1>

          <p>
            Confirmer vous la suppression du document ? Il ne sera pas
            récupérable.
          </p>

          {deleteDocument.isError ? (
            <p className="fr-error-text">
              {deleteDocument.error?.message ??
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
                className="fr-btn fr-icon-delete-line"
              >
                {isLoading ? <Spinner size="sm" /> : 'Supprimer'}
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
