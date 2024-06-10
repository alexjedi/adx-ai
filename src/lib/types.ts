interface DataOverview {
  name: string
  logo: string
  symbolOnADX: string
  sector: string
  incorporation: string
  listing: string
  sharecapital: string
  price: string
  description: string
}

interface DataKeyShareholder {
  name: string
  value: number
}

interface DataStockOwnership {
  name: string
  value: number
}

interface DataKeyStatistics {
  peRatio: number
  priceToSales: number
  priceToBook: number
  priceToCashFlow: number
  debtToEquity: number
  longTermDebtToEquity: number
  returnOnEquity: number
}

interface DataGrowth {
  revenueGrowthYoY: number
  revenueGrowth5Y: number
  epsGrowthYoY: number
  epsGrowthTTM: number
  epsGrowth5Y: number
  epsGrowth3Y: number
}

interface DataDividend {
  year: number
  dividend: number
  yield: number
}

interface DataHighsLows {
  high: number
  low: number
}

interface DataPeriodicalReturn {
  name: string
  totalReturn: number
  'ADIB Stock': number
  'Return on Reinvested Dividends': number
}

interface DataValuation {
  'Market Capitalization': string
  'Enterprise Value (MRQ)': string
  'Enterprise Value/EBITDA (TTM)': string | null
  'Total Shares Outstanding': string
  'Number of Employees': string | null
  'Number of Shareholders': string | null
  'Price to Earnings Ratio (TTM)': string
  'Price to Revenue Ratio (TTM)': string
  'Price to Book (FY)': string
  'Price to Sales (FY)': string
}

interface DataBalanceSheet {
  'Quick Ratio (MRQ)': string
  'Current Ratio (MRQ)': string
  'Debt to Equity Ratio (MRQ)': string
  'Net Debt (MRQ)': string
  'Total Debt (MRQ)': string
  'Total Assets (MRQ)': string
}

interface DataOperatingMetrics {
  'Return on Assets (TTM)': string
  'Return on Equity (TTM)': string
  'Return on Invested Capital (TTM)': string
  'Revenue per Employee (FY)': string | null
}

interface DataPriceHistory {
  'Average Volume (10 day)': string
  '1-Year Beta': string
  '52 Week High': string
  '52 Week Low': string
}

interface DataDividends {
  'Dividends Paid (FY)': string
  'Dividend Yield Forward': string
  'Dividends per Share (FY)': string
}

interface DataMargins {
  'Net Margin (TTM)': string
  'Gross Margin (TTM)': string | null
  'Operating Margin (TTM)': string
  'Pretax Margin (TTM)': string
}

interface DataIncomeStatement {
  'Basic EPS (FY)': string
  'Basic EPS (TTM)': string
  'EPS Diluted (FY)': string
  'Net Income (FY)': string
  'EBITDA (TTM)': string | null
  'Gross Profit (MRQ)': string | null
  'Gross Profit (FY)': string | null
  'Last Year Revenue (FY)': string
  'Total Revenue (FY)': string
  'Free Cash Flow (TTM)': string
}

interface DataFinancials {
  valuation: DataValuation
  'balance sheet': DataBalanceSheet
  'operating metrics': DataOperatingMetrics
  'price history': DataPriceHistory
  dividends: DataDividends
  margins: DataMargins
  'income statement': DataIncomeStatement
}

export interface Data {
  overview: DataOverview
  keyShareholders: DataKeyShareholder[]
  stockOwnership: DataStockOwnership[]
  keyStatistics: DataKeyStatistics
  growth: DataGrowth
  dividends: DataDividend[]
  highsLows: DataHighsLows
  periodicalReturn: DataPeriodicalReturn[]
  financials: DataFinancials
}
