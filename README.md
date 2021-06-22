# react-draggable-range

This component allows you to create a draggable range slider. It is intended to give additional flexibility when `input type="range"` is not enough.

This is a very minimal package

## Installation

```bash
npm install react-draggable-range

yarn add react-draggable-range

pnpm install react-draggable-range
```

## Usage

```tsx
import React, { useState } from 'react'

import DragRange from 'react-draggable-range'

const App = () => {
  const [value, setValue] = useState(10)

  return (
    <div className="flex flex-col w-full h-screen justify-center items-center">
      <DragRange
        min={0}
        max={100}
        step={0.1}
        noOfDecimalPlaces={5}
        value={value}
        onChange={v => {
          setValue(v)
        }}>
        <span className="underline cursor-move">Test</span>
      </DragRange>

      <span className="text-lg">{value}</span>
    </div>
  )
}
```

### Props

```tsx
type DragRangeProps = {
  value: number
  onChange: (newValue: number) => void
  axis?: 'x' | 'y' // if it should be on x or y axis, this only kinda works
  min?: number
  max?: number
  step?: number // Increment step
  noOfDecimalPlaces?: number // deciminal places
  /**
   Non Synthetic Events
   */
  onDragStart?: (e: MouseEvent) => void
  onDragEnd?: (e: MouseEvent) => void
  onMouseUp?: (e: MouseEvent) => void
  /**
   React Synthetic Event
   */
  onMouseDown?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
  children?: React.ReactNode[] | React.ReactNode
}
```

### Credits

Clean up version of the package from https://github.com/Radivarig/react-drag-range using hooks, modern react and typescript.

### SLA

This is just an small package that I needed to dogfood for https://modfy.video and decided to keep open, so don't really expect very many updates and such on this.
