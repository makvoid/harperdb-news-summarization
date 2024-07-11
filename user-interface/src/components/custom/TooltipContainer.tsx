import React from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

interface TooltipContainerProps {
  text: string
  trigger: JSX.Element
}

const TooltipContainer = (props: TooltipContainerProps): React.JSX.Element => {
  return (
    <Tooltip>
    <TooltipTrigger>
      {props.trigger}
    </TooltipTrigger>
    <TooltipContent>
      <p>{props.text}</p>
    </TooltipContent>
  </Tooltip>
  )
}

export default TooltipContainer
