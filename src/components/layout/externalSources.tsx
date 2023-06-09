import { Checkbox, FormControlLabel, Typography, useTheme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Skeleton from '@mui/material/Skeleton';
import useALContext from 'components/hooks/useALContext';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme =>
  createStyles({
    item: {
      width: '100%',
      '&:hover': {
        background: theme.palette.action.hover
      }
    }
  })
);

type ExternalSourcesProps = {
  settings: any;
  onChange: (name: string) => void;
  disabled?: boolean;
  size?: 'medium' | 'small';
};

function ExternalSources({ settings, onChange, disabled = false, size = 'medium' as 'medium' }: ExternalSourcesProps) {
  const { t } = useTranslation(['settings']);
  const classes = useStyles();
  const theme = useTheme();
  const { configuration } = useALContext();
  return (
    <div style={{ padding: theme.spacing(2), textAlign: 'left' }}>
      <Typography variant="h6">{t('submissions.default_external_sources')}</Typography>
      <Typography variant="caption" gutterBottom>
        {t('submissions.default_external_sources_desc')}
      </Typography>
      {configuration.submission.sha256_sources.map((source, i) => (
        <div key={i}>
          <FormControlLabel
            control={
              settings ? (
                <Checkbox
                  size={size}
                  disabled={disabled}
                  checked={settings.default_external_sources.indexOf(source) !== -1}
                  name="label"
                  onChange={() => onChange(source)}
                />
              ) : (
                <Skeleton
                  style={{
                    height: size === 'medium' ? '2.5rem' : '2rem',
                    width: '1.5rem',
                    marginLeft: theme.spacing(2),
                    marginRight: theme.spacing(2)
                  }}
                />
              )
            }
            label={<Typography variant="body2">{source}</Typography>}
            className={settings && !disabled ? classes.item : null}
          />
        </div>
      ))}
    </div>
  );
}

export default ExternalSources;
