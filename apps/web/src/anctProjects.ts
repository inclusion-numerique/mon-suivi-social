export const categoryProjectsLink = (category: Category) =>
  `/projets?thematiques=${category}`

export const categories = [
  'Accès au numérique',
  'Attractivité',
  'Développement économique',
  'Éducation et jeunesse',
  'Infrastructures locales',
  'Logement et cadre de vie',
  'Services au public',
  'Solidarité',
  'Soutien aux associations',
  'Transition écologique',
  'Transport et mobilités',
] as const

export type Category = typeof categories[number]
