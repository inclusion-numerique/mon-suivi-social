import { Gender } from '@prisma/client'

export const genderWording: { [gender in Gender]: string } = {
  [Gender.Female]: 'Femme',
  [Gender.Male]: 'Homme',
  [Gender.Other]: 'Autre',
}

export const getGenderWording = (gender: Gender | null): string =>
  gender ? genderWording[gender] : 'Non renseigné'
