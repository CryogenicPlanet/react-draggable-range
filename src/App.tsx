import React, { useState } from 'react'

import DragRange from './DragRange'

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

export default App
