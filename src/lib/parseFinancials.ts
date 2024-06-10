export function parseFinancials(rawText: string) {
  const lines = rawText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line)

  const titles = [
    'Valuation',
    'Balance Sheet as of Mar 31, 2024',
    'Operating Metrics',
    'Price History',
    'Dividends',
    'Margins',
    'Income Statement',
  ]

  let currentTitle = ''
  const result: { [key: string]: any } = {}

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (titles.includes(line)) {
      currentTitle = line
      result[currentTitle] = {}
    } else if (currentTitle && i + 1 < lines.length) {
      const key = line
      const value = lines[i + 1]
      result[currentTitle][key] = value
      i++
    }
  }

  return JSON.stringify(result, null, 2)
}
