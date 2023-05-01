/* eslint-disable import/no-extraneous-dependencies */
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import { Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import useClipboard from 'commons/components/utils/hooks/useClipboard';
import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnchorDef, useTableOfContentStore } from './TableOfContent';

const useStyles = makeStyles(theme => ({
  anchor: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    scrollSnapMarginTop: theme.typography.h1.fontSize,
    scrollMarginTop: theme.typography.h1.fontSize,
    '&:hover>a': {
      display: 'inline-flex',
      opacity: 1
    }
  },
  button: {
    transition: 'display 50ms, opacity 50ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    display: 'hidden',
    opacity: 0,
    minWidth: 0,
    padding: theme.spacing(0.25)
  },
  icon: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5)
  }
}));

type AnchorProps = {
  children?: React.ReactNode;
  className?: string;
  component?: React.ElementType;
  label?: string;
  level?: number;
};

export const Anchor = ({
  children,
  className,
  component: Element = 'div',
  label = null,
  level = 0,
  ...props
}: AnchorProps) => {
  const classes = useStyles();
  const { copy } = useClipboard();

  const [, setStore] = useTableOfContentStore(store => null);
  const [hash, setHash] = useState<string>(null);
  const ref = useRef<HTMLSpanElement>();

  const nextPath = useCallback((path: number[] = [0], depth: number = 0): number[] => {
    let next = [];
    for (let i = 0; i <= depth; ++i) {
      if (i < path.length && i < depth) next = [...next, path[i]];
      else if (i < path.length && i === depth) next = [...next, path[i] + 1];
      else next = [...next, 0];
    }
    return next;
  }, []);

  const formatAnchorPath = useCallback(
    (anchors: AnchorDef[] = []): AnchorDef[] => {
      let anchor = anchors[0];
      let result = [{ ...anchor, path: [0] }];
      let depth = 0;
      for (let i = 1; i < anchors.length; i++) {
        const lastResult = result[result.length - 1];
        if (anchors[i].level < lastResult.level) depth -= 1;
        else if (anchors[i].level > lastResult.level) depth += 1;
        depth = Math.max(depth, 0);
        result = [...result, { ...anchors[i], path: nextPath(lastResult.path, depth) }];
      }
      return result;
    },
    [nextPath]
  );

  const handleClick: MouseEventHandler<HTMLAnchorElement> = useCallback(() => {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' } as ScrollIntoViewOptions);
    const { origin, pathname, search } = window.location;
    copy(`${origin}${pathname}${search}#${hash}`);
  }, [copy, hash]);

  useEffect(() => {
    setStore(store => {
      const newAnchors = formatAnchorPath(store.anchors);
      const path: number[] = newAnchors[newAnchors.length - 1].path;
      const title: string = label || ref?.current?.innerText.replace(/\s/g, '-');
      const newHash: string = `${path.map(p => p + 1).join('.')}-${title}`;
      setHash(newHash);
      return { anchors: [...store.anchors, { hash: newHash, level, path, element: ref.current, title }] };
    });
  }, [formatAnchorPath, label, level, setStore]);

  return (
    <Element {...props} id={hash} ref={ref} className={clsx(className, classes.anchor)}>
      {children}
      <Button
        classes={{ root: clsx(classes.button) }}
        component={Link}
        size="small"
        tabIndex={-1}
        to={`${window.location.search}#${hash}`}
        variant="outlined"
        onClick={handleClick}
      >
        <LinkOutlinedIcon className={classes.icon} />
      </Button>
    </Element>
  );
};
