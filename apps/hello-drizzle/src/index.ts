import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { db } from './db'

// import db from './db'

const app = new Hono()

app.get('/', (c) => {
    return c.text('Hello Hono!')
})

app.get('/users', async (c) => {
    try {
        const data = await db.query.users.findMany({
            columns: {
                name: true,
                email: true,
            },
        });
        return c.json(data)
    } catch (error) {
        return c.json(error);
    }
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
    fetch: app.fetch,
    port
})
