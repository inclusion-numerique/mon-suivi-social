import { Command } from '@commander-js/extra-typings'
import { computeBranchNamespace } from "@mss/cdk/src/utils"
import { getOctokit, owner, repo } from '../github'
import { output } from '../output'

export const deactivateGithubDeployment = new Command()
  .command('github:deployment:deactivate')
  .argument('<branch>', 'branch target')
  // TODO remove this eslint disable when https://github.com/commander-js/extra-typings/pull/35 is merged
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
