'use client'

import mime from 'mime-types'
import { DefaultValues, useForm } from 'react-hook-form'
import { trpc } from '@mss/web/trpc'
import { withTrpc } from '@mss/web/components/TrpcProvider'
import {
  SelectFormField,
  TagsFormField,
  UploadFormField,
  CheckboxFormField,
} from '@mss/web/components/FormField'
import { zodResolver } from '@hookform/resolvers/zod'
import { MouseEventHandler, useRef } from 'react'
import { formatByteSize } from '@mss/web/utils/formatByteSize'
import axios from 'axios'
import { Spinner } from '@mss/web/components/Generic/Spinner'
import {
  AddDocumentClient,
  AddDocumentWithBrowserUploadData,
  AddDocumentWithBrowserUploadValidation,
} from '@mss/web/features/document/addDocument.client'
import { useRouter } from 'next/navigation'
import { modalFadeAnimationTime } from '@mss/web/styles/dsfr'
import * as Sentry from '@sentry/nextjs'
import {
  documentFileAllowedTypes,
  documentFileMaxSize,
  documentTagOptions,
  documentTypeOptions,
} from '@mss/web/constants/document'

export const AddDocumentModalForm = withTrpc(
  ({
    dialogId,
    beneficiaryId,
  }: {
    dialogId: string
    beneficiaryId: string
  }) => {
    const router = useRouter()
    const addDocument = trpc.beneficiary.document.add.useMutation()
    const createUploadUrl =
      trpc.beneficiary.document.createUploadUrl.useMutation()
    const closeReference = useRef<HTMLButtonElement>(null)

    const defaultValues: DefaultValues<AddDocumentWithBrowserUploadData> = {
      tags: [],
      beneficiaryId,
    }

    const {
      control,
      handleSubmit,
      reset,
      setError,
      formState: { isSubmitting },
    } = useForm<AddDocumentWithBrowserUploadData>({
      defaultValues,
      resolver: zodResolver(AddDocumentWithBrowserUploadValidation),
    })

    const onSubmit = async ({
      confidential,
      file,
      beneficiaryId,
      type,
      tags,
    }: AddDocumentWithBrowserUploadData) => {
      const signedUrl = await createUploadUrl
        .mutateAsync({
          name: file.name,
          mimeType: file.type,
          beneficiaryId,
        })
        .catch((error) => {
          Sentry.captureException(error, {
            extra: { feature: AddDocumentClient.name },
          })
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
        .catch((error) => {
          Sentry.captureException(error, {
            extra: { feature: AddDocumentClient.name },
          })
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
            closeReference.current?.click()
            router.refresh()
            // Let the time for the animation to finish before reseting
            setTimeout(() => reset(defaultValues), modalFadeAnimationTime)
          },
        },
      )
    }

    const isLoading = isSubmitting || addDocument.isLoading

    const onCancel: MouseEventHandler = () => {
      reset(defaultValues)
    }

    // eslint-disable-next-line no-irregular-whitespace
    const uploadHint = `Taille maximale : ${formatByteSize(
      documentFileMaxSize,
      // eslint-disable-next-line no-irregular-whitespace
    )}. Formats supportés : ${documentFileAllowedTypes
      .map(mime.extension)
      .join(', ')}`

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
            Ajouter un document
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

          <UploadFormField
            control={control}
            label="Document"
            hint={uploadHint}
            disabled={isLoading}
            accept={documentFileAllowedTypes.join(', ')}
            path="file"
            required
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
