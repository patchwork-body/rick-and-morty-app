import { renderHook, waitFor } from "@testing-library/react"
import { useRickAndMortyCharacters } from "./use-rick-and-morty-characters"

describe('useRickAndMortyApi()', () => {
  it('should has loading true until onSuccess or onFailure will be called', async () => {
    const onSuccess = jest.fn()
    const onFailure = jest.fn()
    const {result} = renderHook(() => useRickAndMortyCharacters(onSuccess, onFailure))

    expect(onSuccess).not.toBeCalled()
    expect(onFailure).not.toBeCalled()
    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(onFailure).not.toBeCalled()
    expect(onSuccess).toBeCalled()
  })
})

