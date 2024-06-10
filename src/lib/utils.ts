import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateTVURL(ticker: string) {
  const baseURL = 'https://www.tradingview.com/embed-widget/financials/?locale=en#'
  const params = {
    colorTheme: 'light',
    isTransparent: false,
    largeChartUrl: '',
    displayMode: 'regular',
    width: '100%',
    height: '100%',
    symbol: `ADX:${ticker}`,
    utm_source: 'www.tradingview.com',
    utm_medium: 'widget_new',
    utm_campaign: 'financials',
  }

  const urlParams = encodeURIComponent(JSON.stringify(params))
  return `${baseURL}${urlParams}`
}

export function generateADXURL(ticker: string) {
  const tickers: { [key: string]: string } = {
    FAB: 'AEN000101016',
    ADIB: 'AEA000801018',
    ADNOCDIST: 'AEA006101017',
  }

  const companyTitles = {
    FAB: 'First%20Abu%20Dhabi%20Bank',
    ADIB: 'Abu%20Dhabi%20Islamic%20Bank',
    ADNOCDIST: 'Abu%20Dhabi%20National%20Oil%20Company%20For%20Distribution',
  }

  const companyId = tickers[ticker]
  if (!companyId) {
    throw new Error(`Ticker ${ticker} not found`)
  }

  const baseURL =
    'https://www.adx.ae/English/Pages/ProductsAndServices/Securities/SelectCompany/default.aspx'
  const params = new URLSearchParams({
    listedcompanyid: companyId,
    pnavTitle: companyTitles[ticker as keyof typeof companyTitles],
  })

  return `${baseURL}?${params.toString()}`
}

export function formatPropertyValue(value: string): string {
  const num = parseFloat(value.replace(/,/g, ''))
  if (isNaN(num)) {
    throw new Error('Invalid number')
  }

  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B'
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M'
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K'
  } else {
    return num.toFixed(2)
  }
}
