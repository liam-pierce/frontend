import { CircularProgress, makeStyles, Typography } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import clsx from 'clsx';
import { default as React } from 'react';
import { useTranslation } from 'react-i18next';
import { LAYOUT_SIZE, StoreProps } from '../..';

const useHexStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    height: `calc(100vh - ${LAYOUT_SIZE.windowHeight}px)`,
    width: '100%',
    left: 0,
    display: 'grid',
    alignContent: 'center'
  },
  mobile: {
    height: `calc(100vh - ${LAYOUT_SIZE.mobileWindowHeight}px)`
  },
  container: {
    textAlign: 'center'
  },
  text: {
    padding: theme.spacing(2)
  },
  hidden: {
    visibility: 'hidden'
  }
}));

export const WrappedHexLoading = ({ store }: StoreProps) => {
  const { t } = useTranslation(['hexViewer']);
  const classes = useHexStyles();

  return (
    !store.loading.initialized && (
      <div className={clsx(classes.root)}>
        <div className={clsx(classes.container)}>
          {store.loading.isInvalidData ? (
            <>
              <Typography className={clsx(classes.text)} variant="subtitle1" color="error">
                {t('loading.isInvalidData')}
              </Typography>
              <ErrorOutlineIcon color="error" fontSize="large" />
            </>
          ) : (
            <>
              <Typography className={clsx(classes.text)} variant="subtitle1" color="secondary">
                {t(store.loading.message)}
              </Typography>
              <CircularProgress />
            </>
          )}
        </div>
      </div>
    )
  );
};

export const HexLoading = React.memo(WrappedHexLoading);