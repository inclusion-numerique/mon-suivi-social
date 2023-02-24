import { getOctokit, owner, repo } from '../github'
import { Command } from '@commander-js/extra-typings'
import { computeBranchNamespace } from '../../../../packages/cdk/src/utils'
import { output } from '../output'

export const deactivateGithubDeployment = new Command()
  .command('github:deployment:deactivate')
  .argument('<branch>', 'branch target')
  .action(async (branch) => {
    const environment = computeBranchNamespace(branch)
    const octokit = getOctokit()

    const { data: deployments } = await octokit.rest.repos.listDeployments({
      owner,
      repo,
      environment,
    })

    const deploymentIds = deployments.map(({ id }) => id)

    output(
      `Found ${deploymentIds.length} deployment${
        deploymentIds.length === 1 ? '' : 's'
      } to deactivate`,
    )
    if (deploymentIds.length === 0) {
      return
    }
    output('Deactivating ...')

    await Promise.all(
      deploymentIds.map(async (deployment_id) => {
        // It is only possible to delete inactive deployments
        // First we change deployment statuses
        await octokit.rest.repos.createDeploymentStatus({
          owner,
          repo,
          deployment_id,
          state: 'inactive',
        })
      }),
    )

    output(
      `Deactivated ${deploymentIds.length} deployment${
        deploymentIds.length === 1 ? '' : 's'
      }`,
    )
  })
