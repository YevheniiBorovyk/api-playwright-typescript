import { test as setup, expect } from '@playwright/test';

setup('create new article', async ({ request }) => {
    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
            "article": { "title": "Like test article11", "description": "This is description", "body": "body", "tagList": [] }
        },
    })
    expect(articleResponse.status()).toEqual(201)
    const response  = await articleResponse.json()
    const slugId = response.article.slug
    process.env['SLUGID'] = slugId
})