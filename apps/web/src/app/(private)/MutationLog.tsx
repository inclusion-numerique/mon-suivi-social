import { Table } from '@mss/web/ui/table/Table'
import { TableHead } from '@mss/web/ui/table/TableHead'
import { prismaClient } from '@mss/web/prismaClient'
import { TableColumnDefinition } from '@mss/web/ui/table/TableColumnDefinition'
import { TableRow } from '@mss/web/ui/table/TableRow'
import { getUserDisplayName } from '@mss/web/utils/user'
import { MutationDiff } from '@mss/web/features/mutationLog'
import * as Sentry from '@sentry/nextjs'
import { getMutationClient } from '@mss/web/features/mutationClients'
import { PrivateConfig } from '@mss/web/config'
import { asyncComponent } from '@mss/web/utils/asyncComponent'
import { nonBreakable } from '@mss/web/utils/nonBreakable'
import styles from './MutationLog.module.css'

// We need to import mutation clients as they (by default) would have been out of the bundle
// TODO we could add a custom lint rule for this :)
import '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithFullData.client'
import '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithGeneralInfo.client'
import '@mss/web/features/beneficiary/archiveBeneficiary/archiveBeneficiary.client'
import '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryFullData.client'
import '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryGeneralInfo.client'
import '@mss/web/features/document/addDocument.client'
import '@mss/web/features/document/editDocument.client'
import '@mss/web/features/document/deleteDocument.client'
import '@mss/web/features/followup/addFollowup.client'
import '@mss/web/features/followup/editFollowup.client'
import '@mss/web/features/helpRequest/addHelpRequest.client'
import '@mss/web/features/helpRequest/editHelpRequest.client'
import '@mss/web/features/structure/createStructure/createStructure.client'
import '@mss/web/features/structure/editStructure/editStructure.client'
import '@mss/web/features/structure/createFollowupType/createFollowupType.client'

const getMutationLogs = ({
  targetStructureId,
  targetBeneficiaryId,
  targetUserId,
  targetId,
}: {
  targetStructureId?: string
  targetBeneficiaryId?: string
  targetUserId?: string
  targetId?: string
}) =>
  prismaClient.mutationLog.findMany({
    where: {
      targetStructureId,
      targetBeneficiaryId,
      targetUserId,
      targetId,
    },
    include: {
      by: {
        select: {
          id: true,
          email: true,
          name: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      },
    },
    orderBy: { date: 'desc' },
  })
type MutationLogItem = Awaited<ReturnType<typeof getMutationLogs>>[number]

export const mutationLogTableColumns: TableColumnDefinition<MutationLogItem>[] =
  [
    {
      label: 'Date',
      content: ({ date }) => date.toLocaleDateString(),
    },
    {
      label: 'Opération',
      content: ({ name }) => {
        const client = getMutationClient(name)
        if (!client) {
          return name
        }
        return nonBreakable(client.title)
      },
    },
    {
      label: 'Auteur',
      content: ({ by }) =>
        by ? nonBreakable(getUserDisplayName(by)) : 'Système',
    },
    {
      label: 'Données ajoutées',
      content: ({ diff, name }) => (
        <MutationLogDiff name={name} type="added" diff={diff as MutationDiff} />
      ),
    },
    {
      label: 'Données modifiées',
      content: ({ diff, name }) => (
        <MutationLogDiff
          name={name}
          type="updated"
          diff={diff as unknown as MutationDiff}
        />
      ),
    },
    {
      label: 'Données supprimées',
      content: ({ diff, name }) => (
        <MutationLogDiff
          name={name}
          type="deleted"
          diff={diff as unknown as MutationDiff}
        />
      ),
    },
  ]

export const MutationLog = asyncComponent(
  async ({
    className,
    targetStructureId,
    targetBeneficiaryId,
    targetUserId,
    targetId,
  }: {
    className?: string
    targetStructureId?: string
    targetBeneficiaryId?: string
    targetUserId?: string
    targetId?: string
  }) => {
    const mutationLogs = await getMutationLogs({
      targetStructureId,
      targetBeneficiaryId,
      targetUserId,
      targetId,
    })

    const tableHead = <TableHead columns={mutationLogTableColumns} />
    const tableBody =
      mutationLogs.length === 0 ? (
        <tr>
          <td colSpan={mutationLogTableColumns.length}>
            Aucun changement n&apos;a été enregistré
          </td>
        </tr>
      ) : (
        <>
          {mutationLogs.map((log) => {
            return (
              <TableRow
                key={log.id}
                item={log}
                columns={mutationLogTableColumns}
              />
            )
          })}
        </>
      )

    return (
      <div className={`fr-card ${className}`}>
        <div className="fr-card__body">
          <div className="fr-card__content">
            <h3 className="fr-card__title">Historique des changements</h3>
            <div className="fr-card__desc fr-pt-4v">
              <Table tableHead={tableHead} tableBody={tableBody} />
            </div>
          </div>
        </div>
      </div>
    )
  },
)

const MutationLogDiff = ({
  diff,
  name,
  type,
}: {
  diff: MutationDiff
  type: keyof MutationDiff
  name: string
}) => {
  // Diff comes from a json field in db that can be old
  // If anything is wierd we notify developers
  if (!diff || !diff[type]) {
    Sentry.captureException(
      new Error(`MutationDiff is not a valid object or has no "${type}" key`),
      {
        extra: {
          feature: name,
        },
      },
    )
    return <>Non accessible</>
  }

  const changes = diff[type]
  const client = getMutationClient(name)
  if (!client) {
    if (PrivateConfig.NodeEnv !== 'production') {
      throw new Error(
        `Mutation "${name}" is not registered, did you forget to import it in MutationLog.tsx .`,
      )
    }
    Sentry.captureException(new Error(`Mutation "${name}" has no client`), {
      extra: {
        feature: name,
      },
    })
  }

  const keys = Object.keys(changes)

  return (
    <ul className={styles.changesFields}>
      {keys.length === 0 ? (
        <li style={{ color: 'var(--text-disabled-grey)' }}>Aucune</li>
      ) : (
        keys.map((key) => (
          <li className="fr-text--sm" key={key}>
            {client ? nonBreakable(client.fieldLabels[key] ?? key) : key}
          </li>
        ))
      )}
    </ul>
  )
}
