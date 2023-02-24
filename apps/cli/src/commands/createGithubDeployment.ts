import { getOctokit, owner, repo } from '../github'
import { Command } from '@commander-js/extra-typings'
import { computeBranchNamespace } from '../../../../packages/cdk/src/utils'
import { output } from '../output'

export const createGithubDeployment = new Command()
  .command('github:deployment:create')
  .argument('<branch>', 'branch target')
  .action(async (branch) => {
    const environment = computeBranchNamespace(branch)
    const isMain = branch === 'main'

    const result = await getOctokit().rest.repos.createDeployment({
      owner,
      repo,
      auto_merge: false,
      ref: branch,
      environment,
      task: 'deploy',
      transient_environment: isMain ? false : true,
      production_environment: isMain ? true : false,
      required_contexts: [],
    })

    if (!('id' in result.data)) {
      throw new Error(`Deployment creation failed: "${result.data.message}"`)
    }

    output(result.data.id)
  })
