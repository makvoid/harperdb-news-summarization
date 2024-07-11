export class BaseFetcher {
  // RSS Feed URL
  url
  // Display name for Feed
  name
  // NewsFetcher Instance
  newsFetcher

  constructor(url, name) {
    this.url = url
    this.name = name
  }

  register(newsFetcher) {
    this.newsFetcher = newsFetcher
  }

  async getEntries() {
    throw new Error('Not yet implemented')
  }
}
