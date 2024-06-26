// @ts-nocheck

'use client'

import Link from 'next/link'
import {
  Activity,
  AlignHorizontalDistributeCenter,
  ArrowUpDown,
  ArrowUpRight,
  BarChart2Icon,
  CalendarRange,
  CircleUser,
  CreditCard,
  DollarSign,
  Factory,
  FilePlus,
  Gem,
  HandCoins,
  ImageDown,
  Landmark,
  Menu,
  Package2,
  PercentSquare,
  PieChartIcon,
  Printer,
  RefreshCcw,
  Search,
  Slash,
  TrendingUp,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCallback, useEffect, useRef, useState } from 'react'
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
import { formatPropertyValue, generateADXURL, generateTVURL } from '@/lib/utils'
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
import html2canvas from 'html2canvas'
import HorizontalBarChart from '@/components/chart/HorizontalBarChart'
import { useReactToPrint } from 'react-to-print'
import { Data } from '@/lib/types'
import { DataFinancials } from '@/lib/types'
import empty from '@/lib/mockEmpty.json'

export default function Dashboard() {
  const [open, setOpen] = useState(false)
  const [isCompact, setIsCompact] = useState(false)
  const mock = false
  const [extractedFinancials, setExtractedFinancials] = useState<DataFinancials>()
  const [extractedOverview, setExtractedOverview] = useState()
  const [ticker, setTicker] = useState('ADIB')
  const [url, setURL] = useState('')
  const [loading, setLoading] = useState(true)
  const printRef = useRef<HTMLDivElement>(null)
  const [isHorizontalBarChart, setIsHorizontalBarChart] = useState(true)
  const contentToPrint = useRef(null)
  const handlePrint = useReactToPrint({
    documentTitle: 'Print This Document',
    removeAfterPrint: true,
  })

  const handleDownloadImage = async () => {
    const element = printRef.current as unknown as HTMLElement | null
    if (!element) return

    const canvas = await html2canvas(element)

    const data = canvas.toDataURL('image/jpg')
    const link = document.createElement('a')

    if (typeof link.download === 'string') {
      link.href = data
      link.download = 'image.jpg'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      window.open(data)
    }
  }
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
    setLoading(true)
    setTicker(ticker)
    setTimeout(async () => {
      setTicker(ticker)
      setLoading(false)
    }, 2000)
  }

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const handleSearchClick = () => {
    setOpen((open) => !open)
  }

  const handleCompactClick = () => {
    setIsCompact(() => !isCompact)
  }

  const Financials = ({ title, data }: { title: string; data: any }) => (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <ul>
        {Object.entries(data).map(([key, value]) => (
          <li key={key} className="flex justify-between py-1">
            <span className="text-muted-foreground">{key}</span>
            <span className="font-medium">{(value as React.ReactNode) ?? 'N/A'}</span>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden">
      <Navigation
        onSearchClick={handleSearchClick}
        onCompactClick={handleCompactClick}
        isCompact={isCompact}
      />
      {loading ? (
        <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-spin"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
          Loading...
        </div>
      ) : (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8" ref={contentToPrint}>
          <section className={`flex-col gap-4 md:gap-8 ${isCompact ? 'hidden' : 'flex'} `}>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">ADX</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash className="size-4 text-muted-foreground" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/components">
                    {mock
                      ? extractedOverview.overview.sector
                      : (data as unknown as Data)[ticker]?.overview.sector}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash className="size-4 text-muted-foreground" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>{ticker}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <section className="flex flex-col md:flex-row items-start py-2">
              <div className="relative w-24 h-24 mr-4">
                <Image
                  src={`https://s3-symbol-logo.tradingview.com/${
                    (data as unknown as Data)[ticker]?.overview.url
                  }--big.svg`}
                  alt="Logo"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col flex-grow">
                <div className="flex flex-col items-start space-y-4">
                  <h1 className="text-xl md:text-3xl font-semibold">
                    {(data as unknown as Data)[ticker]?.overview.name}
                  </h1>
                  <Button variant="outline" className="px-4 font-medium">
                    {(data as unknown as Data)[ticker]?.overview.symbolOnADX} - Abu Dhabi Securities
                    Exchange
                  </Button>
                  <div className="text-foreground text-base font-medium">
                    {mock
                      ? extractedOverview.overview.price.slice(0, 5)
                      : (data as unknown as Data)[ticker]?.overview.price}{' '}
                    AED
                    <span className="text-green-600 text-sm md:ml-1">
                      {mock ? extractedOverview.overview.price.slice(9) : ''}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="md:ml-auto mr-4 mt-2 md:mt-0 flex md:inline-flex"
                onClick={() => window.location.reload()}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                className="md:ml-auto mt-2 md:mt-0 flex md:inline-flex"
                onClick={() => handlePrint(null, () => contentToPrint.current)}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Overview
              </Button>
            </section>
          </section>
          <section>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
                <TabsTrigger value="technicals">Technicals</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="pt-8 space-y-12">
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
                    <Card x-chunk="dashboard-01-chunk-2">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">Sector</CardTitle>
                        <Factory className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-medium">
                          {mock
                            ? extractedOverview.overview.sector
                            : (data as unknown as Data)[ticker]?.overview.sector}
                        </div>
                      </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-3">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">Incorporation</CardTitle>
                        <Landmark className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-medium">
                          {mock
                            ? extractedOverview.overview.incorporation
                            : (data as unknown as Data)[ticker]?.overview.incorporation}
                        </div>
                      </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-3">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">Listing Date</CardTitle>
                        <FilePlus className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-medium">
                          {mock
                            ? extractedOverview.overview.listing
                            : (data as unknown as Data)[ticker]?.overview.listing}
                        </div>
                      </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-3">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">Share Capital</CardTitle>
                        <Gem className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-medium">
                          {formatPropertyValue(
                            (data as unknown as Data)[ticker]?.overview.sharecapital
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <section className="flex flex-col space-y-8 lg:flex-row justify-between lg:space-x-8 lg:space-y-0">
                    <Card ref={printRef} x-chunk="dashboard-01-chunk-3" className="w-full">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">Key Shareholders</CardTitle>
                        <Button variant="ghost" onClick={handleDownloadImage}>
                          <span className="text-sm text-muted-foreground">Download</span>
                          <ImageDown className="size-4 ml-1 text-muted-foreground" />{' '}
                        </Button>
                      </CardHeader>
                      <CardContent className="w-full">
                        <PieChart data={(data as unknown as Data)[ticker]?.keyShareholders} />
                      </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-3" className="w-full">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">Stock Ownership</CardTitle>
                        <Button
                          variant="ghost"
                          onClick={() => setIsHorizontalBarChart(!isHorizontalBarChart)}
                        >
                          <span className="text-sm text-muted-foreground">Change View</span>
                          <BarChart2Icon className="size-4 ml-1 text-muted-foreground" />{' '}
                        </Button>
                      </CardHeader>
                      <CardContent className="w-full">
                        {isHorizontalBarChart ? (
                          <PieChart
                            data={
                              mock
                                ? extractedOverview.stockOwnership
                                : (data as unknown as Data)[ticker]?.stockOwnership
                            }
                          />
                        ) : (
                          <HorizontalBarChart
                            xKey="name"
                            yKey="value"
                            data={
                              mock
                                ? extractedOverview.stockOwnership
                                : (data as unknown as Data)[ticker]?.stockOwnership
                            }
                          />
                        )}
                      </CardContent>
                    </Card>
                  </section>
                  <section className="space-y-6">
                    <h3 className="text-xl font-semibold">Key Statistics</h3>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="font-medium text-base">P/E Ratio:</CardTitle>
                          <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-semibold">
                            {(data as unknown as Data)[ticker]?.financials.valuation[
                              'Price to Earnings Ratio (TTM)'
                            ].slice(0, 4)}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="font-medium text-base">Price to Sales:</CardTitle>
                          <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-semibold">
                            {(data as unknown as Data)[ticker]?.financials.valuation[
                              'Price to Sales (FY)'
                            ].slice(0, 4)}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="font-medium text-base">Price to Book</CardTitle>
                          <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-semibold">
                            {(data as unknown as Data)[ticker]?.financials.valuation[
                              'Price to Book (FY)'
                            ].slice(0, 4)}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="font-medium text-base">
                            Price to Cash Flow:
                          </CardTitle>
                          <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-semibold">
                            {(data as unknown as Data)[ticker]?.keyStatistics.priceToCashFlow}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="font-medium text-base">
                            Debt/Total Equity:
                          </CardTitle>
                          <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-semibold">
                            {(data as unknown as Data)[ticker]?.financials['balance sheet'][
                              'Debt to Equity Ratio (MRQ)'
                            ].slice(0, 4)}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="font-medium text-base">
                            Long Term Debt/Equity:
                          </CardTitle>
                          <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-semibold">
                            {(data as unknown as Data)[ticker]?.keyStatistics.longTermDebtToEquity}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="font-medium text-base">Return on Equity:</CardTitle>
                          <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-semibold">
                            {(data as unknown as Data)[ticker]?.financials['operating metrics'][
                              'Return on Equity (TTM)'
                            ].slice(0, 4)}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </section>
                  <section className="space-y-6">
                    <h3 className="text-xl font-semibold">Growth</h3>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="font-medium text-base">
                            Revenue Growth (Quarterly YoY):
                          </CardTitle>
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-semibold">
                            {(data as unknown as Data)[ticker]?.growth.revenueGrowthYoY}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="font-medium text-base">
                            Revenue Growth Rate (5Y):
                          </CardTitle>
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-semibold">
                            {(data as unknown as Data)[ticker]?.growth.revenueGrowth5Y}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="font-medium text-base">
                            EPS Growth (Quarterly YoY):
                          </CardTitle>
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-semibold">
                            {(data as unknown as Data)[ticker]?.growth.epsGrowthYoY}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="font-medium text-base">
                            EPS Growth (TTM YoY):
                          </CardTitle>
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-semibold">
                            {(data as unknown as Data)[ticker]?.growth.epsGrowthTTM}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="font-medium text-base">
                            EPS Growth Rate (5Y):
                          </CardTitle>
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-semibold">
                            {(data as unknown as Data)[ticker]?.growth.epsGrowth5Y}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="font-medium text-base">
                            EPS Growth Rate (3Y):
                          </CardTitle>
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-semibold">
                            {(data as unknown as Data)[ticker]?.growth.epsGrowth3Y}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </section>
                  <section className="flex flex-col space-y-8 lg:flex-row justify-between lg:space-x-8 lg:space-y-0">
                    <Card x-chunk="dashboard-01-chunk-3" className="w-full">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">Dividends</CardTitle>
                        <HandCoins className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent className="w-full">
                        <BarChart
                          data={(data as unknown as Data)[ticker]?.dividends}
                          xKey="year"
                          yKey="dividend"
                          y2Key="yield"
                        />
                      </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-3" className="w-full">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">Highs & Lows (AED)</CardTitle>
                        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent className="w-full flex space-x-4">
                        <PieChart
                          isOnlyValue
                          data={[
                            {
                              name: '52 Week High',
                              value: mock
                                ? Number(extractedFinancials['price history']['52 Week High'])
                                : (data as unknown as Data)[ticker]?.highsLows.high,
                            },
                            {
                              name: '100%',
                              value: mock
                                ? 100 - Number(extractedFinancials['price history']['52 Week High'])
                                : 100 - (data as unknown as Data)[ticker]?.highsLows.high,
                            },
                          ]}
                        />
                        <PieChart
                          isOnlyValue
                          data={[
                            {
                              name: '52 Week Low',
                              value: mock
                                ? Number(extractedFinancials['price history']['52 Week Low'])
                                : (data as unknown as Data)[ticker]?.highsLows.low,
                            },
                            {
                              name: '100%',
                              value: mock
                                ? 100 - Number(extractedFinancials['price history']['52 Week Low'])
                                : 100 - (data as unknown as Data)[ticker]?.highsLows.low,
                            },
                          ]}
                        />
                      </CardContent>
                    </Card>
                  </section>
                  <section className="w-full flex items-stretch justify-stretch">
                    <Card className="w-full">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-base">
                          Periodical Return (%)
                        </CardTitle>
                        <CalendarRange className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <LineChart
                          data={(data as unknown as Data)[ticker]?.periodicalReturn}
                          Key1={'totalReturn'}
                          Key2={'ADIB Stock'}
                          Key3={'Return on Reinvested Dividends'}
                        />
                      </CardContent>
                    </Card>
                  </section>
                </div>
              </TabsContent>
              <TabsContent value="financials">
                <div className="py-8 px-4 grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div>
                    <Financials
                      title="Valuation"
                      data={
                        mock
                          ? extractedFinancials?.valuation
                          : (data as unknown as Data)[ticker]?.financials.valuation
                      }
                    />
                    <Financials
                      title="Balance Sheet"
                      data={
                        mock
                          ? extractedFinancials['balance sheet']
                          : (data as unknown as Data)[ticker]?.financials['balance sheet']
                      }
                    />
                    <Financials
                      title="Operating Metrics"
                      data={
                        mock
                          ? extractedFinancials['operating metrics']
                          : (data as unknown as Data)[ticker]?.financials['operating metrics']
                      }
                    />
                  </div>
                  <div>
                    <Financials
                      title="Price History"
                      data={
                        mock
                          ? extractedFinancials['price history']
                          : (data as unknown as Data)[ticker]?.financials['price history']
                      }
                    />
                    <Financials
                      title="Dividends"
                      data={
                        mock
                          ? extractedFinancials?.dividends
                          : (data as unknown as Data)[ticker]?.financials.dividends
                      }
                    />
                    <Financials
                      title="Margins"
                      data={
                        mock
                          ? extractedFinancials?.valuation
                          : (data as unknown as Data)[ticker]?.financials.margins
                      }
                    />
                    <Financials
                      title="Income Statement"
                      data={
                        mock
                          ? extractedFinancials['income statement']
                          : (data as unknown as Data)[ticker]?.financials['income statement']
                      }
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="profile">
                <div className="py-8 px-4 flex flex-col space-y-4">
                  <h2 className="text-lg font-semibold mb-4">Description</h2>
                  <p>
                    {mock
                      ? extractedOverview.overview.description
                      : (data as unknown as Data)[ticker]?.overview.description}
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="assistant">
                <div className="py-8 px-4 flex flex-col w-[400px] border rounded-xl">
                  <iframe
                    src="https://www.chatbase.co/chatbot-iframe/H_5EHNRxgS9WFvxnVg2QJ"
                    width="100%"
                    className="h-full min-h-[500px]"
                    frameBorder="0"
                  ></iframe>
                </div>
              </TabsContent>
              <TabsContent value="technicals">
                <div className="py-8 px-4 flex flex-col">TBD</div>
              </TabsContent>
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
                    <Image
                      src={`https://s3-symbol-logo.tradingview.com/${
                        (data as unknown as Data)['FAB']?.overview.url
                      }--big.svg`}
                      alt="Logo"
                      width={24}
                      height={24}
                      className="rounded-full mr-2"
                    />
                    <span className="font-medium">FAB</span>
                  </CommandItem>
                  <CommandItem
                    onSelect={() => runCommand(() => handleSelect('ADIB'))}
                    className="cursor-pointer"
                  >
                    <Image
                      src={`https://s3-symbol-logo.tradingview.com/${
                        (data as unknown as Data)['ADIB']?.overview.url
                      }--big.svg`}
                      alt="Logo"
                      width={24}
                      height={24}
                      className="rounded-full mr-2"
                    />
                    <span className="font-medium">ADIB</span>
                  </CommandItem>
                  <CommandItem
                    onSelect={() => runCommand(() => handleSelect('ADNOCDIST'))}
                    className="cursor-pointer"
                  >
                    <Image
                      src={`https://s3-symbol-logo.tradingview.com/${
                        (data as unknown as Data)['ADNOCDIST']?.overview.url
                      }--big.svg`}
                      alt="Logo"
                      width={24}
                      height={24}
                      className="rounded-full mr-2"
                    />
                    <span className="font-medium">ADNOCDIST</span>
                  </CommandItem>
                  <CommandItem
                    onSelect={() => runCommand(() => handleSelect('ALDAR'))}
                    className="cursor-pointer"
                  >
                    <Image
                      src={`https://s3-symbol-logo.tradingview.com/${
                        (data as unknown as Data)['ALDAR']?.overview.url
                      }--big.svg`}
                      alt="Logo"
                      width={24}
                      height={24}
                      className="rounded-full mr-2"
                    />
                    <span className="font-medium">ALDAR</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </CommandDialog>
          </section>
        </main>
      )}
    </div>
  )
}
