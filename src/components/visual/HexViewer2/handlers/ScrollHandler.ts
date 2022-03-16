import { Store, StoreRef } from '..';

type Scroll = {
  top: 'top';
  middle: 'middle';
  bottom: 'bottom';
  include: 'include';
  includeMiddle: 'includeMiddle';
  smart: 'smart';
};
const SCROLL: Scroll = {
  top: 'top',
  middle: 'middle',
  bottom: 'bottom',
  include: 'include',
  includeMiddle: 'includeMiddle',
  smart: 'smart'
};
export type ScrollType = typeof SCROLL[keyof typeof SCROLL];
export type IsScroll = { [Property in ScrollType]: (scrollType: ScrollType) => boolean };
export const isScroll = Object.fromEntries(
  Object.keys(SCROLL).map(key => [key, (scrollType: ScrollType) => scrollType === SCROLL[key]])
) as IsScroll;

export const getScrollMaxIndex = (store: Store, hexCodeSize: number) =>
  Math.ceil(hexCodeSize / store.layout.column.size - store.layout.row.size);

export const getRowIndex = (store: Store, index: number) => Math.floor(index / store.layout.column.size);

export const clampScrollIndex = (index: number, maxIndex: number): number => Math.min(Math.max(index, 0), maxIndex);

const clampOffsetIndex = (offsetIndex: number, scrollIndex: number, rowSize: number) => {
  if (offsetIndex < scrollIndex) return offsetIndex;
  else if (offsetIndex >= scrollIndex + rowSize - 1) return offsetIndex - rowSize + 1;
  else return scrollIndex;
};

const isOffsetClamped = (offsetIndex: number, scrollIndex: number, rowSize: number) => {
  if (offsetIndex < scrollIndex) return true;
  else if (offsetIndex >= scrollIndex + rowSize - 1) return true;
  return false;
};

export const scrollToTableIndex = (store: Store, index: number, location: ScrollType): Store => {
  if (isNaN(index)) return { ...store };

  const {
    layout: {
      column: { size: columnSize },
      row: { size: rowSize }
    },
    scroll: { index: scrollIndex, maxIndex: scrollMaxIndex }
  } = store;

  let nextScrollIndex = store.scroll.index;
  if (isScroll.top(location)) {
    nextScrollIndex = Math.floor(index / columnSize);
  } else if (isScroll.middle(location)) {
    nextScrollIndex = Math.floor(index / columnSize - rowSize / 2);
  } else if (isScroll.bottom(location)) {
    nextScrollIndex = Math.floor(index / columnSize - rowSize);
  } else if (isScroll.include(location)) {
    nextScrollIndex = clampOffsetIndex(Math.floor(index / columnSize), scrollIndex, rowSize);
  } else if (isScroll.includeMiddle(location)) {
    nextScrollIndex = isOffsetClamped(Math.floor(index / columnSize), scrollIndex, rowSize)
      ? Math.floor(index / columnSize - rowSize / 2)
      : store.scroll.index;
  } else if (isScroll.smart(location)) {
    const distance = columnSize * rowSize;
    const prev = scrollIndex * columnSize - distance;
    const next = (scrollIndex + rowSize) * columnSize + distance;
    if (prev <= index && index <= next) {
      nextScrollIndex = clampOffsetIndex(Math.floor(index / columnSize), scrollIndex, rowSize);
    } else {
      nextScrollIndex = isOffsetClamped(Math.floor(index / columnSize), scrollIndex, rowSize)
        ? Math.floor(index / columnSize - rowSize / 2)
        : store.scroll.index;
    }
  }
  nextScrollIndex = clampScrollIndex(nextScrollIndex, scrollMaxIndex);
  return { ...store, scroll: { ...store.scroll, index: nextScrollIndex } };
};

export const scrollToWindowIndex = (store: Store, refs: StoreRef, index: number, location: ScrollType): void => {
  setTimeout(() => {
    const scrollIndex = Math.floor(index / store.layout.column.size);
    if (isScroll.top(location)) refs?.current?.layout.listRef?.current?.scrollToItem(scrollIndex, 'start');
    else if (isScroll.middle(location)) refs?.current?.layout.listRef?.current?.scrollToItem(scrollIndex, 'center');
    else if (isScroll.bottom(location)) refs?.current?.layout.listRef?.current?.scrollToItem(scrollIndex, 'end');
    else if (isScroll.include(location)) refs?.current?.layout.listRef?.current?.scrollToItem(scrollIndex, 'auto');
    else if (
      isScroll.includeMiddle(location) &&
      (index < refs.current.cellsRendered.visibleStartIndex || refs.current.cellsRendered.visibleStopIndex < index)
    )
      refs?.current?.layout.listRef?.current?.scrollToItem(scrollIndex, 'center');
    else if (isScroll.smart(location)) refs?.current?.layout.listRef?.current?.scrollToItem(scrollIndex, 'smart');
  }, 1);
};

export const getTableCellsRendered = ({
  scroll: { index: scrollIndex, maxIndex: scrollMaxIndex, overscanCount },
  layout: {
    column: { size: columnSize },
    row: { size: rowSize }
  }
}: Store): {
  overscanStartRowIndex: number;
  overscanStopRowIndex: number;
  visibleStartRowIndex: number;
  visibleStopRowIndex: number;

  overscanStartIndex: number;
  overscanStopIndex: number;
  visibleStartIndex: number;
  visibleStopIndex: number;
} => ({
  overscanStartRowIndex: Math.max(scrollIndex - overscanCount, 0),
  overscanStopRowIndex: Math.min(scrollIndex + overscanCount + rowSize, scrollMaxIndex),
  visibleStartRowIndex: Math.max(scrollIndex, 0),
  visibleStopRowIndex: Math.min(scrollIndex + rowSize, scrollMaxIndex),

  overscanStartIndex: Math.max(scrollIndex - overscanCount, 0) * columnSize,
  overscanStopIndex: Math.min(scrollIndex + overscanCount + rowSize, scrollMaxIndex) * columnSize,
  visibleStartIndex: Math.max(scrollIndex, 0) * columnSize,
  visibleStopIndex: Math.min(scrollIndex + rowSize, scrollMaxIndex) * columnSize
});

export const getWindowCellsRendered = (
  {
    overscanStartIndex,
    overscanStopIndex,
    visibleStartIndex,
    visibleStopIndex
  }: {
    overscanStartIndex: number;
    overscanStopIndex: number;
    visibleStartIndex: number;
    visibleStopIndex: number;
  },
  columnSize: number
): {
  overscanStartRowIndex: number;
  overscanStopRowIndex: number;
  visibleStartRowIndex: number;
  visibleStopRowIndex: number;

  overscanStartIndex: number;
  overscanStopIndex: number;
  visibleStartIndex: number;
  visibleStopIndex: number;
} => ({
  overscanStartRowIndex: overscanStartIndex,
  overscanStopRowIndex: overscanStopIndex,
  visibleStartRowIndex: visibleStartIndex,
  visibleStopRowIndex: visibleStopIndex,

  overscanStartIndex: overscanStartIndex * columnSize,
  overscanStopIndex: overscanStopIndex * columnSize,
  visibleStartIndex: visibleStartIndex * columnSize,
  visibleStopIndex: visibleStopIndex * columnSize
});
