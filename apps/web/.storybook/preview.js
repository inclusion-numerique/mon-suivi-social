import { useRef } from '@storybook/addons'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

const loadDsfrJs = () => {
  const existing = document.getElementById('dsfr-js')
  if (existing) {
    return
  }

  const script = document.createElement('script')
  script.id = 'dsfr-js'
  script.src = '/dsfr/dsfr.module.min.js'
  document.body.appendChild(script)
}

const loadDsfrCss = () => {
  const existing = document.getElementById('dsfr-css')
  if (existing) {
    return
  }

  const link = document.createElement('link')
  link.id = 'dsfr-css'
  link.href = '/dsfr/dsfr.min.css'
  link.rel = 'stylesheet'
  link.type = 'text/css'
  document.body.appendChild(link)
}

const loadDsfrUtilityCss = () => {
  const existing = document.getElementById('dsfr-utility-css')
  if (existing) {
    return
  }

  const utilityLink = document.createElement('link')
  utilityLink.id = 'dsfr-utility-css'
  utilityLink.href = '/dsfr/utility/utility.min.css'
  utilityLink.rel = 'stylesheet'
  utilityLink.type = 'text/css'

  document.body.appendChild(utilityLink)
}

export const decorators = [
  (Story) => {
    const isSetup = useRef(false)
    if (!isSetup.current) {
      loadDsfrJs()
      loadDsfrCss()
      loadDsfrUtilityCss()
      isSetup.current = true
    }
    return <Story />
  },
]
