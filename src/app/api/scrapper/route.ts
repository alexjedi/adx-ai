import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export async function POST(request: Request) {
  console.log('POST request received')
  let browser
  try {
    const { url } = await request.json()
    console.log('URL received:', url)

    const urlRegex = /^(http|https):\/\/[^ "]+$/

    https: if (!urlRegex.test(url)) {
      return NextResponse.json({ urlerror: 'invalid url' })
    }

    browser = await puppeteer.launch({
      headless: true, // Убедитесь, что браузер запущен в headless режиме
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Опции для Puppeteer
    })

    const page = await browser.newPage()
    console.log('Navigating to URL:', url)
    await page.goto(url, { waitUntil: 'networkidle2' })

    // Увеличьте время ожидания для загрузки динамического контента
    await new Promise((r) => setTimeout(r, 5000))

    const extractedText = await page.$eval('*', (el: any) => el.innerText)
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
