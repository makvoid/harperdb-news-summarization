import { type DateTime } from 'luxon'

export interface NewsArticle {
  id: string
  author: string
  title: string
  link: string
  description: string
  summary: string
}

export interface RawNewsArticle extends NewsArticle {
  date: number // unix timestamp
}

export interface ParsedNewsArticle extends NewsArticle {
  date: DateTime
}

export interface RawNewsFeedData {
  entries: RawNewsArticle[]
  total: number
}

export interface ParsedNewsFeedData {
  entries: Record<string, ParsedNewsArticle[]>
  total: number | string
}

export interface PaginationOptions { offset: number, limit: number }
