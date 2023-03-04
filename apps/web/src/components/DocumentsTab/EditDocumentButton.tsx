import { EditDocumentModalForm } from './EditDocumentModalForm'
import { BeneficiaryPageDocuments } from '@mss/web/app/(private)/beneficiaires/[fileNumber]/page'
import { EditDocumentServer } from '@mss/web/features/document/editDocument.server'
import { serialize } from '@mss/web/utils/serialization'

export function EditDocumentButton({
  document,
}: {
  document: BeneficiaryPageDocuments[number]
}) {
  const defaultValues = EditDocumentServer.dataFromServerState(document)
  const dialogId = `edit-document-modal-${document.key}`

  return (
    <>
      <div className="fr-btns-group fr-btns-group--sm fr-btns-group--icon-left">
        <button
          type="button"
          aria-controls={dialogId}
          data-fr-opened="false"
          className="fr-btn fr-btn--tertiary fr-icon-pencil-line"
        >
          Modifier
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
                <EditDocumentModalForm
                  dialogId={dialogId}
                  serializedDefaultValues={serialize(defaultValues)}
                />
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}
