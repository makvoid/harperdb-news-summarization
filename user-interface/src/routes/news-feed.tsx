import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import debounce from 'lodash/debounce'

import { NewsService } from '@/services/news'
import { Title, Pagination } from '@/components'
import { setTitle } from '@/lib/utils'
import { Loader } from '@/components/custom/Loader'
import {
  type PaginationOptions,
  type ParsedNewsArticle,
  type ParsedNewsFeedData
} from '@/models'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import { useToast } from '@/components/ui/use-toast'
import { MAX_PAGE_SIZE } from '@/lib/constants'

const NewsFeed = (): React.JSX.Element => {
  const [page, setPage] = useState<PaginationOptions>({
    offset: 0,
    limit: MAX_PAGE_SIZE
  })
  const service = new NewsService()
  const { toast } = useToast()

  const getEntries = async (): Promise<ParsedNewsFeedData | null> => {
    let response
    try {
      response = await service.getEntries(page.offset, page.limit)
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(e)
      toast({
        title: 'Error fetching Articles',
        description: e.toString(),
        variant: 'destructive'
      })
      return null
    }

    // Group the results by day
    const days: Record<string, ParsedNewsArticle[]> = {}
    response.entries.forEach(entry => {
      const date = DateTime.fromSeconds(entry.date)
      const start = date.startOf('day').toISO()
      if (!Object.keys(days).includes(start)) days[start] = []
      days[start].push({
        ...entry,
        date
      })
    })

    return { entries: days, total: response.total }
  }

  const query = useQuery({
    queryKey: ['articles', page.offset, page.limit],
    queryFn: getEntries
  })
  const debouncedRefetch = debounce(query.refetch, 500)

  useEffect(() => {
    setTitle('News Feed')

    // Setup the Server Sent Events listener
    const eventSource = new EventSource(`${window.location.origin}/Entry`, { withCredentials: true })
    eventSource.addEventListener('put', _ => {
      if (!debouncedRefetch) return
      // @ts-expect-error false positive
      debouncedRefetch()
        .catch(err => {
          // eslint-disable-next-line no-console
          console.error(err)
        })
    })

    return () => {
      // On component dismount, close the event source connection
      eventSource.close()
    }
  }, [])

  const getDayAbbr = (key: string): string => {
    const date = DateTime.fromISO(key)
    return date.toFormat('LLL. d') // Jan. 1
  }

  const getEntryDateAbbr = (date: DateTime): string => {
    return date.toFormat('h:mm a') // 8:30 AM
  }

  const onSetPage = (page: PaginationOptions): void => {
    setPage(page)
  }

  return (
    <>
      {query.isLoading &&
        <div className="flex justify-center items-center mt-16">
          <Loader />
        </div>
      }
      {!query.isLoading && Object.keys(query.data?.entries ?? []).length === 0 &&
        <span className="flex text-muted-foreground justify-center leading-7 mt-1 w-full">No articles available to show.</span>
      }
      {!query.isLoading && query.data != null &&
      <>
        <div className="flex flex-col divide-y divide-gray-100">
          {Object.keys(query.data.entries).map(key => <div key={key} id={key}>
            <div className="flex items-center justify-between text-black mt-10">
              <Title>{getDayAbbr(key)}</Title>
              <span className="text-gray-400">{query.data?.entries[key].length} article{query.data?.entries[key].length === 1 ? '' : 's'}</span>
            </div>
            <ul className="mt-5 mb-10">
              {query.data?.entries[key].map(entry => <li id={entry.id} key={entry.id} className="p-2 border rounded-lg border-transparent hover:border-gray-200">
                <a
                  target="_blank"
                  href={entry.link}
                  className="block"
                  rel="noreferrer"
                >
                  <div className="flex flex-col items-start">
                    <h4 className="w-full scroll-m-20 text-xl font-semibold tracking-tight">
                      {entry.title}
                    </h4>
                    <HoverCard>
                      <HoverCardTrigger>
                        <p className="leading-7 mt-1 w-full">
                          {entry.summary}
                        </p>
                      </HoverCardTrigger>
                      <HoverCardContent className='w-[48rem]'>
                        {entry.description}
                      </HoverCardContent>
                    </HoverCard>
                    <span className="leading-7 text-gray-400 w-full">
                      {entry.author}, {getEntryDateAbbr(entry.date)}
                    </span>
                  </div>
                </a>
              </li>)}
            </ul>
          </div>)}
        </div>

        {Object.keys(query.data?.entries ?? []).length !== 0 && <Pagination
          start={page.offset + 1}
          end={Math.min(
            page.offset + MAX_PAGE_SIZE,
            typeof (query.data.total) === 'string'
              ? page.offset + MAX_PAGE_SIZE
              : query.data.total
          )}
          total={query.data.total}
          setPage={onSetPage}
        />}
      </>
      }
    </>
  )
}

export default NewsFeed
