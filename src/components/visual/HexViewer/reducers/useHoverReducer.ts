import { useCallback } from 'react';
import {
  isAction,
  isCellMouseDown,
  ReducerProps,
  renderIndexClass,
  RenderProps,
  Store,
  StoreRef,
  useCellStyles
} from '..';

export type HoverState = {
  hover: { index: number };
};

export type HoverRef = {};

export const useHoverReducer = () => {
  const classes = useCellStyles();

  const initialState: HoverState = { hover: { index: null } };

  const initialRef: HoverRef = {};

  const hoverRender = useCallback(
    (prevStore: Store, nextStore: Store, refs: StoreRef): void => {
      const { index: prevIndex } = prevStore.hover;
      const { index: nextIndex } = nextStore.hover;
      renderIndexClass(prevIndex, nextIndex, classes.hover, nextStore.cellsRendered);
    },
    [classes.hover]
  );

  const hoverMouseEnter = useCallback((store: Store, refs: StoreRef): Store => {
    return { ...store, hover: { ...store.hover, index: store.cell.mouseEnterIndex } };
  }, []);

  const hoverMouseLeave = useCallback((store: Store, refs: StoreRef): Store => {
    return { ...store, hover: { ...store.hover, index: null } };
  }, []);

  const reducer = useCallback(
    ({ prevStore, nextStore, refs, action }: ReducerProps): Store => {
      if (isAction.cellMouseEnter(action) && !isCellMouseDown(nextStore)) return hoverMouseEnter(nextStore, refs);
      else if (isAction.bodyMouseLeave(action)) return hoverMouseLeave(nextStore, refs);
      else return { ...nextStore };
    },
    [hoverMouseEnter, hoverMouseLeave]
  );

  const render = useCallback(
    ({ prevStore, nextStore, refs }: RenderProps): void => {
      if (prevStore.hover.index !== nextStore.hover.index) hoverRender(prevStore, nextStore, refs);
    },
    [hoverRender]
  );

  return { initialState, initialRef, reducer, render };
};
