import { request, expect } from "@playwright/test"

async function globalTeardown() {
    const context = await request.newContext()
    const deleteArticalResponse = await context.delete(`https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUGID}`, {
        headers: {
            Authorization: `Token ${process.env.ACCESS_TOKEN}`
        }
    })
    expect(deleteArticalResponse.status()).toEqual(204)
}

export default globalTeardown;