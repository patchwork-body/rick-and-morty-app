import { act, renderHook } from "@testing-library/react"
import { useLayout } from "./use-layout"

describe('useLayout', () => {
  afterEach(() => {
    const { result } = renderHook(() => useLayout(state => state))
    act(() => result.current.showStack() );
  })

  it('should return the layout', () => {
    const { result } = renderHook(() => useLayout(state => state))
    expect(result.current.layout).toEqual('stack');
  })

  it('should change layout to from stack to grid and backwards', () => {
    const { result } = renderHook(() => useLayout(state => state))
    expect(result.current.layout).toEqual('stack')
    act(() => result.current.showGrid())
    expect(result.current.layout).toEqual('grid')
    act(() => result.current.showStack())
    expect(result.current.layout).toEqual('stack')
  })
})

