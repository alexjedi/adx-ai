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
        <section className="flex">
          <div className="flex flex-col space-y-3">
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
            <div>{loading ? 'loading...' : parseFinancials(extractedFinancials)}</div>
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
