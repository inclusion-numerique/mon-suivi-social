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
        <span className={styles['address-line']}>
          {streetNumber} {street}
        </span>
      ) : null}
      {addressComplement ? (
        <span className={styles['address-line']}>{addressComplement}</span>
      ) : null}
      {zipcode || city ? (
        <span className={styles['address-line']}>
          {zipcode}
          {zipcode && city ? ' ' : null}
          {city}
        </span>
      ) : null}
      {region ? <span className={styles['address-line']}>{region}</span> : null}
    </span>
  )
}
