import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ClearIcon from '@mui/icons-material/Clear';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StoreProps, TooltipIconButton, useDispatch } from '../..';

const useHexStyles = makeStyles(theme => ({
  iconButton: {
    padding: 10,
    [theme.breakpoints.only('sm')]: {
      padding: 4
    },
    [theme.breakpoints.only('xs')]: {
      padding: 2
    }
  }
}));

export const WrappedHexSearchButtons = ({ store }: StoreProps) => {
  const { t } = useTranslation(['hexViewer']);
  const classes = useHexStyles();
  const { onSelectedSearchIndexChange, onSearchClear } = useDispatch();
  const { inputValue, selectedResult } = store.search;

  return (
    <>
      <TooltipIconButton
        classes={{ iconButton: classes.iconButton }}
        title={t('previous-match')}
        onClick={() => onSelectedSearchIndexChange({ index: selectedResult - 1 })}
        disabled={selectedResult === null}
        icon={<ArrowUpward />}
      />
      <TooltipIconButton
        classes={{ iconButton: classes.iconButton }}
        title={t('next-match')}
        disabled={selectedResult === null}
        onClick={() => onSelectedSearchIndexChange({ index: selectedResult + 1 })}
        icon={<ArrowDownward />}
      />
      <TooltipIconButton
        classes={{ iconButton: classes.iconButton }}
        title={t('clear')}
        onClick={() => onSearchClear()}
        disabled={inputValue === null || inputValue === ''}
        icon={<ClearIcon />}
      />
    </>
  );
};

export const HexSearchButtons = React.memo(
  WrappedHexSearchButtons,
  (prevProps: Readonly<StoreProps>, nextProps: Readonly<StoreProps>) =>
    prevProps.store.search.inputValue === nextProps.store.search.inputValue &&
    prevProps.store.search.selectedResult === nextProps.store.search.selectedResult
);
