import { test, expect } from '@playwright/test'

test('homepage has title and links to projects page', async ({ page }) => {
  await page.goto('./')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Mon Suivi Social/)

  // create a locator
  const loginButton = page.getByRole('link', { name: 'Se connecter' })

  // Expect an attribute "to be strictly equal" to the value.
  await expect(loginButton).toHaveAttribute('href', '/connexion/login')

  // Click the get started link.
  await loginButton.click()

  // Expects the URL to contain intro.
  await expect(page).toHaveURL('./connexion/login')

  // TODO expand this test
})
