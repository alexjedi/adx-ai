// @ts-nocheck

import { NextResponse } from 'next/server'
import puppeteerCore from 'puppeteer-core'
import puppeteer from 'puppeteer'
import chromium from '@sparticuz/chromium'

export const dynamic = 'force-dynamic'

async function getBrowser() {
  if (process.env.VERCEL_ENV === 'production') {
    const executablePath = await chromium.executablePath()

    const browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    })
    return browser
  } else {
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
