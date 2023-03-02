'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@mss/web/trpc'
import { useRouter } from 'next/navigation'
import { withTrpc } from '@mss/web/withTrpc'
import { Routes } from '@mss/web/app/routing/routes'
import { ArchiveBeneficiaryClient } from '@mss/web/features/beneficiary/archiveBeneficiary/archiveBeneficiary.client'
import { MutationInput } from '@mss/web/features/createMutation.client'
import z from 'zod'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import { Beneficiary } from '@prisma/client'
import { CheckboxFormField } from '@mss/web/form/CheckboxFormField'
import { beneficiaryDisplayName } from '@mss/web/beneficiary/beneficiary'
import Link from 'next/link'

export const ArchiveBeneficiaryForm = withTrpc(
  ({
    serializedBeneficiary,
  }: {
    serializedBeneficiary: Serialized<Beneficiary>
  }) => {
    const router = useRouter()
    const beneficiary = deserialize(serializedBeneficiary)
    const { id } = beneficiary

    const archiveBeneficiary = trpc.beneficiary.archive.useMutation()

    const form = useForm<
      MutationInput<ArchiveBeneficiaryClient> & { confirm: boolean }
    >({
      resolver: zodResolver(
        ArchiveBeneficiaryClient.inputValidation.extend({
          confirm: z
            .boolean()
            .refine((value) => !!value, "Veuillez confirmer l'opération"),
        }),
      ),
      defaultValues: { beneficiaryId: id, confirm: false },
    })

    const { handleSubmit, control } = form

    const onSubmit = async (data: MutationInput<ArchiveBeneficiaryClient>) => {
      try {
        const result = await archiveBeneficiary.mutateAsync(data)
        router.push(
          Routes.Beneficiaires.Beneficiaire.Index.path(result.beneficiary),
        )
      } catch {
        // Error message will be in hook result
      }
    }

    const { isLoading, error, isSuccess } = archiveBeneficiary

    return isSuccess ? (
      <>
        <div className="fr-alert fr-alert--success fr-mb-8v">
          <h3 className="fr-alert__title">Archivage terminé</h3>
          <p>Le bénéficiaire à bien été archivé.</p>
        </div>
        <Link className="fr-btn" href={Routes.Beneficiaires.Index.path}>
          Retour aux bénéficiaires
        </Link>
      </>
    ) : (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="fr-alert fr-alert--warning fr-mb-8v">
          <h3 className="fr-alert__title">Archivage d&apos;un bénéficiaire</h3>
          <p>
            Conformément à la RGPD, l&apos;archivage d&apos;un bénéficiaire
            supprime toutes ses informations personnelles.
          </p>
          <p>
            Cette opération n&apos;est pas réversible et les données ne pourront
            en aucun cas être récupérées.
          </p>
        </div>
        <CheckboxFormField
          checkboxLabel={`Confirmer l'archivage de ${beneficiaryDisplayName(
            beneficiary,
          )}`}
          control={control}
          path="confirm"
        />
        {error ? (
          <div className="fr-alert fr-alert--error fr-mb-8v">
            <h3 className="fr-alert__title">Une erreur est survenue</h3>
            <p>{error.message}</p>
            <p>Veuillez réesayer ultérieurement</p>
          </div>
        ) : null}
        <button
          className="fr-btn fr-btn--icon-left fr-icon-archive-line"
          type="submit"
          disabled={isLoading}
        >
          Archiver le bénéficiaire
        </button>
      </form>
    )
  },
)
