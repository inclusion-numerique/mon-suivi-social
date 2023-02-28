import { Argument, Command } from '@commander-js/extra-typings'
import { getOctokit, owner, repo } from '../github'
import { output } from '../output'

const DeploymentStates = [
  'error',
  'failure',
  'inactive',
  'in_progress',
  'queued',
  'pending',
  'success',
] as const

type DeploymentState = (typeof DeploymentStates)[number]

export const updateGithubDeployment = new Command()
  .command('github:deployment:update')
  .addArgument(
    new Argument(
      '<deploymentId>',
      'id of the github repo deployment',
    ).argParser(parseInt),
  )
  .addArgument(
    new Argument('<state>', 'state of the deployment.')
      .choices(DeploymentStates)
      .argParser((value) => value as DeploymentState),
  )
  .option(
    '-u --url <environmentUrl>',
    'url of the deployed preview environment',
  )
  .option('-l --log <logUrl>', 'url of the CI deployment job')
  .option('-d --description <description>', 'a short description of the status')
  // TODO remove this eslint disable when https://github.com/commander-js/extra-typings/pull/35 is merged
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .action(async (deploymentId, state, { log, url, description }) => {
    const result = await getOctokit().rest.repos.createDeploymentStatus({
      owner,
      repo,
      deployment_id: deploymentId,
      description,
      state,
      // Access to CI build job
      log_url: log,
      environment_url: url,
      // Do not change environment name
      environment: undefined,
      // Make previous deployments for same target and environment inactive
      auto_inactive: true,
    })

    output(result.data.id)
  })
