import { generateTVURL, generateADXURL } from '@/lib/utils'

export async function scrapePageFinancials(ticker: string) {
  const url = generateTVURL(ticker)

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_APP || 'http://localhost:3000/api/tv-scrapper',
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
    console.error('Error:', (error as Error).message)
    return 'Vercel timeout error. Please setup project locally'
  }
}

export async function scrapePageOverview(ticker: string) {
  const url = generateADXURL(ticker)

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_APP || 'http://localhost:3000/api/adx-scrapper',
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
    console.error('Error:', (error as Error).message)
    return 'Vercel timeout error. Please setup project locally'
  }
}
