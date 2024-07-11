import React from 'react'

interface HeaderProps {
  children: string
}

export function Title (props: HeaderProps): React.JSX.Element {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {props.children}
    </h3>
  )
}
