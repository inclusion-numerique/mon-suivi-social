import { BeneficiaryPageDocuments } from '@mss/web/app/(private)/beneficiaires/[fileNumber]/page'
import { DeleteDocumentModalForm } from '@mss/web/app/(private)/beneficiaires/[fileNumber]/DeleteDocumentModalForm'

export const DeleteDocumentButton = ({
  document,
}: {
  document: BeneficiaryPageDocuments[number]
}) => {
  const dialogId = `delete-document-modal-${document.key}`

  return (
    <>
      <div className="fr-btns-group fr-btns-group--sm fr-btns-group--icon-left">
        <button
          type="button"
          aria-controls={dialogId}
          data-fr-opened="false"
          className={`fr-btn fr-btn--tertiary fr-icon-delete-line`}
        >
          Supprimer
        </button>
      </div>

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
                <DeleteDocumentModalForm
                  dialogId={dialogId}
                  documentKey={document.key}
                />
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}
