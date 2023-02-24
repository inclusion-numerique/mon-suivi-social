import { Octokit } from 'octokit'

export const owner = 'inclusion-numerique'
export const repo = 'mon-suivi-social'

let octokit: Octokit

// Lazily validate env and instanciate octokit
export const getOctokit = () => {
  if (!octokit) {
    const token = process.env.GITHUB_TOKEN

    if (!token) {
      throw new Error('Missing GITHUB_TOKEN env variable for authentication')
    }
    octokit = new Octokit({ auth: token })
  }

  return octokit
}
