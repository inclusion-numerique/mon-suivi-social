'use client'

import mime from 'mime-types'
import { DefaultValues, useForm } from 'react-hook-form'
import {
  AddDocumentDataValidationWithUpload,
  AddDocumentDataWithUpload,
  documentFileAllowedTypes,
  documentFileMaxSize,
  documentTagOptions,
  documentTypeOptions,
} from '@mss/web/app/structure/beneficiaires/[fileNumber]/AddDocumentData'
import { trpc } from '@mss/web/trpc'
import { withTrpc } from '@mss/web/withTrpc'
import { SelectFormField } from '@mss/web/form/SelectFormField'
import { CheckboxFormField } from '@mss/web/form/CheckboxFormField'
import { zodResolver } from '@hookform/resolvers/zod'
import { TagsFormField } from '@mss/web/form/TagsFormField'
import { MouseEventHandler, useRef } from 'react'
import { UploadFormField } from '@mss/web/form/UploadFormField'
import { formatByteSize } from '@mss/web/utils/formatByteSize'
import axios from 'axios'
import { Spinner } from '@mss/web/ui/Spinner'

export const AddDocumentModalForm = withTrpc(
  ({ beneficiaryId }: { beneficiaryId: string }) => {
    const addDocument = trpc.beneficiary.document.add.useMutation()
    const createUploadUrl =
      trpc.beneficiary.document.createUploadUrl.useMutation()
    const closeRef = useRef<HTMLButtonElement>(null)

    const defaultValues: DefaultValues<AddDocumentDataWithUpload> = {
      confidential: false,
      tags: [],
      beneficiaryId,
    }

    const {
      control,
      handleSubmit,
      reset,
      setError,
      formState: { isSubmitting },
    } = useForm<AddDocumentDataWithUpload>({
      defaultValues,
      resolver: zodResolver(AddDocumentDataValidationWithUpload),
    })

    const onSubmit = async ({
      confidential,
      file,
      beneficiaryId,
      type,
      tags,
    }: AddDocumentDataWithUpload) => {
      const signedUrl = await createUploadUrl
        .mutateAsync({
          name: file.name,
          mimeType: file.type,
          beneficiaryId,
        })
        .catch((err) => {
          // TODO SENTRY
          setError('file', {
            message:
              'Une erreur est survenue lors du téléversement. Merci de réessayer',
          })
        })
      if (!signedUrl) {
        return
      }

      const uploaded = await axios
        .put(signedUrl.url, file, {
          headers: {
            'Content-Type': file.type,
          },
        })
        .catch((err) => {
          // TODO SENTRY
          setError('file', {
            message:
              'Une erreur est survenue lors du téléversement. Merci de réessayer',
          })
        })
      if (!uploaded) {
        return
      }

      addDocument.mutate(
        {
          file: {
            key: signedUrl.key,
            mimeType: file.type,
            name: file.name,
            size: file.size,
          },
          beneficiaryId,
          type,
          tags,
          confidential,
        },
        {
          onSuccess: () => {
            closeRef.current?.click()
            reset(defaultValues)
          },
        },
      )
    }

    const isLoading = isSubmitting || addDocument.isLoading

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
            ref={closeRef}
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
            disabled={isLoading}
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

          <UploadFormField
            control={control}
            label="Document"
            hint={`Taille maximale : ${formatByteSize(
              documentFileMaxSize,
            )}. Formats supportés : ${documentFileAllowedTypes
              .map(mime.extension)
              .join(', ')}`}
            disabled={isLoading}
            accept={documentFileAllowedTypes.join(', ')}
            path="file"
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
                disabled={isLoading}
                className="fr-btn fr-icon-file-add-line"
              >
                {isLoading ? <Spinner size="sm" /> : 'Ajouter'}
              </button>
            </li>
            <li>
              <button
                disabled={isLoading}
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
  },
)
