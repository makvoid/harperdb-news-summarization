import { type RawNewsFeedData } from '@/models'

export class NewsService {
  async getEntries (offset: number, limit: number): Promise<RawNewsFeedData> {
    const request = await fetch(
      `${window.location.origin}/news?offset=${offset}&limit=${limit}`
    )
    const body = await request.json()
    return body as RawNewsFeedData
  }
}
