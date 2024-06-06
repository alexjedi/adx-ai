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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCallback, useEffect, useState } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { scrapePageFinancials, scrapePageOverview } from '@/lib/scrapper'
import { parseFinancials } from '@/lib/parseFinancials'
import { parseOverviewToJSON } from '@/lib/parseOverview'
import { generateADXURL, generateTVURL } from '@/lib/utils'
import Navigation from '@/components/Navigation'

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
        <section className="flex space-x-4 justify-between">
          <div className="flex-1">
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
