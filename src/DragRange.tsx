import React, { useEffect, useReducer, useRef, useState } from 'react'

export type DragRangeProps = {
  value: number
  onChange: (newValue: number) => void
  axis?: 'x' | 'y'
  min?: number
  max?: number
  step?: number
  noOfDecimalPlaces?: number
  /**
   * Non Synthetic Event
   */
  onDragStart?: (e: MouseEvent) => void
  onDragEnd?: (e: MouseEvent) => void
  onMouseUp?: (e: MouseEvent) => void
  /**
   * React Synthetic Event
   */
  onMouseDown?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
  children?: React.ReactNode[] | React.ReactNode
}

type State = {
  value: number
  isSettingPercentage: boolean
}

type SettingPercent = {
  type: 'settingPercent'
  value: boolean
}

type SetValue = {
  type: 'setValue'
  value: number
}

type Action = SetValue | SettingPercent

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setValue': {
      if (state.isSettingPercentage) {
        const { value } = action
        return { ...state, value }
      } else {
        return state
      }
    }
    case 'settingPercent': {
      const { value } = action
      return { ...state, isSettingPercentage: value }
    }
    default: {
      return state
    }
  }
}

const DragRange = ({
  value: inputValue,
  min,
  max,
  axis = 'x',
  step = 1,
  noOfDecimalPlaces = 0,
  onChange,
  onDragEnd,
  onDragStart,
  onMouseDown,
  onMouseUp,
  children
}: DragRangeProps) => {
  const clamp = (_value: number, min?: number, max?: number) =>
    min !== undefined && _value < min
      ? min
      : max !== undefined && _value > max
      ? max
      : _value

  const [isDragging, setDragging] = useState(false)
  const [draggingOnMove, setDragginOnMove] = useState(false)
  //   const [mouseStart, setMouseStart] = useState({ x: 0, y: 0 })
  //   const [base, setBase] = useState(defaultValue)

  const [{ value }, dispatch] = useReducer(reducer, {
    value: inputValue,
    isSettingPercentage: false
  })

  useEffect(() => {
    onChange(value)
  }, [value])

  const wrapFunction = <T extends any>(
    func: ((props: T) => void) | undefined,
    props: T
  ) => {
    if (func) {
      func(props)
    }
  }

  const spanRef = useRef<HTMLElement | null>(null)

  const startDragging = (e: MouseEvent) => {
    if (isDragging) return true
    setDragging(true)
    setDragginOnMove(false)
    wrapFunction(onDragStart, e)
  }

  const roundToDecimals = (value: number) => {
    const pow = Math.pow(10, noOfDecimalPlaces || 0)
    return Math.round(value * pow) / pow
  }

  const getTargetInfo = (
    target: Element
  ): {
    target: Element
    rect: { width: number; height: number; left: number; top: number }
  } | null => {
    const boundRect = target.getBoundingClientRect()

    const width = boundRect.width || target.clientWidth
    const height = boundRect.height || target.clientHeight
    const rect = {
      width,
      height,
      left: boundRect.left,
      top: boundRect.top
    }

    if (width && height) {
      return {
        target,
        rect
      }
    } else if (target.children) return getTargetInfo(target.children[0])
    else return null
  }

  const calculatePercent = ({
    clientX,
    clientY
  }: {
    clientX: number
    clientY: number
    downEvent?: boolean
  }) => {
    if (spanRef && spanRef.current) {
      const target = spanRef.current
      const rect = getTargetInfo(target)?.rect

      if (rect) {
        let newValue = 0
        if (axis === 'y') {
          newValue = ((clientY - rect.top) * 100) / rect.height
        } else if (axis === 'x') {
          newValue = ((clientX - rect.left) * 100) / rect.width
        }
        newValue = newValue * step
        newValue = clamp(newValue, min, max)

        newValue = roundToDecimals(newValue)
        dispatch({ type: 'setValue', value: newValue })
      }
    }
  }

  //   const handleOnChange = (newValue: number, e: React.MouseEvent) => {

  //   }

  const handleMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e

    if (draggingOnMove) startDragging(e)
    calculatePercent({ clientX, clientY })
  }

  const handleMouseDown = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    dispatch({ type: 'settingPercent', value: true })

    const { clientX, clientY } = e

    if (!isDragging) setDragginOnMove(true)

    calculatePercent({ clientX, clientY, downEvent: true })
    wrapFunction(onMouseDown, e)
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', e => {
      setDragginOnMove(false)
      setDragging(false)

      dispatch({ type: 'settingPercent', value: false })
      wrapFunction(onDragEnd, e)
      wrapFunction(onMouseUp, e)
    })
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', e => {
        setDragginOnMove(false)
        setDragging(false)
        dispatch({ type: 'settingPercent', value: false })

        wrapFunction(onDragEnd, e)
      })
    }
  }, [])

  return (
    <span ref={spanRef} onMouseDown={handleMouseDown}>
      {children && children}
    </span>
  )
}

export default DragRange
