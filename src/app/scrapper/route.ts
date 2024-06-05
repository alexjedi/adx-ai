import scrapeTradingView from '../../../lib/scrapper'

export default async function handler(req, res) {
  try {
    const data = await scrapeTradingView()
    res.status(200).json({ data })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error scraping TradingView' })
  }
}
