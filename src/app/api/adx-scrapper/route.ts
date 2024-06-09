import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

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

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()
    console.log('Navigating to URL:', url)
    await page.goto(url, { waitUntil: 'networkidle2' })

    await new Promise((r) => setTimeout(r, 5000))

    const extractedText = await page.$eval('.content-inner', (el: any) => el.innerText)
    console.log('Extracted Text:', extractedText)

    if (browser) {
      await browser.close()
    }

    return NextResponse.json({ extractedText })
  } catch (error) {
    if (browser) {
      await browser.close()
    }
    console.error('Error occurred:', error)
    return NextResponse.json({ error })
  }
}