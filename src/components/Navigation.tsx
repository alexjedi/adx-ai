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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeSelector } from './ThemeSelector'

const Navigation: React.FC = () => {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <AlignHorizontalDistributeCenter className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
          Dashboard
        </Link>
        <Link
          href="/sandbox"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Sandbox
        </Link>
        <Link
          href="/preview"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Preview
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
            <Button variant="outline" className="flex space-x-2">
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
        <ThemeSelector />
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
  )
}

export default Navigation
