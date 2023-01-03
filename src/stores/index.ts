import { useEffect, useState } from "react";

type SetFn<T extends {}> = (fn: (prev: T) => Partial<T>) => void;
type Selector<T extends {}, R> = (state: T) => R;

export const create = <T extends {}>(config: (set: SetFn<T>) => T) => {
  let _state: T;

  const getState = () => {
    return _state;
  };

  const subscribers = new Set<Selector<T, any>>();

  _state = config((fn) => {
    const prevState = getState();
    const newState = {...prevState, ...fn(prevState)};
    subscribers.forEach((fn) => fn(newState));
    _state = newState;
    return newState;
  });

  const subscribe = (selector: Selector<T, any>) => {
    subscribers.add(selector);
  };

  return <R>(selector: Selector<T, R>) => {
    const [slice, setSlice] = useState(selector(getState()));

    useEffect(() => {
      return subscribe((nextState) => setSlice(selector(nextState)));
    }, []);

    return slice;
  };
};
