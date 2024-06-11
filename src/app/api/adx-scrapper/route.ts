// @ts-nocheck

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

    await new Promise((r) => setTimeout(r, 3000))

    const financials = await page.evaluate(() => {
      const data = {
        TICKER: {
          overview: {
            name: '',
            url: '',
            symbolOnADX: '',
            sector: '',
            incorporation: '',
            listing: '',
            sharecapital: '',
            price: '',
            description: '',
          },
          keyShareholders: [
            { name: '', value: '' },
            { name: '', value: '' },
            { name: '', value: '' },
          ],
          stockOwnership: [
            { name: '', value: '' },
            { name: '', value: '' },
            { name: '', value: '' },
            { name: '', value: '' },
          ],
          keyStatistics: {
            peRatio: '',
            priceToSales: '',
            priceToBook: '',
            priceToCashFlow: '',
            debtToEquity: '',
            longTermDebtToEquity: '',
            returnOnEquity: '',
          },
          growth: {
            revenueGrowthYoY: '',
            revenueGrowth5Y: '',
            epsGrowthYoY: '',
            epsGrowthTTM: '',
            epsGrowth5Y: '',
            epsGrowth3Y: '',
          },
          dividends: [
            { year: '', dividend: '', yield: '' },
            { year: '', dividend: '', yield: '' },
            { year: '', dividend: '', yield: '' },
            { year: '', dividend: '', yield: '' },
            { year: '', dividend: '', yield: '' },
          ],
          highsLows: {
            high: '',
            low: '',
          },
          periodicalReturn: [
            {
              name: '',
              totalReturn: '',
              'ADIB Stock': '',
              'Return on Reinvested Dividends': '',
            },
            {
              name: '',
              totalReturn: '',
              'ADIB Stock': '',
              'Return on Reinvested Dividends': '',
            },
            {
              name: '',
              totalReturn: '',
              'ADIB Stock': '',
              'Return on Reinvested Dividends': '',
            },
          ],
          financials: {
            valuation: {
              'Market Capitalization': '',
              'Enterprise Value (MRQ)': '',
              'Enterprise Value/EBITDA (TTM)': '',
              'Total Shares Outstanding': '',
              'Number of Employees': '',
              'Number of Shareholders': '',
              'Price to Earnings Ratio (TTM)': '',
              'Price to Revenue Ratio (TTM)': '',
              'Price to Book (FY)': '',
              'Price to Sales (FY)': '',
            },
            'balance sheet': {
              'Quick Ratio (MRQ)': '',
              'Current Ratio (MRQ)': '',
              'Debt to Equity Ratio (MRQ)': '',
              'Net Debt (MRQ)': '',
              'Total Debt (MRQ)': '',
              'Total Assets (MRQ)': '',
            },
            'operating metrics': {
              'Return on Assets (TTM)': '',
              'Return on Equity (TTM)': '',
              'Return on Invested Capital (TTM)': '',
              'Revenue per Employee (FY)': '',
            },
            'price history': {
              'Average Volume (10 day)': '',
              '1-Year Beta': '',
              '52 Week High': '',
              '52 Week Low': '',
            },
            dividends: {
              'Dividends Paid (FY)': '',
              'Dividend Yield Forward': '',
              'Dividends per Share (FY)': '',
            },
            margins: {
              'Net Margin (TTM)': '',
              'Gross Margin (TTM)': '',
              'Operating Margin (TTM)': '',
              'Pretax Margin (TTM)': '',
            },
            'income statement': {
              'Basic EPS (FY)': '',
              'Basic EPS (TTM)': '',
              'EPS Diluted (FY)': '',
              'Net Income (FY)': '',
              'EBITDA (TTM)': '',
              'Gross Profit (MRQ)': '',
              'Gross Profit (FY)': '',
              'Last Year Revenue (FY)': '',
              'Total Revenue (FY)': '',
              'Free Cash Flow (TTM)': '',
            },
          },
        },
      }

      data.TICKER.overview.sector = document
        .querySelector('.company-info .domain-name')
        .textContent.trim()
      data.TICKER.overview.symbolOnADX = document
        .querySelector('.company-info .c-symbol')
        .textContent.trim()
      data.TICKER.overview.incorporation = document
        .querySelector('.company-info2 li:nth-child(3) span:nth-child(2)')
        .textContent.trim()
      data.TICKER.overview.listing = document
        .querySelector('.company-info2 li:nth-child(2) span:nth-child(2)')
        .textContent.trim()
      data.TICKER.overview.sharecapital = document
        .querySelector('.company-info2 li:nth-child(1) span:nth-child(2)')
        .textContent.trim()
      data.TICKER.overview.description = document
        .querySelector('.company-info2 .desc')
        .textContent.trim()
      data.TICKER.overview.price = document
        .querySelector('.content-inner .box1 .num')
        .textContent.trim()

      data.TICKER.stockOwnership[0].name = 'Foreign Ownership'
      data.TICKER.stockOwnership[0].value = Number(
        document.querySelector('.company-boxes .box-item1 .per1').textContent.trim().slice(0, -1)
      )
      data.TICKER.stockOwnership[1].name = 'GCC Nationals'
      data.TICKER.stockOwnership[1].value = Number(
        document.querySelector('.company-boxes .box-item2 .per1').textContent.trim().slice(0, -1)
      )
      data.TICKER.stockOwnership[2].name = 'UAE Nationals'
      data.TICKER.stockOwnership[2].value = Number(
        document.querySelector('.company-boxes .box-item3 .per1').textContent.trim().slice(0, -1)
      )
      data.TICKER.stockOwnership[3].name = 'Arab Countries'
      data.TICKER.stockOwnership[3].value = Number(
        document.querySelector('.company-boxes .box-item4 .per1').textContent.trim().slice(0, -1)
      )

      const financials = data.TICKER.financials.valuation
      const map = {
        'Market Cap': 'Market Capitalization',
        'Enterprise Value (MRQ)': 'Enterprise Value (MRQ)',
        'Enterprise Value/EBITDA (TTM)': 'Enterprise Value/EBITDA (TTM)',
        'Shares Outstanding': 'Total Shares Outstanding',
        Employees: 'Number of Employees',
        Shareholders: 'Number of Shareholders',
        'PE Ratio (TTM)': 'Price to Earnings Ratio (TTM)',
        'Price to Revenue (TTM)': 'Price to Revenue Ratio (TTM)',
        'Price to Book (FY)': 'Price to Book (FY)',
        'Price to Sales (FY)': 'Price to Sales (FY)',
      }

      // document.querySelectorAll('.financials li').forEach((li) => {
      //   const label = li.querySelector('span:nth-child(1)').textContent.trim()
      //   const value = li.querySelector('span:nth-child(2)').textContent.trim()
      //   if (map[label]) {
      //     financials[map[label]] = value
      //   }
      // })

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
