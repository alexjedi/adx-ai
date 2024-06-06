interface CompanyInfo {
  Name: string
  Sector: string
  ListingDate: string
  SymbolOnADX: string
  Incorporation: string
  ShareCapital: string
  CompanyType: string
  ForeignOwnership: string
  GCCNationals: string
  UAENationals: string
  ArabCountries: string
  Website: string
}

export function parseOverviewToJSON(text: string): CompanyInfo {
  const nameMatch = text.match(/FINANCIALS\s+(\w+\s+\w+)/)
  const listingDateMatch = text.match(/LISTING DATE\s+(\d{2}-\w{3}-\d{4})/)
  const symbolMatch = text.match(/(\w+)\s+\+\d+/)
  const incorporationMatch = text.match(/INCORPORATION\s+(\d{2}-\w{3}-\d{4})/)
  const shareCapitalMatch = text.match(/SHARE CAPITAL\s+([\d,\.]+)/)
  const companyTypeMatch = text.match(/COMPANY TYPE\s+(\w+)/)
  const foreignOwnershipMatch = text.match(/FOREIGN OWNERSHIP\s+([\d\.%]+\s+from\s+[\d\.%]+)/)
  const gccNationalsMatch = text.match(/GCC NATIONALS\s+([\d\.%]+\s+from\s+[\d\.%]+)/)
  const uaeNationalsMatch = text.match(/UAE NATIONALS\s+([\d\.%]+\s+from\s+[\d\.%]+)/)
  const arabCountriesMatch = text.match(/ARAB COUNTRIES\s+([\d\.%]+\s+from\s+[\d\.%]+)/)
  const websiteMatch = text.match(/(https:\/\/www\.\w+\.\w+)/)

  return {
    Name: nameMatch ? nameMatch[1] : '',
    Sector: 'Financials',
    ListingDate: listingDateMatch ? listingDateMatch[1] : '',
    SymbolOnADX: symbolMatch ? symbolMatch[1] : '',
    Incorporation: incorporationMatch ? incorporationMatch[1] : '',
    ShareCapital: shareCapitalMatch ? shareCapitalMatch[1] : '',
    CompanyType: companyTypeMatch ? companyTypeMatch[1] : '',
    ForeignOwnership: foreignOwnershipMatch ? foreignOwnershipMatch[1] : '',
    GCCNationals: gccNationalsMatch ? gccNationalsMatch[1] : '',
    UAENationals: uaeNationalsMatch ? uaeNationalsMatch[1] : '',
    ArabCountries: arabCountriesMatch ? arabCountriesMatch[1] : '',
    Website: websiteMatch ? websiteMatch[1] : '',
  }
}
