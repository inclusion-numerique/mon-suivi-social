'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'

export const InclusionConnectSigninButton = () => {
  return (
    <div className="fr-btns-group">
      <button
        type="button"
        className="fr-btn fr-p-0"
        style={{ background: '#000638' }}
        title="S'identifier avec Inclusion Connect"
        onClick={() => {
          signIn('inclusion-connect')
        }}
      >
        <Image
          className="img-fluid"
          alt="Inclusion Connect"
          src="/images/inclusion-connect.svg"
          height={40}
          width={243}
        />
      </button>
    </div>
  )
}
