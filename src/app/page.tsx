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
  PercentSquare,
  Printer,
  Search,
  Slash,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import adiblogo from '@/app/assets/adib.svg'

import data from '@/lib/mock.json'
import Image from 'next/image'

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
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">ADX</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash className="size-4 text-muted-foreground" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/components">Finance</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash className="size-4 text-muted-foreground" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>ADIB</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <section className="flex items-start py-2">
          <div className="relative w-24 h-24 mr-4">
            <Image
              src={adiblogo}
              alt="Abu Dhabi Islamic Bank Logo"
              layout="fill"
              objectFit="contain"
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col flex-grow">
            <div className="flex flex-col items-start space-y-4">
              <h1 className="text-3xl font-semibold">Abu Dhabi Islamic Bank</h1>
              <Button variant="outline" className="px-4 font-medium">
                ADIB - Abu Dhabi Securities Exchange
              </Button>
              <div className="text-foreground text-base font-medium">
                10.90 AED<span className="text-green-600 text-sm ml-1">(+0.93%)</span>
              </div>
            </div>
          </div>
          <Button variant="outline" className="ml-auto">
            <Printer className="h-4 w-4 mr-2" />
            Print Overview
          </Button>
        </section>
        <section>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="py-2 space-y-8">
                <section className="flex justify-between space-x-4">
                  <PieChart data={data.keyShareholders} title="Key Shareholders" />
                  <PieChart data={data.stockOwnership} title="Stock Ownership" />
                </section>
                <section className="flex justify-between space-x-4">
                  <BarChart data={data.dividends} title="Dividends" xKey="year" yKey="dividend" />
                  <LineChart
                    data={data.periodicalReturn}
                    title="Periodical Return (%)"
                    xKey="year"
                    yKey="value"
                  />
                </section>
                <section className="space-y-6">
                  <h3 className="text-2xl font-medium">Key Statistics</h3>
                  <div className="w-full grid grid-cols-4 gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-base">P/E Ratio:</CardTitle>
                        <PercentSquare className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-semibold">{data.keyStatistics.peRatio}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-base">Price to Sales:</CardTitle>
                        <PercentSquare className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-semibold">
                          {data.keyStatistics.priceToSales}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-base">Price to Book</CardTitle>
                        <PercentSquare className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-semibold">
                          {data.keyStatistics.priceToBook}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-base">Price to Cash Flow:</CardTitle>
                        <PercentSquare className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-semibold">
                          {data.keyStatistics.priceToCashFlow}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-base">Debt/Total Equity:</CardTitle>
                        <PercentSquare className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-semibold">
                          {data.keyStatistics.debtToEquity}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-base">
                          Long Term Debt/Equity:
                        </CardTitle>
                        <PercentSquare className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-semibold">
                          {data.keyStatistics.longTermDebtToEquity}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-base">Return on Equity:</CardTitle>
                        <PercentSquare className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-semibold">
                          {data.keyStatistics.returnOnEquity}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>
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
            </TabsContent>
            <TabsContent value="financials">Change your password here.</TabsContent>
          </Tabs>
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
      </main>
    </div>
  )
}
