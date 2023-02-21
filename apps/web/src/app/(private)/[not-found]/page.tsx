import { notFound } from 'next/navigation'

// This is a hack while not-found is not used for missing pages
const NotfoundPage = () => {
  notFound()
  return null
}

export default NotfoundPage
