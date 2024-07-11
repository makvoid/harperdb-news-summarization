import Bottleneck from 'bottleneck'
import Groq from 'groq-sdk'

export class Summarizer {
  static client
  static limiter

  static getClient() {
    if (this.client) return this.client
    this.client = new Groq({ apiKey: process.env.GROQ_API_KEY })
    return this.client
  }

  static getLimiter() {
    if (this.limiter) return this.limiter
    this.limiter = new Bottleneck({
      maxConcurrent: 1,
      minTime: 3 // ~20 requests per minute
    })
    return this.limiter
  }

  static async run(text) {
    const client = Summarizer.getClient()
    const limiter = Summarizer.getLimiter()

    const chatCompletion = await limiter.schedule(() => client.chat.completions.create({
      messages: [{
        role: 'user',
        content: `Please summarize this news article in a few sentences. Only reply with your summarization, no additional text: ${text}`
      }],
      model: 'llama3-8b-8192',
    }))

    return chatCompletion.choices[0].message.content.trim()
  }
}
