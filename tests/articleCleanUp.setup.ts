import { test as setup, expect } from '@playwright/test';

setup('Delete new article', async ({ request }) => {
    const deleteArticalResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUGID}`)
    expect(deleteArticalResponse.status()).toEqual(204)
})