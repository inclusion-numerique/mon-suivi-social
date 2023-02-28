import { getOctokit, owner, repo } from '../github'
import { Command } from '@commander-js/extra-typings'
import { computeBranchNamespace } from '@mss/cdk/utils'
import { output } from '../output'

export const createGithubDeployment = new Command()
  .command('github:deployment:create')
  .argument('<branch>', 'branch target')
  // TODO remove this eslint disable when https://github.com/commander-js/extra-typings/pull/35 is merged
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
      throw new Error(
        `Deployment creation failed: "${
          result.data.message ?? 'Unknown error'
        }"`,
      )
    }

    output(result.data.id)
  })
