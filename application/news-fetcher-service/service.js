import { NewsFetcher } from "./helpers/news-fetcher.js"
import { CNXFetcher } from './fetchers/cnx.js'
import { TechRadarFetcher } from "./fetchers/tech-radar.js"
import { GenericFetcher } from "./fetchers/generic.js"

const main = async () => {
  console.log('News Fetcher Service started.')
  const fetcher = new NewsFetcher([
    new CNXFetcher(),
    new TechRadarFetcher(),
    new GenericFetcher('https://sdtimes.com/feed/', 'SD Times', 'sd-times'),
    new GenericFetcher('https://krebsonsecurity.com/feed/', 'Krebs on Security', 'krebs'),
    new GenericFetcher('https://www.artificialintelligence-news.com/feed/', 'AI News', 'ai-news')
  ])

  console.log('Running Fetchers, please wait...')
  await fetcher.run()

  console.log('News Fetcher Service completed.')
}
main()
