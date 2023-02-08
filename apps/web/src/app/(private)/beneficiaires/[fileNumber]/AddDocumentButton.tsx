import { AddDocumentModalForm } from '@mss/web/app/(private)/beneficiaires/[fileNumber]/AddDocumentModalForm'

export const AddDocumentButton = ({
  beneficiaryId,
  className,
}: {
  beneficiaryId: string
  className?: string
}) => {
  return (
    <>
      <button
        type="button"
        aria-controls="fr-modal-add-document"
        data-fr-opened="false"
        className={`fr-btn fr-btn--icon-left fr-icon-file-add-line ${
          className ?? ''
        }`}
      >
        Ajouter un document
      </button>

      <dialog
        id="fr-modal-add-document"
        aria-labelledby="fr-modal-add-document-title"
        className="fr-modal"
        role="dialog"
      >
        <div className="fr-container fr-container--fluid fr-container-md">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
              <div className="fr-modal__body">
                <AddDocumentModalForm beneficiaryId={beneficiaryId} />
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}
