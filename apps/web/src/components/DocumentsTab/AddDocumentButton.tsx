import { AddDocumentModalForm } from './AddDocumentModalForm'

export function AddDocumentButton({
  beneficiaryId,
  className,
}: {
  beneficiaryId: string
  className?: string
}) {
  const dialogId = 'add-document-modal'
  return (
    <>
      <button
        type="button"
        aria-controls={dialogId}
        data-fr-opened="false"
        className={`fr-btn fr-btn--icon-left fr-icon-file-add-line ${
          className ?? ''
        }`}
      >
        Ajouter un document
      </button>

      <dialog
        id={dialogId}
        aria-labelledby={`${dialogId}__title`}
        className="fr-modal"
        role="dialog"
      >
        <div className="fr-container fr-container--fluid fr-container-md">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
              <div className="fr-modal__body">
                <AddDocumentModalForm
                  dialogId={dialogId}
                  beneficiaryId={beneficiaryId}
                />
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}
