import { XMLParser } from 'fast-xml-parser'
import fetch from 'node-fetch'

const parser = new XMLParser({ ignoreAttributes: false })

export const getFeed = async (url) => {
  const request = await fetch(
    url,
    {
      headers: {
        'User-Agent': 'hdb-news-feed-collector-v0.1.0'
      }
    }
  )
  const contents = await request.text()
  return parser.parse(contents)
}