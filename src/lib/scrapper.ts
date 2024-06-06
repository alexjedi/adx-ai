import { generateURL } from '@/lib/utils'

export async function scrapePage(ticker: string) {
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

    const data = await response.json()

    if (data.extractedText) {
      return data.extractedText
    } else if (data.urlerror) {
      return data.urlerror
    } else {
      return 'URL cannot be loaded'
    }
  } catch (error) {
    console.error('Error:', error.message)
    return 'Vercel timeout error. Please setup project locally'
  }
}
