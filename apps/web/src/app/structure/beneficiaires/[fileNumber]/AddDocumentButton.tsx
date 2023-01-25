import { AddDocumentModalForm } from '@mss/web/app/structure/beneficiaires/[fileNumber]/AddDocumentModalForm'

export const AddDocumentButton = () => {
  return (
    <>
      <button
        type="button"
        data-fr-opened="false"
        aria-controls="fr-modal-add-document"
        data-fr-js-modal-button="true"
        className="fr-btn fr-btn--icon-left fr-icon-file-add-line"
      >
        Ajouter un document
      </button>

      <dialog
        aria-labelledby="fr-modal-add-document-title"
        id="fr-modal-add-document"
        className="fr-modal"
        role="dialog"
        data-fr-js-modal="true"
      >
        <div className="fr-container fr-container--fluid fr-container-md">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
              <div className="fr-modal__body" data-fr-js-modal-body="true">
                <AddDocumentModalForm />
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}
