import { prismaClient } from '@mss/web/prismaClient'

const findByFileNumberAndStructure = ({
  fileNumber,
  structureId,
}: {
  structureId: string
  fileNumber: string
}) =>
  prismaClient.beneficiary.findFirstOrThrow({
    where: { structureId, fileNumber },
    include: {
      referents: true,
    },
  })

export { findByFileNumberAndStructure }
