import { Collapse, Divider, Grid, makeStyles, Typography, useTheme } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import useSafeResults from 'components/hooks/useSafeResults';
import AutoHideTagList from 'components/visual/AutoHideTagList';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  title: {
    cursor: 'pointer',
    '&:hover, &:focus': {
      color: theme.palette.text.secondary
    }
  },
  meta_key: {
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }
}));

type TagSectionProps = {
  signatures: any;
  tags: any;
  force?: boolean;
};

const WrappedTagSection: React.FC<TagSectionProps> = ({ signatures, tags, force = false }) => {
  const { t } = useTranslation(['fileDetail']);
  const [open, setOpen] = React.useState(true);
  const theme = useTheme();
  const classes = useStyles();
  const sp2 = theme.spacing(2);
  const { showSafeResults } = useSafeResults();
  const [tagUnsafeMap, setTagUnsafeMap] = React.useState({});

  useEffect(() => {
    if (tags) {
      const newTagUnsafeMap = {};
      for (const tType of Object.keys(tags)) {
        newTagUnsafeMap[tType] = tags[tType].some(i => i[1] !== 'safe' && !i[2]);
      }
      setTagUnsafeMap(newTagUnsafeMap);
    }
  }, [tags]);

  const someSigNotSafe = signatures && signatures.some(i => i[1] !== 'safe' && !i[2]);
  const forceShowSig = signatures && signatures.length !== 0 && (showSafeResults || force);
  const someTagNotSafe = Object.values(tagUnsafeMap).some(Boolean);
  const forceShowTag = Object.keys(tagUnsafeMap).length !== 0 && (showSafeResults || force);

  return (!signatures && !tags) || someTagNotSafe || forceShowTag || someSigNotSafe || forceShowSig ? (
    <div style={{ paddingBottom: sp2, paddingTop: sp2 }}>
      <Typography
        variant="h6"
        onClick={() => {
          setOpen(!open);
        }}
        className={classes.title}
      >
        {t('generated_tags')}
      </Typography>
      <Divider />
      <Collapse in={open} timeout="auto">
        <div style={{ paddingBottom: sp2, paddingTop: sp2 }}>
          {signatures && (someSigNotSafe || forceShowSig) && (
            <Grid container>
              <Grid className={classes.meta_key} item xs={12} sm={3} lg={2}>
                <span style={{ fontWeight: 500 }}>heuristic.signature</span>
              </Grid>
              <Grid item xs={12} sm={9} lg={10}>
                <AutoHideTagList
                  tag_type={'heuristic.signature'}
                  items={signatures.map(item => {
                    return { value: item[0], lvl: item[1], safelisted: item[2] };
                  })}
                  force={force}
                />
              </Grid>
            </Grid>
          )}
          {tags
            ? Object.keys(tags).map((tag_type, i) =>
                tagUnsafeMap[tag_type] || showSafeResults || force ? (
                  <Grid container key={i}>
                    <Grid className={classes.meta_key} item xs={12} sm={3} lg={2}>
                      <span
                        style={{
                          fontWeight: 500
                        }}
                      >
                        {tag_type}
                      </span>
                    </Grid>
                    <Grid item xs={12} sm={9} lg={10}>
                      <AutoHideTagList
                        tag_type={tag_type}
                        items={tags[tag_type].map(item => {
                          return { value: item[0], lvl: item[1], safelisted: item[2] };
                        })}
                        force={force}
                      />
                    </Grid>
                  </Grid>
                ) : null
              )
            : [...Array(3)].map((_, i) => (
                <Grid container key={i} spacing={1}>
                  <Grid item xs={12} sm={3} lg={2}>
                    <Skeleton style={{ height: '2rem' }} />
                  </Grid>
                  <Grid item xs={12} sm={9} lg={10}>
                    <Skeleton style={{ height: '2rem' }} />
                  </Grid>
                </Grid>
              ))}
        </div>
      </Collapse>
    </div>
  ) : null;
};

const TagSection = React.memo(WrappedTagSection);
export default TagSection;
