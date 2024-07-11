import https from 'https'
import fetch from 'node-fetch'

import { BaseFetcher } from '../fetchers/base.js'
import { shuffle } from './shuffle.js'

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
})

export class NewsFetcher {
  fetchers
  token

  /**
   * @param {BaseFetcher[]} fetchers one or more fetchers to initialize and read from
   */
  constructor(fetchers) {
    this.fetchers = fetchers
    this.fetchers.forEach(fetcher => fetcher.register(this))
    shuffle(this.fetchers)
    this.token = Buffer
      .from(`${process.env.HDB_USERNAME}:${process.env.HDB_PASSWORD}`)
      .toString('base64')
  }

  async run() {
    for (const fetcher of this.fetchers) {
      let entries
      try {
        entries = await fetcher.getEntries()
      } catch (e) {
        console.error(e)
        continue
      }

      for (const entry of entries) {
        let body
        try {
          const response = await this.syncToDB(entry)
          body = await response.text()
          if (body.includes('Error')) {
            throw new Error(body)
          }
          console.log(`+[${fetcher.name}] ${entry.id}: ${entry.title}`)
        } catch (e) {
          console.error(`Error adding ${entry.id}: ${e.toString()}`)
          console.error(e)
          continue
        }
      }
    }
  }

  async syncToDB(entry) {
    return this.submitRequest(entry.id, 'PUT', entry)
  }

  async entryExists(entryId) {
    const request = await this.submitRequest(entryId, 'GET')
    return request.status !== 404
  }

  async submitRequest(endpoint, method, body = null) {
    return fetch(
      `${process.env.HDB_ENDPOINT}/${endpoint}`,
      {
        method: method,
        body: body != null ? JSON.stringify(body) : undefined,
        headers: {
          Authorization: `Basic ${this.token}`,
          'Content-Type': 'application/json'
        },
        agent: httpsAgent
      }
    )
  }
}
