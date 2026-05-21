'use client'
import { useEffect, useState } from 'react'
import { client } from '@/lib/rpc'

export default function Home() {
  const [data, setData] = useState<string>('로딩 중...')

  useEffect(() => {
    const fetchData = async () => {
      // 기존 hello API 호출
      const resHello = await client.api.hello.$get()
      const jsonHello = (await resHello.json()) as { message: string }
      setData(jsonHello.message)

      // 새로운 test API 호출 및 console.log 확인
      const resTest = await client.api.test.$get()
      const jsonTest = await resTest.json()
      console.log('API 응답 데이터:', jsonTest)
    }
    fetchData()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-blue-600">{data}</h1>
      <p className="mt-4">이 데이터는 Bun + Hono 서버에서 광속으로 가져왔습니다.</p>
    </main>
  )
}
