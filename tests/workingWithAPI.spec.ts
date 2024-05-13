import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json'
import { request } from 'http';

test.beforeEach(async ({ page }) => {
  await page.route('*.**/api/tag', async route => {
    await route.fulfill({
      body: JSON.stringify(tags)
    })
  })
  await page.goto('https://conduit.bondaracademy.com/');
})

test('Has title', async ({ page }) => {
  await page.route('*/**/api/articles*', async route => {
    const response = await route.fetch()
    const responsBody = await response.json()
    responsBody.articles[0].title = "This is a test title"
    responsBody.articles[0].description = "This is a test description"

    await route.fulfill({
      body: JSON.stringify(responsBody)
    })
  })

  await page.getByText('Global feed').click()
  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  await expect(page.locator('app-article-list h1').first()).toContainText('This is a test title')
  await expect(page.locator('app-article-list p').first()).toContainText('This is a test description')
});

test('Delete artical', async ({ page, request }) => {
  const articalResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article": { "title": "This is title", "description": "This is description", "body": "body", "tagList": [] }
    },
  })
  expect(articalResponse.status()).toEqual(201)

  await page.getByText('Global Feed').click()
  await page.getByText('This is title').click()
  await page.getByRole('button', { name: "Delete Article" }).first().click()

  await expect(page.locator('app-article-list p').first()).not.toContainText('This is test title')
});

test('Create artical', async ({ page, request }) => {
  await page.getByText('New Article').click()
  await page.getByRole('textbox', { name: 'Article Title' }).fill("Artical title")
  await page.getByRole('textbox', { name: 'What\'s this article about?' }).fill("About description")
  await page.getByRole('textbox', { name: 'Write your article (in markdown)' }).fill("Write your article")
  await page.getByRole('button', { name: ' Publish Article ' }).click()
  const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
  const articleResponseBody = await articleResponse.json()
  const slugId = articleResponseBody.article.slug

  await expect(page.locator('app-article-page h1').first()).toContainText('Artical title')
  await page.getByText('Home').click()
  await page.getByText('Global Feed').click()

  await expect(page.locator('app-article-list p').first()).not.toContainText('Artical title')

  const deleteArticalResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`)
  expect(deleteArticalResponse.status()).toEqual(204)
});
