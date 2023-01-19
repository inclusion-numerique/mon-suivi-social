import { Routes } from '@mss/web/app/routing/routes'
import { redirect } from 'next/navigation'

const StructureIndexPage = () => {
  redirect(Routes.Structure.TableauDeBord.Index)
  return null
}

export default StructureIndexPage
