import { stripHtml } from 'string-strip-html'

import { BaseFetcher } from './base.js'
import { Summarizer } from '../helpers/summarizer.js'
import { getFeed } from '../helpers/get-feed.js'
import { unescapeHTML } from '../helpers/unescape-html.js'

export class TechRadarFetcher extends BaseFetcher {
  constructor() {
    super('https://www.techradar.com/feeds/tag/software', 'Tech Radar (Software)')
  }

  async getEntries() {
    console.log(`[${this.name}] Fetching feed`)
    const feed = await getFeed(this.url)

    const entries = []
    for (const entry of feed.rss.channel.item) {
      const guid = entry.guid['#text']
      const id = `tech-radar-${guid}`

      // Skip any pre-existing logs
      const logExists = await this.newsFetcher.entryExists(id)
      if (logExists) {
        // console.log(`[${this.name}] ${id}: This entry has already been added to the database.`)
        continue
      }

      // Get the article contents and remove any HTML
      const rawText = stripHtml(entry['dc:content']).result
      const text = unescapeHTML(rawText)

      // Add the parsed article to the list
      entries.push({
        id,
        author: this.name,
        title: unescapeHTML(entry.title).trim(),
        link: entry.link,
        date: new Date(entry.pubDate).getTime() / 1000,
        description: text.length > 1024
          ? `${text.substring(0, 1024)} [...]`
          : text,
        summary: await Summarizer.run(text)
      })
    }

    return entries
  }
}
