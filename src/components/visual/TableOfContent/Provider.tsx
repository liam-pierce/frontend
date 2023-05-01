import React from 'react';
import createStore from './createStore';
import Main from './Main';

type TableOfContentProps = {
  children: React.ReactNode;
};

type TableOfContentStore = {
  anchors: AnchorDef[];
  tableOfContent: NodeDef[];
  activeIndex: number;
  activePath: number[];
  expandAll?: boolean;
};

export type AnchorDef = {
  element: HTMLElement;
  link?: HTMLElement;
  hash: string;
  level: number;
  path?: number[];
  title: string;
};

export type NodeDef = AnchorDef & {
  subNodes: NodeDef[];
};

// type LinkItem = {
//   subNodes: LinkItem[];
// };

// type TocItem = {
//   anchor?: HTMLElement;
//   collapse?: boolean;
//   hash?: string; // to replace id
//   id?: string;
//   index?: number;
//   isAdmin?: boolean;
//   level?: number;
//   link?: HTMLElement;
//   path?: number[];
//   title?: string;
// };

// export type TocNode = TocItem & {
//   subNodes?: TocNode[];
// };

const initialStore: TableOfContentStore = {
  anchors: [],
  tableOfContent: [],
  activeIndex: null,
  activePath: [],
  expandAll: true
};

export const { Provider, useStore } = createStore<TableOfContentStore>(initialStore);

export const TableOfContent = ({ children }: TableOfContentProps) => (
  <Provider children={<Main children={children} />} />
);
