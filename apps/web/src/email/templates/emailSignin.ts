export const emailSignin = {
  text: ({ url, host }: { host: string; url: string }): string => {
    return `Pour se connecter à Mon Suivi Social, merci d'utiliser le lien suivant :\n${url}\n\n`
  },
  mjml: ({ url, host }: { host: string; url: string }): string => {
    return `
<mjml>
  <mj-body>
    <mj-section >
      <mj-column>
        <mj-text
          font-style="bold"
          font-size="${24}px"
        >
          Connexion à Mon Suivi Social
        </mj-text>
        <mj-text>
         Voici votre lien de connexion sécurisé à usage unique :
        </mj-text>
        <mj-button background-color="#000091" color="white" href="${url}">
          Se connecter
        </mj-button>
        <mj-text>
          Si vous n'avez pas demandé à recevoir cet email, vous pouvez l'ignorer en toute sécurité.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
  },
}
