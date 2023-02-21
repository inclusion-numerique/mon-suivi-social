// Intentionally throws an error to test monitoring tools
export default async function error() {
  throw new Error('Intentional error')
}
