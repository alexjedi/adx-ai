'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function Form() {
  const [url, seturl] = useState<string>('')
  const [load, setload] = useState(false)
  const [err, seterr] = useState<any>(null)
  const update = (e: any) => {
    seturl(e.target.value)
  }

  const send = async () => {
    setload(true)
    if (err) {
      setload(false)
      return
    }

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_APP || 'http://localhost:3000/api/scrapper',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        }
      )

      console.log('Request sent successfully!')
      const data = await response.json()
      if (data.extractedText) {
        const blob = new Blob([data.extractedText], { type: 'text/plain' })
        const url2 = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url2
        a.download = 'data.txt'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url2)
      } else {
        if (data.urlerror) {
          seterr(data.urlerror)
        } else {
          seterr('URL cannot be loaded')
        }

        setTimeout(() => {
          seterr(null)
        }, 3000)
      }
      setload(false)
    } catch (error: any) {
      console.error('Error:', error.message)
      seterr('Vercel timeout error. Please setup project locally')
      setTimeout(() => {
        seterr(null)
      }, 3000)
      setload(false)
    }
  }

  return (
    <section className="w-screen h-screen flex flex-col items-center justify-center space-y-20">
      <div className="flex flex-col w-full max-w-3xl space-y-4">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Scrap text (without AI parsing)
        </h4>
        <div className="flex items-center w-full space-x-3">
          <Input
            onChange={update}
            type="text"
            id="search"
            placeholder="https://www.example.com"
            className="w-full min-w-[180px]"
          />
          <Button onClick={send} type="button">
            {load ? 'Scrapping...' : 'Scrap Data'}
          </Button>
        </div>
      </div>
      <div className="flex flex-col w-full max-w-3xl space-y-4">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Scrap text (with AI parsing)
        </h4>
        <div className="flex items-center w-full space-x-3">
          <Input
            onChange={update}
            type="text"
            id="search"
            placeholder="https://www.example.com"
            className="w-full min-w-[180px]"
          />
          <Button onClick={send} type="button">
            {load ? 'Scrapping...' : 'Scrap Data'}
          </Button>
        </div>
      </div>
      <div className="flex flex-col w-full max-w-3xl space-y-4">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Screenshot (with AI parsing)
        </h4>
        <div className="flex items-center w-full space-x-3">
          <Input
            onChange={update}
            type="text"
            id="search"
            placeholder="https://www.example.com"
            className="w-full min-w-[180px]"
          />
          <Button onClick={send} type="button">
            {load ? 'Scrapping...' : 'Scrap Data'}
          </Button>
        </div>
      </div>
    </section>
  )
}
