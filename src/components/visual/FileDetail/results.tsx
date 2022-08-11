import { Collapse, Divider, makeStyles, Typography, useTheme } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ResultCard, { AlternateResult } from '../ResultCard';

const useStyles = makeStyles(theme => ({
  title: {
    cursor: 'pointer',
    '&:hover, &:focus': {
      color: theme.palette.text.secondary
    }
  }
}));

type ResultSectionProps = {
  results: any;
  sid: string;
  alternates?: {
    [serviceName: string]: AlternateResult[];
  };
  force?: boolean;
};

const WrappedResultSection: React.FC<ResultSectionProps> = ({ results, sid, alternates, force = false }) => {
  const { t } = useTranslation(['fileDetail']);
  const [open, setOpen] = React.useState(true);
  const theme = useTheme();
  const classes = useStyles();
  const sp2 = theme.spacing(2);

  return (
    <div style={{ paddingBottom: sp2, paddingTop: sp2 }}>
      <Typography
        variant="h6"
        onClick={() => {
          setOpen(!open);
        }}
        className={classes.title}
      >
        {t('results')}
      </Typography>
      <Divider />
      <Collapse in={open} timeout="auto">
        {useMemo(
          () => (
            <div style={{ paddingBottom: sp2, paddingTop: sp2 }}>
              {results
                ? results.map((result, i) => (
                    <ResultCard
                      key={i}
                      result={result}
                      sid={sid}
                      alternates={alternates ? alternates[result.response.service_name] : null}
                      force={force}
                    />
                  ))
                : [...Array(2)].map((_, i) => <Skeleton key={i} style={{ height: '16rem' }} />)}
            </div>
          ),
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [results, sid]
        )}
      </Collapse>
    </div>
  );
};

const ResultSection = React.memo(WrappedResultSection);
export default ResultSection;
