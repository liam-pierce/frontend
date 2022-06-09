import { makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StoreProps, useDispatch } from '../..';

const useHexStyles = makeStyles(theme => ({
  autocompleteInputRoot: {
    '& > fieldset': {
      border: 'none !important',
      borderWidth: '0px'
    }
  },
  autocompletePopper: {
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    },
    width: '50vw'
  },
  autocompletePaper: {
    margin: `${theme.spacing(1)}px 0px`,
    borderRadius: `0 0 ${theme.spacing(0.5)}px ${theme.spacing(0.5)}px`,
    width: '50vw'
  },
  autocompleteList: {
    margin: 0,
    padding: 0,
    maxHeight: `180px`
  },
  autocompleteOption: {
    fontSize: theme.typography.fontSize,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(1),
    '&[data-focus="true"]': {
      cursor: 'pointer',
      backgroundColor: theme.palette.action.hover
    },
    '&[aria-selected="true"]': {
      backgroundColor: theme.palette.action.selected
    }
  }
}));

export const WrappedHexSearchbar = ({ store }: StoreProps) => {
  const classes = useHexStyles();
  const { t } = useTranslation(['hexViewer']);
  const theme = useTheme();
  const upXS = useMediaQuery(theme.breakpoints.up('xs'));

  const { onSearchBarChange, onSearchBarInputChange, onSearchBarFocus, onSearchBarBlur, onSearchBarKeyDown } =
    useDispatch();

  const [value, setValue] = React.useState<string>('');
  const [inputValue, setInputValue] = React.useState<string>('');

  const [suggestionOpen, setSuggestionOpen] = React.useState(true);
  const [suggestionLabels, setSuggestionLabels] = React.useState(['asd']);

  return (
    <Autocomplete
      classes={{
        inputRoot: classes.autocompleteInputRoot,
        popper: classes.autocompletePopper,
        paper: classes.autocompletePaper,
        listbox: classes.autocompleteList,
        option: classes.autocompleteOption
      }}
      freeSolo
      disableClearable
      handleHomeEndKeys
      closeIcon={null}
      fullWidth
      size="small"
      open={suggestionOpen && upXS && false}
      options={suggestionLabels}
      value={value}
      onChange={(event: React.ChangeEvent, newValue: string | null) => {
        console.log('onChange', newValue);
        setValue(newValue);
        onSearchBarChange({ value: newValue });
      }}
      inputValue={inputValue}
      onInputChange={(event: React.ChangeEvent, newInputValue: string) => {
        console.log('onInputChange', newInputValue);
        setInputValue(newInputValue);
        onSearchBarInputChange({ inputValue: newInputValue });
      }}
      onFocus={event => onSearchBarFocus()}
      onBlur={event => onSearchBarBlur()}
      onKeyDown={event => {
        // onSearchBarKeyDown(event);
      }}
      // onFocus={event => {
      //   onSuggestionFocus();
      // }}
      // onBlur={event => {
      //   onSuggestionBlur();
      // }}
      // onChange={(event: React.ChangeEvent, newValue: string | null) => {
      //   onSuggestionChange(newValue);
      // }}
      // inputValue={searchValue}
      // onInputChange={(event: React.ChangeEvent, newInputValue: string) => {
      //   onSuggestionInputChange(newInputValue);
      //   onHistoryChange();
      //   onSearchInputChange(newInputValue);
      // }}
      // onKeyDown={event => {
      //   onSearchKeyDown(event);
      //   onHistoryKeyDown(event);
      //   onSuggestionKeyDown(event);
      // }}
      renderInput={params => (
        <TextField
          {...params}
          placeholder={t('find')}
          variant={'outlined'}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password'
          }}
        />
      )}
    />
  );
};

export const HexSearchBar = React.memo(
  WrappedHexSearchbar,
  (prevProps: Readonly<StoreProps>, nextProps: Readonly<StoreProps>) => prevProps === nextProps
);
export default HexSearchBar;
