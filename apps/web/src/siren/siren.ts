import { PrivateConfig } from '@mss/web/config'
import axios from 'axios'

export type SirenCommunitySearchResponse = {
  header: {
    debut: number
    message: string
    nombre: number
    statut: number
    total: number
  }
  etablissements: Etablissement[]
}

export type Etablissement = {
  nic: string
  siren: string
  siret: string
  uniteLegale: {
    denominationUniteLegale: string
    categorieJuridiqueUniteLegale: CategorieJuridique
  }
  adresseEtablissement: {
    codePostalEtablissement: string
    codeCommuneEtablissement: string
    libelleCommuneEtablissement: string
  }
}
export const categoriesJuridiques = {
  '7210': 'Commune',
  '7220': 'Département',
  '7225': 'DOM-TOM',
  '7229': 'Collectivité Territoriale',
  '7230': 'Région',
  '7312': 'Commune Associée',
  '7344': 'Métropole',
  '7346': 'Communauté de Communes',
  '7347': 'Communauté de Villes',
  '7348': 'Communauté Agglo',
}

export type CategorieJuridique = keyof typeof categoriesJuridiques

const searchResultFields = [
  'nic',
  'siren',
  'siret',
  'denominationUniteLegale',
  'categorieJuridiqueUniteLegale',
  'codePostalEtablissement',
  'codeCommuneEtablissement',
  'libelleCommuneEtablissement',
]

const resultLength = 15

const legalCategorySearch = Object.keys(categoriesJuridiques)
  .map((code) => `categorieJuridiqueUniteLegale:${code}`)
  .join(' OR ')

const buildSearchQueryParams = (searchQuery: string) => {
  if (true) {
    return `q=raisonSociale:${encodeURIComponent(`"${searchQuery.trim()}"`)}`
  }

  return `q=raisonSociale:${encodeURIComponent(
    `"${searchQuery.trim()}"`,
  )} AND (${legalCategorySearch})&nombre=${resultLength}&champs=${searchResultFields.join(
    ',',
  )}&facette.champ=siren`
}

/**
 * TODO c'est pas ouf genre si on cherche Grenoble on a pas la ville mais que la Metro ...
 * TODO Ca plante avec une recherche gennre "Lyon 1er"
 */
export const searchCommunity = async (
  searchQuery: string,
): Promise<SirenCommunitySearchResponse> => {
  const url = `https://api.insee.fr/entreprises/sirene/V3/siret?${buildSearchQueryParams(
    searchQuery,
  )}`
  const authorizationHeader = `Bearer ${PrivateConfig.Insee.sirenAccessToken}`

  const result = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: authorizationHeader,
    },
  })

  if (result.status !== 200) {
    console.error(result.statusText)
    // TODO Sentry
    throw new Error(
      `Impossible de se connecter au registre SIRENE. Merci de réessayer ultérieurement.`,
    )
  }

  console.log('RES HEADERS', result.headers)

  return result.data
}
