import { act, renderHook } from '@testing-library/react';
import {create} from './';

describe('create()', () => {
  it('should create a new storage', () => {
    const hook = create<{count: number, increment: VoidFunction}>((set) => ({
      count: 0,
      increment: () => set(state => ({count: state.count + 1})),
    }));

    const {result} = renderHook(() => hook(state => state));

    expect(result.current.count).toBe(0);
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });
});

