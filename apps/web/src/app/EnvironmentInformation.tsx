import { PrivateConfig, PublicConfig } from '@mss/web/config'

export const EnvironmentInformation = () => {
  console.log('CONFIG', PrivateConfig)
  const branch = PrivateConfig.Branch
  const isMain = PrivateConfig.isMain

  // Branch can be empty on dev env
  if (isMain || !branch) {
    return null
  }

  const prLink = `${PublicConfig.repository}/pulls?q=${encodeURIComponent(
    `is:pr head:${branch}`,
  )}`

  const storybookLink = `https://${branch}--${PrivateConfig.Chromatic.appId}.chromatic.com`

  return (
    <div id="environment-information" className="fr-notice fr-notice--info">
      <div className="fr-container">
        <div className="fr-notice__body">
          <p className="fr-notice__title">
            Ceci est la version &#34;{branch}&#34; de{' '}
            {PublicConfig.productTitle} présentant des données de démonstration.
          </p>
          <p className="fr-text--sm">
            <a
              href={prLink}
              className="fr-mr-2w"
              rel="noreferrer"
              target="_blank"
            >
              <span className="fr-icon--sm fr-icon-github-fill" /> PR &#34;
              {branch}&#34; sur Github
            </a>
            <br className="fr-hidden-lg fr-mt-2v" />
            <a
              href={storybookLink}
              className="fr-mr-2w"
              rel="noreferrer"
              target="_blank"
            >
              <span className="fr-icon--sm  fr-icon-image-line" /> Composants
              &#34;
              {branch}&#34; sur Storybook
            </a>
            <br className="fr-hidden-lg fr-mt-2v" />
            <a href={PublicConfig.mainLiveUrl} rel="noreferrer" target="_blank">
              <span className="fr-icon--sm fr-icon-france-line" /> Version
              officielle
            </a>
            <br className="fr-hidden-lg fr-mt-2v" />
          </p>
        </div>
      </div>
    </div>
  )
}
