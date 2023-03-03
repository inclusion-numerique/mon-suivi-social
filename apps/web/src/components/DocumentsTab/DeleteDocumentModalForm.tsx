'use client'

import { trpc } from '@mss/web/trpc'
import { withTrpc } from '@mss/web/withTrpc'
import { useRef } from 'react'
import { Spinner } from '@mss/web/components/Generic/Spinner'
import { useRouter } from 'next/navigation'

export const DeleteDocumentModalForm = withTrpc(
  ({ documentKey, dialogId }: { documentKey: string; dialogId: string }) => {
    const deleteDocument = trpc.beneficiary.document.delete.useMutation()
    const closeReference = useRef<HTMLButtonElement>(null)
    const router = useRouter()

    const onSubmit = async () => {
      deleteDocument.mutate(
        { documentKey },
        {
          onSuccess: () => {
            closeReference.current?.click()
            router.refresh()
          },
        },
      )
    }

    const { isLoading } = deleteDocument

    return (
      <form onSubmit={onSubmit}>
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
                className="fr-btn fr-btn--secondary"
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
