'use client'

import { ThreeDots } from 'react-loader-spinner'

const sizes = { sm: 20, md: 40, lg: 60 }
const color = '#4550e5'

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <ThreeDots
      height={sizes[size]}
      width={sizes[size]}
      radius={sizes[size] / 5}
      color={color}
      ariaLabel="chargement"
      visible
    />
  )
}
