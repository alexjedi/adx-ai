import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateURL(ticker: string) {
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
