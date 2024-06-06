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
import Navigation from '@/components/Navigation'
import PieChart from '@/components/chart/PieChart'
import BarChart from '@/components/chart/BarChart'
import LineChart from '@/components/chart/LineChart'

import data from '@/lib/mock.json'

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

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navigation />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-6">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Name</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-medium">{data.overview.name}</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Symbol on ADX</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-medium">{data.overview.symbolOnADX}</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sector</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-medium">{data.overview.sector}</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Incorporation</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-medium">{data.overview.incorporation}</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Listing Date</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-medium">{data.overview.listing}</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Share Capital</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-medium">{data.overview.sharecapital}</div>
            </CardContent>
          </Card>
        </div>
        <section>
          <div>
            <h1>Abu Dhabi Islamic Bank Overview</h1>
            <PieChart data={data.keyShareholders} title="Key Shareholders" />
            <PieChart data={data.stockOwnership} title="Stock Ownership" />
            <BarChart data={data.dividends} title="Dividends" xKey="year" yKey="dividend" />
            <LineChart
              data={data.periodicalReturn}
              title="Periodical Return (%)"
              xKey="year"
              yKey="value"
            />
            <div>
              <h3>Key Statistics</h3>
              <p>P/E Ratio: {data.keyStatistics.peRatio}</p>
              <p>Price to Sales: {data.keyStatistics.priceToSales}</p>
              <p>Price to Book: {data.keyStatistics.priceToBook}</p>
              <p>Price to Cash Flow: {data.keyStatistics.priceToCashFlow}</p>
              <p>Debt/Total Equity: {data.keyStatistics.debtToEquity}</p>
              <p>Long Term Debt/Equity: {data.keyStatistics.longTermDebtToEquity}</p>
              <p>Return on Equity: {data.keyStatistics.returnOnEquity}</p>
            </div>
            <div>
              <h3>Growth</h3>
              <p>Revenue Growth (Quarterly YoY): {data.growth.revenueGrowthYoY}</p>
              <p>Revenue Growth Rate (5Y): {data.growth.revenueGrowth5Y}</p>
              <p>EPS Growth (Quarterly YoY): {data.growth.epsGrowthYoY}</p>
              <p>EPS Growth (TTM YoY): {data.growth.epsGrowthTTM}</p>
              <p>EPS Growth Rate (5Y): {data.growth.epsGrowth5Y}</p>
              <p>EPS Growth Rate (3Y): {data.growth.epsGrowth3Y}</p>
            </div>
            <div>
              <h3>Highs & Lows (AED)</h3>
              <p>52 Week High: {data.highsLows.high}</p>
              <p>52 Week Low: {data.highsLows.low}</p>
            </div>
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
