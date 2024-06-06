'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { generateURL } from '@/lib/utils'
import { useState } from 'react'

export default function Form() {
  const [ticker, setUrl] = useState<string>('')
  const [load, setLoad] = useState(false)
  const [err, setErr] = useState<any>(null)
  const [extractedText, setExtractedText] = useState<string>('')

  const update = (e: any) => {
    setUrl(e.target.value)
  }

  const send = async () => {
    setLoad(true)
    if (err) {
      setLoad(false)
      return
    }

    const url = generateURL(ticker)

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
        setExtractedText(data.extractedText)
      } else {
        if (data.urlerror) {
          setErr(data.urlerror)
        } else {
          setErr('URL cannot be loaded')
        }

        setTimeout(() => {
          setErr(null)
        }, 3000)
      }
      setLoad(false)
    } catch (error: any) {
      console.error('Error:', error.message)
      setErr('Vercel timeout error. Please setup project locally')
      setTimeout(() => {
        setErr(null)
      }, 3000)
      setLoad(false)
    }
  }

  return (
    <section className="w-screen h-screen flex justify-between items-start space-x-14 p-24">
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
        {extractedText && (
          <div className="w-full mt-4 p-4 border border-gray-300 rounded">
            <h5 className="font-semibold">Extracted Text:</h5>
            <p>{extractedText || err}</p>
          </div>
        )}
      </div>
    </section>
  )
}
