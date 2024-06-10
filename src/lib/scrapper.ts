import { generateTVURL, generateADXURL } from '@/lib/utils'

export async function scrapePageFinancials(ticker: string) {
  const url = generateTVURL(ticker)

  try {
    const response = await fetch('/api/tv-scrapper', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ url }),
    })

    const data = await response.json()

    console.log('data', data.financials)

    if (data.financials) {
      return data.financials
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
    const response = await fetch('/api/adx-scrapper', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ url }),
    })

    const data = await response.json()
    console.log('data', data)

    if (data['TICKER']) {
      return data['TICKER']
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
