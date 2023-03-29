import { Beneficiary } from '@prisma/client'
import styles from './BeneficiaryAddress.module.css'

export function BeneficiaryAddress({
  beneficiary: {
    streetNumber,
    street,
    addressComplement,
    zipcode,
    city,
    region,
  },
}: {
  beneficiary: Beneficiary
}) {
  return (
    <span>
      {street ? (
        <span className={styles.addressLine}>
          {streetNumber} {street}
        </span>
      ) : null}
      {addressComplement ? (
        <span className={styles.addressLine}>{addressComplement}</span>
      ) : null}
      {zipcode || city ? (
        <span className={styles.addressLine}>
          {zipcode}
          {zipcode && city ? ' ' : null}
          {city}
        </span>
      ) : null}
      {region ? <span className={styles.addressLine}>{region}</span> : null}
    </span>
  )
}
