import 'client-only'

const loadedScripts = new Set<string>()

export function loadScript(
  url: string,
  options?: { nomodule?: boolean },
): Promise<void> {
  const nomodule = !!options?.nomodule
  if (loadedScripts.has(url)) {
    return Promise.resolve()
  }
  loadedScripts.add(url)
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    if (nomodule) {
      script.setAttribute('nomodule', '')
    }

    script.onload = function () {
      resolve()
    }

    script.src = url
    document.body.appendChild(script)
  })
}
