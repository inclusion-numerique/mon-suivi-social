import axios from 'axios'

// eslint-disable-next-line @typescript-eslint/naming-convention
export const project_id = process.env.SCW_PROJECT_ID ?? ''

const authToken = process.env.SCW_SECRET_KEY ?? ''

export const scalewayAxios = axios.create({
  baseURL: 'https://api.scaleway.com',
  headers: { 'X-Auth-Token': authToken },
})
