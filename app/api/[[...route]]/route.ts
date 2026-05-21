import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

// 이 부분이 핵심! 나중에 프론트에서 이 타입을 그대로 수입해서 씁니다.
export const runtime = 'edge'

const app = new Hono().basePath('/api')
const taskSchema = z.object({
  title: z.string().min(1, "제목은 필수"),
  status: z.enum(['todo', 'doing', 'done']).default('todo')
})

const routes = app.post(
  '/tasks',
  zValidator('json', taskSchema),
  async (c) => {
    const { title, status } = c.req.valid('json')
    return c.json({ message: 'task created!', data: { title, status } }, 201)
  }
).post('/chat', async (c) => {
  const { messages } = await c.req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages,
  });

  return result.toDataStreamResponse();
})
.get('/hello', (c) => {
  return c.json({
    message: " hello",
    count: 2024,
    status: "success"
  })
})

.get('/test', (c) => {
  return c.json({
      title: "GNU",
      location: "경상국립대학교",
      status: "activated",
      participants: 20
  })
})

// 타입 공유를 위해 export
export type AppType = typeof routes

export const GET = handle(app)
export const POST = handle(app)
