import React from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons'

import { TooltipContainer, Button } from '@/components'
import { type PaginationOptions } from '@/models'
import { MAX_PAGE_SIZE } from '@/lib/constants'

interface PaginationProps {
  start: number
  end: number
  total: number | string
  setPage: (page: PaginationOptions) => void
}

export const Pagination = (props: PaginationProps): React.JSX.Element => {
  const total = typeof (props.total) === 'string'
    ? 0
    : props.total

  return (
    <>
      <div className="flex items-center justify-between mt-10">
        <div className="flex gap-2">
          <TooltipContainer
            text="Skip to the first page"
            trigger={
              <Button
                disabled={!(props.start > 1 && Math.ceil(props.start / MAX_PAGE_SIZE) > 1)}
                onClick={() => {
                  props.setPage({
                    offset: 0,
                    limit: MAX_PAGE_SIZE
                  })
                }}
                variant="outline"
                size="icon"
              >
                <DoubleArrowLeftIcon className="h-4 w-4" />
              </Button>
            }
          />
          <TooltipContainer
            text="Go to the previous page"
            trigger={
              <Button
                disabled={!(props.start > 1)}
                onClick={() => {
                  props.setPage({
                    offset: props.start - 1 - MAX_PAGE_SIZE,
                    limit: MAX_PAGE_SIZE
                  })
                }}
                variant="outline"
                size="icon"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
            }
          />
        </div>
        <div className="text-muted-foreground">Showing {props.start} - {props.end} of {props.total}</div>
        <div className="flex gap-2">
          <TooltipContainer
            text="Go to the next page"
            trigger={
              <Button
                disabled={!(props.end < total)}
                onClick={() => {
                  props.setPage({
                    offset: props.start - 1 + MAX_PAGE_SIZE,
                    limit: MAX_PAGE_SIZE
                  })
                }}
                variant="outline"
                size="icon"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            }
          />
          <TooltipContainer
            text="Skip to the last page"
            trigger={
              <Button
                disabled={!(props.end < total)}
                onClick={() => {
                  props.setPage({
                    offset: (Math.ceil(total / MAX_PAGE_SIZE) - 1) * MAX_PAGE_SIZE,
                    limit: MAX_PAGE_SIZE
                  })
                }}
                variant="outline"
                size="icon"
              >
                <DoubleArrowRightIcon className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </div>
    </>
  )
}
