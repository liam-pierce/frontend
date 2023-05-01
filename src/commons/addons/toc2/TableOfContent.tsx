import React from 'react';
import createFastContext from './createFastContext';
import { TableOfContentContainer } from './TableOfContentContainer';

type TableOfContentProps = {
  children: React.ReactNode;
};

type TableOfContentStore = {
  anchors: AnchorDef[];
};

export type AnchorDef = {
  element: HTMLElement;
  hash: string;
  level: number;
  path?: number[];
  title: string;
};

type LinkItem = {
  subNodes: LinkItem[];
};

type TocItem = {
  anchor?: HTMLElement;
  collapse?: boolean;
  hash?: string; // to replace id
  id?: string;
  index?: number;
  isAdmin?: boolean;
  level?: number;
  link?: HTMLElement;
  path?: number[];
  title?: string;
};

export type TocNode = TocItem & {
  subNodes?: TocNode[];
};

export const { Provider: TableOfContentProvider, useStore: useTableOfContentStore } =
  createFastContext<TableOfContentStore>({
    anchors: []
  });

export const TableOfContent = ({ children }: TableOfContentProps) => (
  <TableOfContentProvider>
    <TableOfContentContainer>{children}</TableOfContentContainer>
  </TableOfContentProvider>
);
