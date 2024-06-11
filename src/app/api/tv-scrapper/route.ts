// @ts-nocheck

import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

const CHROMIUM_PATH =
  'https://vomrghiulbmrfvmhlflk.supabase.co/storage/v1/object/public/chromium-pack/chromium-v123.0.0-pack.tar'

async function getBrowser() {
  console.log('Current VERCEL_ENV:', process.env.VERCEL_ENV)
  if (process.env.VERCEL_ENV === 'production' || process.env.VERCEL_ENV === 'preview') {
    const chromium = await import('@sparticuz/chromium-min').then((mod) => mod.default)

    const puppeteerCore = await import('puppeteer-core').then((mod) => mod.default)

    const executablePath = await chromium.executablePath(CHROMIUM_PATH)

    const browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    })
    return browser
  } else {
    const puppeteer = await import('puppeteer').then((mod) => mod.default)

    const browser = await puppeteer.launch()
    return browser
  }
}

export async function POST(request: Request) {
  console.log('POST request received')
  let browser
  try {
    const { url } = await request.json()
    console.log('URL received:', url)

    const urlRegex = /^(http|https):\/\/[^ "]+$/

    if (!urlRegex.test(url)) {
      return NextResponse.json({ urlerror: 'invalid url' })
    }

    const browser = await getBrowser()

    const page = await browser.newPage()
    console.log('Navigating to URL:', url)
    await page.goto(url, { waitUntil: 'networkidle2' })

    await new Promise((r) => setTimeout(r, 2000))

    const financials = await page.evaluate(() => {
      const data = {
        financials: {
          valuation: {},
          'balance sheet': {},
          'operating metrics': {},
          'price history': {},
          dividends: {},
          margins: {},
          'income statement': {},
        },
      }

      const sectionMapping = {
        Valuation: 'valuation',
        '     Balance Sheet     ': 'balance sheet',
        'Operating Metrics': 'operating metrics',
        'Price History': 'price history',
        Dividends: 'dividends',
        Margins: 'margins',
        'Income Statement': 'income statement',
      }

      const sections = document.querySelectorAll('.tv-widget-fundamentals__item')

      sections.forEach((section) => {
        const titleElement = section.querySelector('.tv-widget-fundamentals__title')
        if (titleElement) {
          const titleText = titleElement.textContent.trim()
          const mappedTitle = sectionMapping[titleText]

          if (mappedTitle) {
            const rows = section.querySelectorAll('.tv-widget-fundamentals__row')

            rows.forEach((row) => {
              const labelElement = row.querySelector('.tv-widget-fundamentals__label')
              const valueElement = row.querySelector('.tv-widget-fundamentals__value')
              if (labelElement && valueElement) {
                const label = labelElement.textContent.trim()
                const value = valueElement.textContent.trim()
                if (data.financials[mappedTitle]) {
                  data.financials[mappedTitle][label] = value
                }
              }
            })
          }
        }
      })

      return data
    })

    if (browser) {
      await browser.close()
    }

    return NextResponse.json(financials)
  } catch (error) {
    if (browser) {
      await browser.close()
    }
    console.error('Error occurred:', error)
    return NextResponse.json({ error })
  }
}
