import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
    return c.text('Hello Hono!')
})
//
// app.get('/users', async (c) => {
//     try {
//         const data = await db.query.users.findMany({
//             columns: {
//                 createdAt: false,
//                 updatedAt: false
//             },
//         });
//         return c.json(data)
//     } catch (error) {
//         return c.json(error);
//     }
// })
//
//
// app.get('/users/:id', async (c) => {
//     try {
//         const id = c.req.param('id');
//         const data = await db.query.users.findFirst({
//             where: (user, { eq }) => eq(user.id, id),
//             columns: {
//                 createdAt: false,
//                 updatedAt: false,
//             }
//         })
//
//         return c.json(data)
//     } catch (error) {
//         return c.json(error)
//     }
// })


const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
    fetch: app.fetch,
    port
})
