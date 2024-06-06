'use client'

import Link from 'next/link'
import {
  Activity,
  AlignHorizontalDistributeCenter,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useCallback, useEffect, useState } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { scrapePageFinancials, scrapePageOverview } from '@/lib/scrapper'
import { parseFinancials } from '@/lib/parseFinancials'
import { parseOverviewToJSON } from '@/lib/parseOverview'
import { generateADXURL, generateTVURL } from '@/lib/utils'

export default function Dashboard() {
  const [open, setOpen] = useState(false)
  const [extractedFinancials, setExtractedFinancials] = useState('')
  const [extractedOverview, setExtractedOverview] = useState('')
  const [ticker, setTicker] = useState('')
  const [url, setURL] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  useEffect(() => {
    setURL(generateTVURL(ticker))
  }, [ticker])

  const handleSelect = async (ticker: string) => {
    if (loading || ticker === '') return
    setTicker(ticker)
    setLoading(true)
    console.log('Selected:', ticker)
    const extractedFinance = await scrapePageFinancials(ticker)
    const extractedOver = await scrapePageOverview(ticker)
    setExtractedFinancials(extractedFinance)
    setExtractedOverview(extractedOver)
    setLoading(false)
  }

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  interface Valuation {
    MarketCapitalization: string
    EnterpriseValueMRQ: string
    EnterpriseValueEBITDATTM: string
    TotalSharesOutstanding: string
    NumberOfEmployees: string
    NumberOfShareholders: string
    PriceToEarningsRatioTTM: string
    PriceToRevenueRatioTTM: string
    PriceToBookFY: string
    PriceToSalesFY: string
    BalanceSheet: string
    QuickRatioMRQ: string
    CurrentRatioMRQ: string
    DebtToEquityRatioMRQ: string
    NetDebtMRQ: string
    TotalDebtMRQ: string
    TotalAssetsMRQ: string
  }

  interface OperatingMetrics {
    ReturnOnAssetsTTM: string
    ReturnOnEquityTTM: string
    ReturnOnInvestedCapitalTTM: string
    RevenuePerEmployeeFY: string
  }

  interface PriceHistory {
    AverageVolume10Day: string
    OneYearBeta: string
    FiftyTwoWeekHigh: string
    FiftyTwoWeekLow: string
  }

  interface Dividends {
    DividendsPaidFY: string
    DividendYieldForward: string
    DividendsPerShareFY: string
  }

  interface Margins {
    NetMarginTTM: string
    GrossMarginTTM: string
    OperatingMarginTTM: string
    PretaxMarginTTM: string
  }

  interface IncomeStatement {
    BasicEPSFY: string
    BasicEPSTTM: string
    EPSDilutedFY: string
    NetIncomeFY: string
    EBITDATTM: string
    GrossProfitMRQ: string
    GrossProfitFY: string
    LastYearRevenueFY: string
    TotalRevenueFY: string
    FreeCashFlowTTM: string
  }

  interface CompanyData {
    Valuation?: Valuation
    OperatingMetrics?: OperatingMetrics
    PriceHistory?: PriceHistory
    Dividends?: Dividends
    Margins?: Margins
    IncomeStatement?: IncomeStatement
  }

  interface CompanyDataProps {
    data: CompanyData
  }

  const CompanyDataComponent: React.FC<CompanyDataProps> = ({ data }) => {
    return (
      <div className="w-full space-y-2">
        <h1>Company Data</h1>
        <h2>Valuation</h2>
        <p>
          <strong>Market Capitalization:</strong> {data.Valuation?.MarketCapitalization}
        </p>
        <p>
          <strong>Enterprise Value (MRQ):</strong> {data.Valuation?.EnterpriseValueMRQ}
        </p>
        <p>
          <strong>Enterprise Value/EBITDA (TTM):</strong> {data.Valuation?.EnterpriseValueEBITDATTM}
        </p>
        <p>
          <strong>Total Shares Outstanding:</strong> {data.Valuation?.TotalSharesOutstanding}
        </p>
        <p>
          <strong>Number of Employees:</strong> {data.Valuation?.NumberOfEmployees}
        </p>
        <p>
          <strong>Number of Shareholders:</strong> {data.Valuation?.NumberOfShareholders}
        </p>
        <p>
          <strong>Price to Earnings Ratio (TTM):</strong> {data.Valuation?.PriceToEarningsRatioTTM}
        </p>
        <p>
          <strong>Price to Revenue Ratio (TTM):</strong> {data.Valuation?.PriceToRevenueRatioTTM}
        </p>
        <p>
          <strong>Price to Book (FY):</strong> {data.Valuation?.PriceToBookFY}
        </p>
        <p>
          <strong>Price to Sales (FY):</strong> {data.Valuation?.PriceToSalesFY}
        </p>
        <p>
          <strong>Balance Sheet:</strong> {data.Valuation?.BalanceSheet}
        </p>
        <p>
          <strong>Quick Ratio (MRQ):</strong> {data.Valuation?.QuickRatioMRQ}
        </p>
        <p>
          <strong>Current Ratio (MRQ):</strong> {data.Valuation?.CurrentRatioMRQ}
        </p>
        <p>
          <strong>Debt to Equity Ratio (MRQ):</strong> {data.Valuation?.DebtToEquityRatioMRQ}
        </p>
        <p>
          <strong>Net Debt (MRQ):</strong> {data.Valuation?.NetDebtMRQ}
        </p>
        <p>
          <strong>Total Debt (MRQ):</strong> {data.Valuation?.TotalDebtMRQ}
        </p>
        <p>
          <strong>Total Assets (MRQ):</strong> {data.Valuation?.TotalAssetsMRQ}
        </p>

        <h2>Operating Metrics</h2>
        <p>
          <strong>Return on Assets (TTM):</strong> {data.OperatingMetrics?.ReturnOnAssetsTTM}
        </p>
        <p>
          <strong>Return on Equity (TTM):</strong> {data.OperatingMetrics?.ReturnOnEquityTTM}
        </p>
        <p>
          <strong>Return on Invested Capital (TTM):</strong>{' '}
          {data.OperatingMetrics?.ReturnOnInvestedCapitalTTM}
        </p>
        <p>
          <strong>Revenue per Employee (FY):</strong> {data.OperatingMetrics?.RevenuePerEmployeeFY}
        </p>

        <h2>Price History</h2>
        <p>
          <strong>Average Volume (10 day):</strong> {data.PriceHistory?.AverageVolume10Day}
        </p>
        <p>
          <strong>1-Year Beta:</strong> {data.PriceHistory?.OneYearBeta}
        </p>
        <p>
          <strong>52 Week High:</strong> {data.PriceHistory?.FiftyTwoWeekHigh}
        </p>
        <p>
          <strong>52 Week Low:</strong> {data.PriceHistory?.FiftyTwoWeekLow}
        </p>

        <h2>Dividends</h2>
        <p>
          <strong>Dividends Paid (FY):</strong> {data.Dividends?.DividendsPaidFY}
        </p>
        <p>
          <strong>Dividend Yield Forward:</strong> {data.Dividends?.DividendYieldForward}
        </p>
        <p>
          <strong>Dividends per Share (FY):</strong> {data.Dividends?.DividendsPerShareFY}
        </p>

        <h2>Margins</h2>
        <p>
          <strong>Net Margin (TTM):</strong> {data.Margins?.NetMarginTTM}
        </p>
        <p>
          <strong>Gross Margin (TTM):</strong> {data.Margins?.GrossMarginTTM}
        </p>
        <p>
          <strong>Operating Margin (TTM):</strong> {data.Margins?.OperatingMarginTTM}
        </p>
        <p>
          <strong>Pretax Margin (TTM):</strong> {data.Margins?.PretaxMarginTTM}
        </p>

        <h2>Income Statement</h2>
        <p>
          <strong>Basic EPS (FY):</strong> {data.IncomeStatement?.BasicEPSFY}
        </p>
        <p>
          <strong>Basic EPS (TTM):</strong> {data.IncomeStatement?.BasicEPSTTM}
        </p>
        <p>
          <strong>EPS Diluted (FY):</strong> {data.IncomeStatement?.EPSDilutedFY}
        </p>
        <p>
          <strong>Net Income (FY):</strong> {data.IncomeStatement?.NetIncomeFY}
        </p>
        <p>
          <strong>EBITDA (TTM):</strong> {data.IncomeStatement?.EBITDATTM}
        </p>
        <p>
          <strong>Gross Profit (MRQ):</strong> {data.IncomeStatement?.GrossProfitMRQ}
        </p>
        <p>
          <strong>Gross Profit (FY):</strong> {data.IncomeStatement?.GrossProfitFY}
        </p>
        <p>
          <strong>Last Year Revenue (FY):</strong> {data.IncomeStatement?.LastYearRevenueFY}
        </p>
        <p>
          <strong>Total Revenue (FY):</strong> {data.IncomeStatement?.TotalRevenueFY}
        </p>
        <p>
          <strong>Free Cash Flow (TTM):</strong> {data.IncomeStatement?.FreeCashFlowTTM}
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <AlignHorizontalDistributeCenter className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <Link
            href="/scrapper"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Scrapper
          </Link>
          <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
            Screenshoter
          </Link>
          <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
            Charts
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link href="" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                <AlignHorizontalDistributeCenter className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link
                href="/scrapper"
                className="text-foreground transition-colors hover:text-foreground"
              >
                Scrapper
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Screenshoter
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Charts
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Button variant="outline" className="flex space-x-2" onClick={() => setOpen(true)}>
                <Search className="h-4 w-4 text-muted-foreground" />
                <span>Enter ADX ticker</span>
                <p className="text-xs text-muted-foreground">
                  Press{' '}
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </p>
              </Button>
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">+180.1% from last month</p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">+19% from last month</p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">+201 since last hour</p>
            </CardContent>
          </Card>
        </div>
        <section className="flex space-x-20 justify-start">
          <div>
            <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Overview</h3>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              <li>Name</li>
              <li>Sector</li>
              <li>Listing date</li>
              <li>Symbol on ADX</li>
              <li>Incorporation</li>
              <li>Share capital</li>
            </ul>

            <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
              Key Shareholders
            </h3>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              <li>Emirates International Investment Company LLC</li>
              <li>Emirates National Bank of Dubai PJSC</li>
              <li>Other investors</li>
            </ul>

            <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
              Stock Ownership
            </h3>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              <li>Foreign Ownership</li>
              <li>GCC Nationals</li>
              <li>UAE Nationals</li>
              <li>Arab Countries</li>
            </ul>

            <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
              Key Statistics
            </h3>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              <li>P/E Excl. Extra Items (TTM)</li>
              <li>Price To Sales (TTM)</li>
              <li>Price To Book (Quarterly)</li>
              <li>Price To Cash Flow Per Share (TTM)</li>
              <li>Debt/Total Equity (Quarterly)</li>
              <li>Long Term Debt/Equity (Quarterly)</li>
              <li>Return On Equity (TTM)</li>
            </ul>

            <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Growth</h3>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              <li>Revenue Growth (Quarterly YoY)</li>
              <li>Revenue Growth Rate (5Y)</li>
              <li>EPS Growth (TTM YoY)</li>
              <li>EPS Growth Rate (5Y)</li>
              <li>EPS Growth (Quarterly YoY)</li>
            </ul>

            <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Dividends</h3>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              <li>Dividend per share (annual)</li>
              <li>Average yield %</li>
            </ul>

            <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
              Highs & Lows (AED)
            </h3>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              <li>52 Week High</li>
              <li>52 Week Low</li>
            </ul>

            <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
              Periodical Return (%)
            </h3>
          </div>
          <div className="flex-2 flex flex-col items-start min-w-xl space-y-3">
            <div>
              <h1>{parseOverviewToJSON(extractedOverview).Name}</h1>
              <p>
                <strong>Symbol on ADX:</strong> {parseOverviewToJSON(extractedOverview).SymbolOnADX}
              </p>
              <p>
                <strong>Sector:</strong> {parseOverviewToJSON(extractedOverview).Sector}
              </p>
              <p>
                <strong>Listing Date:</strong> {parseOverviewToJSON(extractedOverview).ListingDate}
              </p>
              <p>
                <strong>Incorporation:</strong>{' '}
                {parseOverviewToJSON(extractedOverview).Incorporation}
              </p>
              <p>
                <strong>Share Capital:</strong>{' '}
                {parseOverviewToJSON(extractedOverview).ShareCapital}
              </p>
              <p>
                <strong>Company Type:</strong> {parseOverviewToJSON(extractedOverview).CompanyType}
              </p>
              <p>
                <strong>Foreign Ownership:</strong>{' '}
                {parseOverviewToJSON(extractedOverview).ForeignOwnership}
              </p>
              <p>
                <strong>GCC Nationals:</strong>{' '}
                {parseOverviewToJSON(extractedOverview).GCCNationals}
              </p>
              <p>
                <strong>UAE Nationals:</strong>{' '}
                {parseOverviewToJSON(extractedOverview).UAENationals}
              </p>
              <p>
                <strong>Arab Countries:</strong>{' '}
                {parseOverviewToJSON(extractedOverview).ArabCountries}
              </p>
              <p>
                <strong>Website:</strong>{' '}
                <a
                  href={parseOverviewToJSON(extractedOverview).Website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {parseOverviewToJSON(extractedOverview).Website}
                </a>
              </p>
            </div>
            <div>
              <CompanyDataComponent data={parseFinancials(extractedFinancials)} />
            </div>
            {extractedFinancials !== '' && !loading && (
              <div>
                <iframe src={url} width="100%" height="700" frameBorder="0"></iframe>
              </div>
            )}
          </div>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem
                  onSelect={() => runCommand(() => handleSelect('FAB'))}
                  className="cursor-pointer"
                >
                  FAB
                </CommandItem>
                <CommandItem
                  onSelect={() => runCommand(() => handleSelect('ADIB'))}
                  className="cursor-pointer"
                >
                  ADIB
                </CommandItem>
                <CommandItem
                  onSelect={() => runCommand(() => handleSelect('ADNOCDIST'))}
                  className="cursor-pointer"
                >
                  ADNOCDIST
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </section>
      </main>
    </div>
  )
}
