'use client'

import Link from 'next/link'
import {
  Activity,
  AlignHorizontalDistributeCenter,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Languages,
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
import Image from 'next/image'
import logo from '@/app/apple-touch-icon.png'
import { usePathname } from 'next/navigation'

type NavigationProps = {
  onSearchClick?: () => void
}

const Navigation: React.FC<NavigationProps> = ({ onSearchClick }) => {
  const pathname = usePathname()

  const handleSearchClick = () => {
    if (onSearchClick) {
      onSearchClick()
    }
  }

  return (
    <header className="sticky top-0 flex h-20 items-center gap-4 bg-background px-4 md:px-8 z-10">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Image src={logo} className="size-8 -mr-2" alt="logo" />
        <div className="flex space-x-1">
          <Button variant="ghost" className="rounded-full text-[15px] font-medium" asChild>
            <Link
              href="/"
              className={`${
                pathname == '/' ? 'text-foreground' : 'text-muted-foreground'
              } transition-colors hover:text-foreground`}
            >
              Dashboard
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="rounded-full text-[15px] font-medium pointer-events-none"
            asChild
          >
            <Link
              href="/sandbox"
              className={`${
                pathname == '/sandbox' ? 'text-foreground' : 'text-muted-foreground'
              } transition-colors hover:text-foreground`}
            >
              Sandbox
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="rounded-full text-[15px] font-medium pointer-events-none"
            asChild
          >
            <Link
              href="/preview"
              className={`${
                pathname == '/preview' ? 'text-foreground' : 'text-muted-foreground'
              } transition-colors hover:text-foreground`}
            >
              Preview
            </Link>
          </Button>
        </div>
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
            <Link
              href="/"
              className="text-base font-medium text-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/sandbox"
              className="text-base font-medium text-foreground transition-colors hover:text-foreground"
            >
              Sandbox
            </Link>
            <Link
              href="/preview"
              className="text-base font-medium text-foreground transition-colors hover:text-foreground"
            >
              Preview
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 ml-auto md:ml-auto md:gap-2 lg:gap-2">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <div
              onClick={handleSearchClick}
              className="flex space-x-2 bg-secondary px-4 py-2 items-center rounded-full border border-transparent cursor-pointer hover:border-foreground transition duration-300 ease-in-out"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium hidden md:block">
                Enter ADX ticker
              </span>
              <p className="text-sm text-muted-foreground hidden md:block">
                <span className="text-xs">⌘</span>K
              </p>
            </div>
          </div>
        </form>
        <ThemeSelector />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Languages className="h-5 w-5" />
              <span className="sr-only">Toggle language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>عربي</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
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
